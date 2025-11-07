#!/usr/bin/env node

import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { basename, extname } from "node:path";
import { fileURLToPath } from "node:url";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";
import { JSDOM } from "jsdom";

const baseUrl = "https://docs.litium.com";
const rootDir = new URL("../", import.meta.url);
const inputDir = new URL("tmp/legacy-guides/", rootDir);
const outputDir = new URL("docs/platform/guides/", rootDir);
const mediaDir = new URL("docs/platform/guides/media/", rootDir);
const filesDir = new URL("docs/platform/guides/files/", rootDir);

async function ensureDir(url) {
  await mkdir(url, { recursive: true });
}

function slugFromCanonical(document) {
  const canonical = document.querySelector("link[rel=canonical]")?.getAttribute("href");
  if (!canonical) return null;
  const url = new URL(canonical, baseUrl);
  const segments = url.pathname.split("/").filter(Boolean);
  const guidesIndex = segments.indexOf("guides");
  if (guidesIndex === -1) return null;
  const relevant = segments.slice(guidesIndex + 1);
  if (relevant.length === 0) {
    return "overview";
  }
  return relevant.map((segment) => segment.replace(/_/g, "-")).join("-");
}

function titleFromDocument(document) {
  return document.querySelector("title")?.textContent?.trim() ?? "Untitled";
}

function collectDescription(container, document) {
  const paragraphs = Array.from(container.querySelectorAll("p"))
    .map((p) => p.textContent?.trim())
    .filter(Boolean);
  if (paragraphs.length > 0) {
    return paragraphs[0];
  }
  const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute("content")?.trim();
  if (metaDescription) {
    return metaDescription;
  }
  return "";
}

function sanitizeDescription(description) {
  if (!description) return "";
  return description.replace(/\s+/g, " ").trim();
}

function cleanupContainer(container) {
  const selectorsToRemove = [
    "div.article-metadata",
    "div.clear",
    "div.published-date",
    "div#feedback",
    "div.articlewithchildslinks > div.article-metadata",
    "form",
  ];

  for (const selector of selectorsToRemove) {
    container.querySelectorAll(selector).forEach((node) => node.remove());
  }

  container.querySelectorAll("td.leftmenu").forEach((node) => node.remove());
  container.querySelectorAll("script, style").forEach((node) => node.remove());

  const firstHeading = container.querySelector("h1");
  if (firstHeading) {
    firstHeading.remove();
  }
}

const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});
turndownService.use(gfm);

turndownService.addRule("preToCodeBlock", {
  filter: ["pre"],
  replacement(_, node) {
    const className = node.getAttribute("class") || "";
    const match = className.match(/brush:\s*([\w-]+)/i);
    const dataLang = node.getAttribute("data-pbcklang") || "";
    const language = (match && match[1]) || dataLang || "text";
    const code = node.textContent.replace(/^\n+|\n+$/g, "");
    return `\n\n\`\`\`${language.toLowerCase()}\n${code}\n\`\`\`\n\n`;
  },
});

const downloadedImages = new Map();
const downloadedFiles = new Map();

function filenameFromSrc(src) {
  const url = new URL(src, baseUrl);
  const name = basename(url.pathname);
  return name || `asset-${downloadedImages.size + downloadedFiles.size + 1}${extname(url.pathname) || ".bin"}`;
}

async function downloadAssetIfNeeded(src, targetDir, cacheMap, subdir) {
  const absoluteUrl = new URL(src, baseUrl).href;
  if (cacheMap.has(absoluteUrl)) {
    return cacheMap.get(absoluteUrl);
  }

  const filename = filenameFromSrc(absoluteUrl);
  const outputPath = new URL(filename, targetDir);

  try {
    await stat(fileURLToPath(outputPath));
  } catch {
    const response = await fetch(absoluteUrl, {
      headers: {
        "User-Agent": "litium-docs-migrator/1.0 (+https://litium.com)",
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to download asset ${absoluteUrl}: HTTP ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    await writeFile(fileURLToPath(outputPath), Buffer.from(arrayBuffer));
  }

  const relativePath = `./${subdir}/${filename}`;
  cacheMap.set(absoluteUrl, relativePath);
  return relativePath;
}

async function convertFile(fileName) {
  const inputPath = new URL(fileName, inputDir);
  const html = await readFile(inputPath, "utf8");
  const dom = new JSDOM(html);
  const { document } = dom.window;

  const rightContent = document.querySelector("td.rightContentArea");
  if (!rightContent) {
    console.warn(`Skipping ${fileName}: no rightContentArea found`);
    return;
  }

  const container = rightContent.cloneNode(true);
  cleanupContainer(container);

  container.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    const href = anchor.getAttribute("href");
    if (!href) return;
    anchor.setAttribute("href", href.toLowerCase());
  });

  const anchors = Array.from(container.querySelectorAll("a[href]"));
  for (const anchor of anchors) {
    const href = anchor.getAttribute("href");
    if (!href) continue;
    if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("javascript:")) continue;
    if (href.startsWith("/storage/")) {
      const extension = extname(new URL(href, baseUrl).pathname).toLowerCase();
      const imageExtensions = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"]);
      const targetDir = imageExtensions.has(extension) ? mediaDir : filesDir;
      const cache = imageExtensions.has(extension) ? downloadedImages : downloadedFiles;
      const subdir = imageExtensions.has(extension) ? "media" : "files";
      try {
        const newHref = await downloadAssetIfNeeded(href, targetDir, cache, subdir);
        anchor.setAttribute("href", newHref);
        anchor.removeAttribute("title");
      } catch (error) {
        console.warn(`Warning: could not download asset ${href} for ${fileName}: ${error.message}`);
      }
    }
  }

  const images = Array.from(container.querySelectorAll("img"));
  for (const img of images) {
    const src = img.getAttribute("src");
    if (!src) continue;
    try {
      const newSrc = await downloadAssetIfNeeded(src, mediaDir, downloadedImages, "media");
      img.setAttribute("src", newSrc);
      img.removeAttribute("style");
      img.removeAttribute("width");
      img.removeAttribute("height");
    } catch (error) {
      console.warn(`Warning: could not download image ${src} for ${fileName}: ${error.message}`);
    }
  }

  const title = titleFromDocument(document);
  const description = sanitizeDescription(collectDescription(container, document));

  const slug = slugFromCanonical(document) ?? basename(fileName, ".html");
  let markdown = turndownService.turndown(container.innerHTML);
  markdown = markdown.replace(/\u00a0/g, " ");
  markdown = markdown.replace(/\n- {2,}/g, "\n- ");
  markdown = markdown.replace(/\n( {2,})- {2,}/g, (_match, spaces) => `\n${spaces}- `);

  const frontMatterLines = [
    "---",
    `title: ${JSON.stringify(title)}`,
    `description: ${JSON.stringify(description || title)}`,
    "---",
    "",
  ];

  const outputContent = `${frontMatterLines.join("\n")}${markdown.trim()}\n`;

  const outputPath = new URL(`${slug}.mdx`, outputDir);
  await writeFile(outputPath, outputContent, "utf8");
  console.log(`Converted ${fileName} -> ${outputPath.pathname}`);
}

async function main() {
  await ensureDir(outputDir);
  await ensureDir(mediaDir);
  await ensureDir(filesDir);

  const entries = await readdir(inputDir);
  const htmlFiles = entries.filter((name) => name.endsWith(".html"));

  for (const fileName of htmlFiles) {
    await convertFile(fileName);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

