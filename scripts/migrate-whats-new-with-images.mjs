#!/usr/bin/env node
/* eslint-env node */

import { mkdir, writeFile } from "node:fs/promises";
import { JSDOM } from "jsdom";
import fetch from "node-fetch";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const detailDir = path.join(rootDir, "docs/platform/whats-new");
const imagesDir = path.join(rootDir, "docs/images/platform/whats-new");

const whatsNewPages = [
  { slug: "what-s-new-october-2025", label: "October 2025" },
  { slug: "what-s-new-september-2025", label: "September 2025" },
  { slug: "what-s-new-june-2025", label: "June 2025" },
  { slug: "what-s-new-may-2025", label: "May 2025" },
  { slug: "what-s-new-march-2025", label: "March 2025" },
  { slug: "what-s-new-january-2025", label: "January 2025" },
  { slug: "what-s-new-november-2024", label: "November 2024" },
  { slug: "what-s-new-september-2024", label: "September 2024" },
  { slug: "what-s-new-june-2024", label: "June 2024" },
  { slug: "what-s-new-may-2024", label: "May 2024" },
  { slug: "what-s-new-march-2024", label: "March 2024" },
  { slug: "what-s-new-january-2024", label: "January 2024" },
  { slug: "what-s-new-november-2023", label: "November 2023" },
  { slug: "what-s-new-september-2023", label: "September 2023" },
  { slug: "what-s-new-8-11", label: "8.11" },
  { slug: "what-s-new-8-10", label: "8.10" },
  { slug: "what-s-new-8-9", label: "8.9" },
  { slug: "what-s-new-8-8", label: "8.8" },
  { slug: "what-s-new-8-7", label: "8.7" },
  { slug: "what-s-new-8-6", label: "8.6" },
  { slug: "what-s-new-8-5", label: "8.5" },
  { slug: "what-s-new-8-4", label: "8.4" },
  { slug: "what-s-new-8-3", label: "8.3" },
  { slug: "what-s-new-8-2", label: "8.2" },
  { slug: "what-s-new-8-1", label: "8.1" },
  { slug: "what-s-new-8-0_2", label: "8.0" },
];

function cleanText(text) {
  return text.replace(/\s+/g, " ").trim();
}

async function downloadImage(imageUrl, localPath) {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.warn(`Failed to download image: ${imageUrl} (${response.status})`);
      return false;
    }
    await mkdir(path.dirname(localPath), { recursive: true });
    await pipeline(response.body, createWriteStream(localPath));
    console.log(`Downloaded: ${path.basename(localPath)}`);
    return true;
  } catch (error) {
    console.warn(`Error downloading image ${imageUrl}:`, error.message);
    return false;
  }
}

function convertHtmlToMarkdown(element) {
  if (!element) return "";

  function processNode(node, listLevel = 0) {
    if (node.nodeType === 3) {
      // Text node
      const text = node.textContent.trim();
      if (text) {
        return text;
      }
      return "";
    }

    if (node.nodeType !== 1) return ""; // Only process element nodes

    const tagName = node.tagName?.toLowerCase();

    switch (tagName) {
      case "h1":
        return `# ${cleanText(node.textContent)}\n\n`;
      case "h2":
        return `## ${cleanText(node.textContent)}\n\n`;
      case "h3":
        return `### ${cleanText(node.textContent)}\n\n`;
      case "h4":
        return `#### ${cleanText(node.textContent)}\n\n`;
      case "p": {
        // Check if paragraph contains images or other inline elements
        const hasImages = node.querySelector("img");
        if (hasImages) {
          // Process children to preserve images
          let result = "";
          for (const child of node.childNodes) {
            result += processNode(child, listLevel);
          }
          return result + "\n\n";
        }
        return `${cleanText(node.textContent)}\n\n`;
      }
      case "ul":
      case "ol": {
        const items = Array.from(node.children)
          .filter((child) => child.tagName?.toLowerCase() === "li")
          .map((li) => {
            const prefix = tagName === "ul" ? "- " : "1. ";
            return `${prefix}${cleanText(li.textContent)}`;
          })
          .join("\n");
        return items ? `${items}\n\n` : "";
      }
      case "a": {
        const text = cleanText(node.textContent);
        const href = node.getAttribute("href");
        if (href && text) {
          return `[${text}](${href})`;
        }
        return text;
      }
      case "strong":
      case "b":
        return `**${cleanText(node.textContent)}**`;
      case "em":
      case "i":
        return `_${cleanText(node.textContent)}_`;
      case "code":
        return `\`${cleanText(node.textContent)}\``;
      case "br":
        return "\n";
      case "img": {
        const src = node.getAttribute("src");
        const alt = node.getAttribute("alt") || "";
        if (src) {
          return `![${alt}](${src})\n\n`;
        }
        return "";
      }
      default: {
        // Process children recursively
        let result = "";
        for (const child of node.childNodes) {
          result += processNode(child, listLevel);
        }
        return result;
      }
    }
  }

  return processNode(element);
}

