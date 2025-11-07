#!/usr/bin/env node

import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { JSDOM } from "jsdom";

const rootDir = new URL("../", import.meta.url);
const indexHtmlPath = new URL("tmp/legacy-pages/platform-change-log-what-s-new.html", rootDir);
const subPageDir = new URL("tmp/legacy-pages/", rootDir);
const overviewOutput = new URL("docs/platform/whats-new.mdx", rootDir);
const detailDir = new URL("docs/platform/whats-new/", rootDir);

function cleanText(text) {
  return text.replace(/\s+/g, " ").trim();
}

async function generate() {
  await mkdir(detailDir, { recursive: true });

  const html = await readFile(indexHtmlPath, "utf8");
  const dom = new JSDOM(html);
  const { document } = dom.window;

  const body = document.querySelector("td.rightContentArea");
  if (!body) {
    throw new Error("Could not find what's new content area");
  }

  const sections = [];
  const containers = Array.from(body.querySelectorAll("h3.nav"));

  for (const heading of containers) {
    const link = heading.querySelector("a");
    if (!link) continue;
    const fullTitle = cleanText(link.textContent || "");
    const match = fullTitle.match(/What's new\s+(.*)/i);
    const label = match ? match[1] : fullTitle;
    const yearMatch = label.match(/(\d{4})/);
    const yearTag = yearMatch ? yearMatch[1] : undefined;

    let summaryNode = heading.parentElement?.querySelector("div");
    let summaryText = "";
    if (summaryNode) {
      summaryText = cleanText(summaryNode.textContent || "");
    }

    const href = link.getAttribute("href") || "";
    const slug = href.split("/").filter(Boolean).pop();

    const detailFile = slug ? `platform-change-log-what-s-new-${slug.replace(/\//g, "-")}.html` : null;
    let detailContent = "";
    if (detailFile) {
      try {
        const detailHtml = await readFile(new URL(detailFile, subPageDir), "utf8");
        const detailDom = new JSDOM(detailHtml);
        const detailBody = detailDom.window.document.querySelector("td.rightContentArea");
        if (detailBody) {
          const contentNodes = Array.from(detailBody.querySelectorAll("p, ul, ol, h2, h3, h4"));
          detailContent = contentNodes.map((node) => node.outerHTML || "").join("\n");
        }
      } catch (error) {
        console.warn(`Warning: could not read detail page for ${slug}: ${error.message}`);
      }
    }

    const detailLines = [];
    detailLines.push("---");
    detailLines.push(`title: "What's new ${label}"`);
    detailLines.push(`description: ${JSON.stringify(summaryText || label)}`);
    detailLines.push("---\n");
    if (summaryText) {
      detailLines.push(summaryText);
      detailLines.push("");
    }
    if (detailContent) {
      const contentDom = new JSDOM(`<div>${detailContent}</div>`);
      const fragment = contentDom.window.document.querySelector("div");
      if (fragment) {
        detailLines.push(fragment.textContent ? fragment.textContent.trim() : "");
      }
    }
    detailLines.push("\n[Back to what's new](/platform/whats-new)");

    if (slug) {
      await writeFile(new URL(`${slug}.mdx`, detailDir), detailLines.join("\n"), "utf8");
    }

    const contentLines = [];
    if (summaryText) {
      contentLines.push(summaryText);
      contentLines.push("");
    }
    if (slug) {
      contentLines.push(`[Read more](/platform/whats-new/${slug})`);
    } else {
      contentLines.push(`[Read more](${href})`);
    }

    sections.push({ label, tags: yearTag ? [yearTag] : [], content: contentLines.join("\n") });
  }

  const mdxLines = [];
  mdxLines.push("---");
  mdxLines.push('title: "What\'s new"');
  mdxLines.push('description: "Latest Litium product highlights and announcements"');
  mdxLines.push("---\n");

  for (const section of sections) {
    mdxLines.push(`## ${section.label}`);
    mdxLines.push("");
    mdxLines.push(section.content);
    mdxLines.push("");
    if (section.tags.length) {
      mdxLines.push(`_Year: ${section.tags.join(", " )}_`);
      mdxLines.push("");
    }
  }

  await writeFile(overviewOutput, mdxLines.join("\n"), "utf8");
  console.log(`Wrote what's new overview to ${overviewOutput.pathname}`);
}

generate().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

