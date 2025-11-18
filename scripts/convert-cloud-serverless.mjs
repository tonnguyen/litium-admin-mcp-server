#!/usr/bin/env node

import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { basename, extname } from "node:path";
import { fileURLToPath } from "node:url";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";
import { JSDOM } from "jsdom";

const baseUrl = "https://docs.litium.com";
const rootDir = new URL("../", import.meta.url);
const inputDir = new URL("tmp/legacy-cloud-serverless/", rootDir);
const outputDir = new URL("docs/cloud/serverless/", rootDir);
const mediaDir = new URL("docs/cloud/serverless/media/", rootDir);
const filesDir = new URL("docs/cloud/serverless/files/", rootDir);

// Map paths to subdirectories
const pathMapping = {
  "get-started": "get-started",
  "guides": "guides",
  "apps": "apps",
  "faq": "faq",
  "change-log": "change-log",
};

async function ensureDir(url) {
  await mkdir(url, { recursive: true });
}

function slugFromCanonical(document) {
  const canonical = document.querySelector("link[rel=canonical]")?.getAttribute("href");
  if (!canonical) return null;
  const url = new URL(canonical, baseUrl);
  const segments = url.pathname.split("/").filter(Boolean);
  const serverlessIndex = segments.indexOf("serverless");
  if (serverlessIndex === -1) return null;
  const relevant = segments.slice(serverlessIndex + 1);
  if (relevant.length === 0) {
    return "overview";
  }
  return relevant.map((segment) => segment.replace(/_/g, "-")).join("-");
}

function getOutputPath(slug, document) {
  // Determine which subdirectory based on the slug
  // Slugs are like: "get-started-install-litium-cdn", "guides-access-access-control", etc.
  
  // Check if slug starts with any of our mapped paths
  for (const [key, value] of Object.entries(pathMapping)) {
    // Match "get-started", "guides", "apps", "faq", "change-log"
    if (slug === key || slug.startsWith(key + "-")) {
      // Remove the prefix from slug
      const remaining = slug.replace(new RegExp(`^${key}-?`), "");
      if (remaining) {
        return { dir: value, slug: remaining };
      }
      return { dir: value, slug: "overview" };
    }
  }
  
  // Special case: if slug is just "serverless" or empty, it's the overview
  if (slug === "serverless" || slug === "" || !slug) {
    return { dir: "", slug: "overview" };
  }
  
  // Default to root if no match
  return { dir: "", slug };
}

function titleFromDocument(document) {
  return document.querySelector("title")?.textContent?.trim() ?? "Untitled";
}