async function migratePage(pageInfo) {
  const { slug, label } = pageInfo;
  const url = `https://docs.litium.com/platform/change-log/what-s-new/${slug}`;

  console.log(`\nMigrating: ${label} (${slug})`);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status}`);
      return;
    }

    const html = await response.text();
    const dom = new JSDOM(html);
    const { document } = dom.window;

    // Find the main content area
    const contentArea = document.querySelector("td.rightContentArea");
    if (!contentArea) {
      console.error(`Could not find content area for ${slug}`);
      return;
    }

    // Extract title and description
    const firstH1 = contentArea.querySelector("h1");
    const title = firstH1 ? cleanText(firstH1.textContent).replace(/^🎉\s*/, "") : `What's new ${label}`;
    
    // Get description from the first paragraph after the title
    let description = "";
    if (firstH1 && firstH1.nextElementSibling) {
      let next = firstH1.nextElementSibling;
      while (next && next.tagName?.toLowerCase() !== "h1" && next.tagName?.toLowerCase() !== "h2") {
        if (next.tagName?.toLowerCase() === "p" && next.textContent.trim()) {
          description = cleanText(next.textContent);
          break;
        }
        next = next.nextElementSibling;
      }
    }

    // Find and download all images
    const images = Array.from(contentArea.querySelectorAll("img"));
    const imageMap = new Map();

    console.log(`  Found ${images.length} images`);

    for (const img of images) {
      let src = img.getAttribute("src");
      if (!src) continue;

      // Convert relative URLs to absolute
      if (src.startsWith("/")) {
        src = `https://docs.litium.com${src}`;
      }

      // Skip if it's not an http/https URL
      if (!src.startsWith("http")) continue;

      // Skip logo images
      if (src.includes("/UI/img/") || src.includes("Logo")) {
        console.log(`  Skipping logo: ${src}`);
        continue;
      }

      console.log(`  Processing image: ${src}`);

      // Extract filename
      const urlObj = new URL(src);
      const urlPath = urlObj.pathname;
      const fileName = path.basename(urlPath);
      let decodedFileName = decodeURIComponent(fileName);
      // Normalize to NFC to avoid macOS NFD issues and S3 key mismatches
      try {
        // Use built-in Intl to normalize if available
        if (typeof decodedFileName.normalize === 'function') {
          decodedFileName = decodedFileName.normalize('NFC');
        }
      } catch {}

      console.log(`  Filename: ${decodedFileName}`);

      // Download image
      const localImagePath = path.join(imagesDir, decodedFileName);
      // URL-encode using NFC for the markdown reference
      let encodedFileName = decodedFileName;
      if (typeof encodedFileName.normalize === 'function') {
        encodedFileName = encodedFileName.normalize('NFC');
      }
      encodedFileName = encodeURIComponent(encodedFileName).replace(/%2F/g, '/');
      const relativePath = `/images/platform/whats-new/${encodedFileName}`;

      const downloaded = await downloadImage(src, localImagePath);
      if (downloaded) {
        // Update the img src attribute to use the new relative path with encoded filename
        img.setAttribute("src", relativePath);
        imageMap.set(src, relativePath);
        console.log(`  Mapped to: ${relativePath}`);
      }
    }

    // Update image src attributes
    // (No longer needed as we update them during download loop)

    // Convert content to markdown
    let markdown = "";

    // Process all content
    const contentElements = Array.from(contentArea.children);
    for (const element of contentElements) {
      // Skip navigation elements
      if (
        element.classList.contains("nav") ||
        element.querySelector(".footerFeedback") ||
        element.querySelector("footer")
      ) {
        continue;
      }

      markdown += convertHtmlToMarkdown(element);
    }

    // Clean up the markdown
    markdown = markdown
      .replace(/\n{3,}/g, "\n\n") // Remove excessive newlines
      .replace(/[ \t]+\n/g, "\n") // Remove trailing whitespace
      .trim();

    // Create MDX content
    const mdxContent = `---
title: "${title}"
description: "${description || label}"
---

${markdown}
`;

    // Write the file
    const outputPath = path.join(detailDir, `${slug}.mdx`);
    await writeFile(outputPath, mdxContent, "utf8");
    console.log(`✓ Wrote: ${slug}.mdx`);
  } catch (error) {
    console.error(`Error migrating ${slug}:`, error.message);
  }
}

async function main() {
  await mkdir(detailDir, { recursive: true });
  await mkdir(imagesDir, { recursive: true });

  console.log("Starting migration of What's New pages...\n");

  for (const page of whatsNewPages) {
    await migratePage(page);
    // Add a small delay to avoid overwhelming the server
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log("\n✓ Migration complete!");
}

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exitCode = 1;
});
