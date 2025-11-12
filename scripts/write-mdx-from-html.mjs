#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import TurndownService from "turndown";
import path from "node:path";

if (process.argv.length < 4) {
  console.error("Usage: write-mdx-from-html.mjs <html-file> <output-mdx>");
  process.exit(1);
}

const [htmlPath, outputPath] = process.argv.slice(2);

const html = await readFile(htmlPath, "utf8");

const match =
  html.match(/<td class="rightContentArea">([\s\S]*?)<!-- #article -->/) ??
  html.match(/<div class="articlewithchildslinks[^>]*>([\s\S]*?)<div class="clear/);

if (!match) {
  console.error("Unable to locate article content in file:", htmlPath);
  process.exit(1);
}

const segment = match[1];

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
});

turndown.addRule("preBlock", {
  filter: "pre",
  replacement: function (_content, node) {
    const text = node.textContent.replace(/\r\n/g, "\n").trimEnd();
    const className = node.getAttribute("class") ?? "";
    const langMatch = className.match(/brush:\s*([\w-]+)/i);
    const lang = langMatch ? langMatch[1].toLowerCase() : "";
    const fence = lang ? `\`\`\`${lang}\n` : "```\n";
    return `\n${fence}${text}\n\`\`\`\n`;
  },
});

turndown.addRule("releaseNotesTable", {
  filter: function (node) {
    return (
      node.nodeName === "TABLE" &&
      node.getAttribute("class") &&
      node.getAttribute("class").includes("release-notes")
    );
  },
  replacement: function (_content, node) {
    const rows = Array.from(node.querySelectorAll("tr"));
    if (rows.length === 0) {
      return "\n";
    }
    const lines = rows.map((row) => {
      const cells = Array.from(row.querySelectorAll("td"));
      if (cells.length === 0) {
        return null;
      }
      const idCell = cells[0];
      const descCell = cells[1];
      const link = idCell.querySelector("a");
      const idText = link ? link.textContent.trim() : idCell.textContent.trim();
      const href = link ? link.getAttribute("href") : null;
      const desc = descCell ? descCell.textContent.trim() : "";
      const idPart = href ? `[${idText}](${href})` : idText;
      return `- ${idPart} ${desc}`.trim();
    });
    return `\n${lines.filter(Boolean).join("\n")}\n`;
  },
});

turndown.addRule("defaultTable", {
  filter: function (node) {
    return node.nodeName === "TABLE";
  },
  replacement: function (_content, node) {
    const rows = Array.from(node.querySelectorAll("tr"));
    if (rows.length === 0) {
      return "\n";
    }
    const lines = rows.map((row) => {
      const cells = Array.from(row.querySelectorAll("td,th")).map((cell) =>
        cell.textContent.replace(/\s+/g, " ").trim()
      );
      return `- ${cells.join(" | ")}`;
    });
    return `\n${lines.join("\n")}\n`;
  },
});

const markdown = turndown.turndown(segment).trimEnd();

const lines = markdown.split("\n");
let title = path.basename(outputPath, path.extname(outputPath));
let description = "";

for (const line of lines) {
  if (line.startsWith("# ")) {
    title = line.replace(/^#\s*/, "").trim();
    break;
  }
}

for (const line of lines) {
  const trimmed = line.trim();
  if (
    trimmed &&
    !trimmed.startsWith("#") &&
    !trimmed.startsWith("- ") &&
    !trimmed.startsWith("* ") &&
    !trimmed.match(/^`{3}/)
  ) {
    description = trimmed.replace(/\s+/g, " ");
    break;
  }
}

const frontMatter = `---\ntitle: ${title}\ndescription: ${description || title}\n---\n\n`;

await writeFile(outputPath, `${frontMatter}${markdown}\n`, "utf8");

