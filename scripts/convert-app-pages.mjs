#!/usr/bin/env node

import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { basename } from "path";
import { fileURLToPath } from "node:url";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";
import { JSDOM } from "jsdom";

const baseUrl = "https://docs.litium.com";
const rootDir = new URL("../", import.meta.url);
const inputDir = new URL("tmp/legacy-pages/", rootDir);
const outputDir = new URL("docs/cloud/serverless/", rootDir);
const mediaDir = new URL("docs/cloud/serverless/media/", rootDir);

// Mapping from old URL slugs to new file names
const slugMapping = {
  "cloud-serverless-apps-public-apps-litium-platform": "public-apps-litium-platform",
  "cloud-serverless-apps-public-apps-litium-sftp": "public-apps-litium-sftp",
  "cloud-serverless-apps-public-apps-install-smtp-relay-app": "public-apps-install-smtp-relay-app",
  "cloud-serverless-apps-public-apps-litium-storefront": "public-apps-litium-storefront",
  "cloud-serverless-apps-public-apps-litium-storefront-proxy": "public-apps-litium-storefront-proxy",
};

async function ensureDir(url) {
  await mkdir(url, { recursive: true });
}

function titleFromDocument(document) {
  const titleTag = document.querySelector("title");
  if (titleTag) {
    return titleTag.textContent.trim();
  }
  const h1 = document.querySelector("h1");
  if (h1) {
    return h1.textContent.trim();
  }
  return "Untitled";
}

function collectDescription(container, document) {
  const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute("content");
  if (metaDesc) return metaDesc;

  const firstP = container.querySelector("p");
  if (firstP) {
    return firstP.textContent.trim().substring(0, 160);
  }
  return "";
}

function sanitizeDescription(desc) {
  return desc.replace(/\n/g, " ").replace(/\s+/g, " ").trim().substring(0, 160);
}

function cleanupContainer(container, document) {
  // Remove script tags
  container.querySelectorAll("script").forEach((el) => el.remove());
  // Remove style tags
  container.querySelectorAll("style").forEach((el) => el.remove());
  // Remove comments - use a simpler approach
  const allNodes = container.querySelectorAll("*");
  allNodes.forEach((node) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === 8) { // COMMENT_NODE
        child.remove();
      }
    });
  });
}

const downloadedImages = new Map();

function filenameFromSrc(src) {
  const url = new URL(src, baseUrl);
  const pathname = url.pathname;
  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1] || "image";
  return lastSegment;
}

async function downloadImageIfNeeded(src) {
  if (!src) return src;
  if (src.startsWith("data:")) return src;
  if (src.startsWith("./media/") || src.startsWith("../media/")) {
    return src.replace(/^\.\.?\//, "");
  }

  const absoluteUrl = new URL(src, baseUrl).href;
  if (downloadedImages.has(absoluteUrl)) {
    return downloadedImages.get(absoluteUrl);
  }

  const filename = filenameFromSrc(absoluteUrl);
  const outputPath = new URL(filename, mediaDir);

  try {
    await stat(fileURLToPath(outputPath));
  } catch {
    try {
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
    } catch (error) {
      console.warn(`Warning: could not download image ${absoluteUrl}: ${error.message}`);
      return src;
    }
  }

  const relativePath = `./media/${filename}`;
  downloadedImages.set(absoluteUrl, relativePath);
  return relativePath;
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

// Fix links to point to new structure
function fixLink(href) {
  if (!href) return href;
  if (href.startsWith("#")) return href;
  if (href.startsWith("mailto:")) return href;
  if (href.startsWith("javascript:")) return href;
  if (href.startsWith("http://") || href.startsWith("https://")) {
    // External link, keep as is
    return href;
  }

  // Convert old paths to new paths
  const oldPaths = {
    "/cloud/serverless/apps/public-apps/litium-platform": "/cloud/serverless/public-apps-litium-platform",
    "/cloud/serverless/apps/public-apps/litium-sftp": "/cloud/serverless/public-apps-litium-sftp",
    "/cloud/serverless/apps/public-apps/install-smtp-relay-app": "/cloud/serverless/public-apps-install-smtp-relay-app",
    "/cloud/serverless/apps/public-apps/litium-storefront": "/cloud/serverless/public-apps-litium-storefront",
    "/cloud/serverless/apps/public-apps/litium-storefront-proxy": "/cloud/serverless/public-apps-litium-storefront-proxy",
    "/cloud/serverless/apps/private-apps/file-storage": "/cloud/serverless/private-apps-file-storage",
    "/cloud/serverless/get-started/install-litium-cdn": "/cloud/serverless/install-litium-cdn",
    "/cloud/serverless/get-started/install-litium-insights": "/cloud/serverless/install-litium-insights",
    "/cloud/serverless/get-started/install-litium-platform": "/cloud/serverless/install-litium-platform",
    "/cloud/serverless/get-started/install-nextjs-storefront-app": "/cloud/serverless/install-nextjs-storefront-app",
    "/cloud/serverless/get-started/install-payment-and-delivery-apps": "/cloud/serverless/install-payment-and-delivery-apps",
    "/cloud/serverless/get-started/getting-started-with-cloud-cli": "/cloud/serverless/getting-started-with-cloud-cli",
    "/cloud/serverless/guides/view-status-and-logs": "/cloud/serverless/view-status-and-logs",
  };

  // Try exact match first
  if (oldPaths[href]) {
    return oldPaths[href];
  }

  // Try matching with base URL
  try {
    const url = new URL(href, baseUrl);
    if (oldPaths[url.pathname]) {
      return oldPaths[url.pathname];
    }
  } catch {
    // Invalid URL, return as is
  }

  return href;
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
  cleanupContainer(container, document);

  // Fix anchor links
  container.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    const href = anchor.getAttribute("href");
    if (!href) return;
    anchor.setAttribute("href", href.toLowerCase());
  });

  // Fix all links
  const anchors = Array.from(container.querySelectorAll("a[href]"));
  for (const anchor of anchors) {
    const href = anchor.getAttribute("href");
    if (!href) continue;
    const newHref = fixLink(href);
    anchor.setAttribute("href", newHref);
  }

  // Download and fix images
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
      console.warn(`Warning: could not process image ${src} for ${fileName}: ${error.message}`);
    }
  }

  const title = titleFromDocument(document);
  const description = sanitizeDescription(collectDescription(container, document));

  const baseName = basename(fileName, ".html");
  const finalSlug = slugMapping[baseName] || baseName.replace(/^cloud-serverless-apps-public-apps-/, "public-apps-").replace(/^cloud-serverless-apps-private-apps-/, "private-apps-");
  
  let markdown;
  try {
    markdown = turndownService.turndown(container.innerHTML);
  } catch (error) {
    console.warn(`Warning: turndown error for ${fileName}: ${error.message}`);
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

  const outputPath = new URL(`${finalSlug}.mdx`, outputDir);
  await writeFile(outputPath, outputContent, "utf8");
  console.log(`Converted ${fileName} -> ${outputPath.pathname}`);
}

async function main() {
  await ensureDir(outputDir);
  await ensureDir(mediaDir);

  const files = [
    "cloud-serverless-apps-public-apps-litium-platform.html",
    "cloud-serverless-apps-public-apps-litium-sftp.html",
    "cloud-serverless-apps-public-apps-install-smtp-relay-app.html",
    "cloud-serverless-apps-public-apps-litium-storefront.html",
    "cloud-serverless-apps-public-apps-litium-storefront-proxy.html",
  ];

  for (const file of files) {
    await convertFile(file);
  }
}

main().catch(console.error);

