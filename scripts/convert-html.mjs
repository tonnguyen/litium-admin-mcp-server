#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import TurndownService from "turndown";

if (process.argv.length < 3) {
  console.error("Usage: convert-html.mjs <html-file>");
  process.exit(1);
}

const filePath = process.argv[2];

const html = await readFile(filePath, "utf8");

const match =
  html.match(/<td class="rightContentArea">([\s\S]*?)<!-- #article -->/) ??
  html.match(/<div class="articlewithchildslinks[^>]*>([\s\S]*?)<div class="clear/);

if (!match) {
  console.error("Unable to locate article content in file:", filePath);
  process.exit(1);
}

let segment = match[1];

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

const markdown = turndown.turndown(segment);

console.log(markdown.trimEnd());