function collectDescription(container, document) {
  const paragraphs = Array.from(container.querySelectorAll("p"))
    .map((p) => p.textContent?.trim())
    .filter((text) => !!text);
  if (paragraphs.length > 0) {
    return paragraphs[0];
  }
  const metaDescription = document
    .querySelector('meta[name="description"]')
    ?.getAttribute("content")
    ?.trim();
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

  // Remove left navigation if present within the container clone
  container.querySelectorAll("td.leftmenu").forEach((node) => node.remove());

  // Remove script/style tags
  container.querySelectorAll("script, style").forEach((node) => node.remove());

  // Remove feedback sections
  container.querySelectorAll("#feedbacksection1, #feedbacksection2, #feedbacksection3").forEach((node) => node.remove());

  // Remove first H1 since the title comes from frontmatter
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

function filenameFromSrc(src) {
  // Handle data URIs
  if (src.startsWith("data:image/")) {
    // Generate a hash-based filename for data URIs using a simple hash
    const match = src.match(/data:image\/(\w+);/);
    const ext = match ? match[1] : "png";
    // Use more of the base64 data to create unique hashes (skip PNG header, use chars 20-60)
    const base64Data = src.split(",")[1] || "";
    // Create a hash from multiple parts of the base64 string for uniqueness
    const hash1 = base64Data.substring(20, 40).replace(/[^a-zA-Z0-9]/g, "");
    const hash2 = base64Data.substring(40, 60).replace(/[^a-zA-Z0-9]/g, "");
    const hash = (hash1 + hash2).substring(0, 16) || `img${downloadedImages.size + 1}`;
    return `image-${hash}.${ext}`;
  }
  
  const url = new URL(src, baseUrl);
  const name = basename(url.pathname);
  return name || `image-${downloadedImages.size + 1}${extname(url.pathname) || ".png"}`;
}

async function downloadImageIfNeeded(src) {
  // Handle data URIs
  if (src.startsWith("data:image/")) {
    const key = src.substring(0, 100); // Use first 100 chars as key
    if (downloadedImages.has(key)) {
      return downloadedImages.get(key);
    }
    
    const filename = filenameFromSrc(src);
    const outputPath = new URL(filename, mediaDir);
    
    try {
      await stat(fileURLToPath(outputPath));
    } catch {
      // Decode base64 data URI
      const base64Data = src.split(",")[1];
      const buffer = Buffer.from(base64Data, "base64");
      await writeFile(fileURLToPath(outputPath), buffer);
    }
    
    const relativePath = `./media/${filename}`;
    downloadedImages.set(key, relativePath);
    return relativePath;
  }
  
  const absoluteUrl = new URL(src, baseUrl).href;
  if (downloadedImages.has(absoluteUrl)) {
    return downloadedImages.get(absoluteUrl);
  }

  const filename = filenameFromSrc(absoluteUrl);
  const outputPath = new URL(filename, mediaDir);

  try {
    // Check if file already exists on disk
    await stat(fileURLToPath(outputPath));
  } catch {
    const response = await fetch(absoluteUrl, {
      headers: {
        "User-Agent": "litium-docs-migrator/1.0 (+https://litium.com)",
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to download image ${absoluteUrl}: HTTP ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    await writeFile(fileURLToPath(outputPath), Buffer.from(arrayBuffer));
  }

  const relativePath = `./media/${filename}`;
  downloadedImages.set(absoluteUrl, relativePath);
  return relativePath;
}

const downloadedFiles = new Map();

async function downloadFileIfNeeded(src) {
  const absoluteUrl = new URL(src, baseUrl).href;
  if (downloadedFiles.has(absoluteUrl)) {
    return downloadedFiles.get(absoluteUrl);
  }

  const filename = filenameFromSrc(absoluteUrl);
  const outputPath = new URL(filename, filesDir);

  try {
    await stat(fileURLToPath(outputPath));
  } catch {
    const response = await fetch(absoluteUrl, {
      headers: {
        "User-Agent": "litium-docs-migrator/1.0 (+https://litium.com)",
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to download file ${absoluteUrl}: HTTP ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    await writeFile(fileURLToPath(outputPath), Buffer.from(arrayBuffer));
  }

  const relativePath = `./files/${filename}`;
  downloadedFiles.set(absoluteUrl, relativePath);
  return relativePath;
}

async function convertFile(fileName) {
  const inputPath = new URL(fileName, inputDir);
  const html = await readFile(inputPath, "utf8");
  const dom = new JSDOM(html);
  const { document } = dom.window;

  const rightContent = document.querySelector("td.rightContentArea") || 
                       document.querySelector("div.articlewithchildslinks") ||
                       document.querySelector("main") ||
                       document.querySelector("article");
  if (!rightContent) {
    console.warn(`Skipping ${fileName}: no content area found`);
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
    if (href.startsWith("#")) continue;
    if (href.startsWith("mailto:")) continue;
    if (href.startsWith("javascript:")) continue;
    if (href.startsWith("/storage/")) {
      const absolute = new URL(href, baseUrl);
      const extension = extname(absolute.pathname).toLowerCase();
      const imageExtensions = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"]);
      if (!imageExtensions.has(extension)) {
        try {
          const newHref = await downloadFileIfNeeded(href);
          anchor.setAttribute("href", newHref);
          anchor.removeAttribute("title");
        } catch (error) {
          console.warn(`Warning: could not download file ${href} for ${fileName}: ${error.message}`);
        }
      }
    }
  }

  const images = Array.from(container.querySelectorAll("img"));
  for (const img of images) {
    const src = img.getAttribute("src");
    if (!src) continue;
    try {
      const newSrc = await downloadImageIfNeeded(src);
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
  const { dir: subDir, slug: finalSlug } = getOutputPath(slug, document);
  
  const targetDir = subDir ? new URL(subDir, outputDir) : outputDir;
  await ensureDir(targetDir);
  
  let markdown;
  try {
    markdown = turndownService.turndown(container.innerHTML);
  } catch (error) {
    console.warn(`Warning: turndown error for ${fileName}: ${error.message}`);
    // Fallback: try without GFM plugin
    const basicTurndown = new TurndownService({
      headingStyle: "atx",
      codeBlockStyle: "fenced",
      bulletListMarker: "-",
    });
    basicTurndown.addRule("preToCodeBlock", {
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
    markdown = basicTurndown.turndown(container.innerHTML);
  }
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

  const outputPath = new URL(`${finalSlug}.mdx`, targetDir);
  await writeFile(outputPath, outputContent, "utf8");
  console.log(`Converted ${fileName} -> ${outputPath.pathname}`);
}

async function main() {
  await ensureDir(outputDir);
  await ensureDir(mediaDir);
  await ensureDir(filesDir);
  
  // Create subdirectories
  for (const subDir of Object.values(pathMapping)) {
    await ensureDir(new URL(subDir, outputDir));
  }

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

