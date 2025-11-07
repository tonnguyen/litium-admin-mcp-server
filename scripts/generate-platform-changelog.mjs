#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import { JSDOM } from "jsdom";

const htmlPath = new URL("../tmp/legacy-pages/platform-change-log-release-notes.html", import.meta.url);
const outputPath = new URL("../docs/platform/changelog.mdx", import.meta.url);

function cleanText(text) {
  return text.replace(/\s+/g, " ").trim();
}

function formatItem(idCell, descriptionCell) {
  const idLink = idCell.querySelector("a");
  const idText = cleanText(idCell.textContent || "");
  const description = cleanText(descriptionCell.textContent || "");
  if (idLink) {
    const href = idLink.getAttribute("href") || "";
    return `- [${idText}](${href}) — ${description}`;
  }
  return `- ${idText ? `${idText}: ` : ""}${description}`;
}

async function generate() {
  const html = await readFile(htmlPath, "utf8");
  const dom = new JSDOM(html);
  const { document } = dom.window;

  const body = document.querySelector("td.rightContentArea");
  if (!body) {
    throw new Error("Could not find release notes content area");
  }

  const updates = [];
  const headings = Array.from(body.querySelectorAll("h2"));

  for (const h2 of headings) {
    const versionLabelRaw = cleanText(h2.textContent || "");
    if (!versionLabelRaw.toLowerCase().startsWith("version")) {
      continue;
    }

    const label = versionLabelRaw.replace(/^[Vv]ersion\s*/, "");

    let node = h2.nextSibling;
    let releaseDate = "";
    const sections = [];
    const categoryTags = new Set();
    let currentSection = null;
    let currentCategory = null;

    const stopTags = new Set(["H1", "H2"]);

    while (node) {
      if (node.nodeType === 1 && stopTags.has(node.tagName)) {
        break;
      }

      if (node.nodeType === 3) {
        const text = cleanText(node.textContent || "");
        if (text.startsWith("Release date:")) {
          releaseDate = text.replace("Release date:", "").trim();
        }
      } else if (node.nodeType === 1) {
        const element = node;
        if (element.tagName === "P") {
          const text = cleanText(element.textContent || "");
          if (!releaseDate && text.startsWith("Release date:")) {
            releaseDate = text.replace("Release date:", "").trim();
          }
        }

        if (element.tagName === "H3") {
          const title = cleanText(element.textContent || "");
          currentSection = { title, entries: [] };
          sections.push(currentSection);
          currentCategory = null;
        } else if (element.tagName === "H4") {
          if (!currentSection) {
            currentSection = { title: "Details", entries: [] };
            sections.push(currentSection);
          }
          const category = cleanText(element.textContent || "");
          currentCategory = { category, items: [] };
          currentSection.entries.push(currentCategory);
          if (category) {
            categoryTags.add(category);
          }
        } else if (element.tagName === "TABLE") {
          if (currentSection && currentCategory) {
            const rows = Array.from(element.querySelectorAll("tr"));
            for (const row of rows) {
              const cells = row.querySelectorAll("td");
              if (cells.length >= 2) {
                currentCategory.items.push(formatItem(cells[0], cells[1]));
              } else if (cells.length === 1) {
                currentCategory.items.push(`- ${cleanText(cells[0].textContent || "")}`);
              }
            }
          }
        }
      }

      node = node.nextSibling;
    }

    const tags = Array.from(categoryTags);

    const lines = [];
    for (const section of sections) {
      if (!section.entries.length) continue;
      lines.push(`  **${section.title}**`);
      lines.push("");
      for (const entry of section.entries) {
        if (!entry.items.length) continue;
        lines.push(`  - **${entry.category}**`);
        for (const item of entry.items) {
          lines.push(`    ${item}`);
        }
      }
      lines.push("");
    }

    updates.push({ label, releaseDate, tags, content: lines.join("\n").trimEnd() });
  }

  const mdxLines = [];
  mdxLines.push("---");
  mdxLines.push('title: "Changelog"');
  mdxLines.push('description: "Litium platform release notes"');
  mdxLines.push("rss: true");
  mdxLines.push("---\n");

  for (const update of updates) {
    const tagsArray = update.tags.length ? update.tags.map((tag) => `"${tag}"`).join(", ") : "";
    const tagsProp = tagsArray ? ` tags={[${tagsArray}]}` : "";
    mdxLines.push(`<Update label="${update.label}" description="${update.releaseDate}"${tagsProp}>`);
    if (update.content) {
      mdxLines.push(update.content.replace(/^/gm, "  "));
    }
    mdxLines.push("</Update>\n");
  }

  await writeFile(outputPath, mdxLines.join("\n"), "utf8");
  console.log(`Wrote changelog to ${outputPath.pathname}`);
}

generate().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
