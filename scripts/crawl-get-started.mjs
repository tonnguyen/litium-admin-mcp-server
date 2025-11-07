#!/usr/bin/env node

import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { extname } from "node:path";
import { JSDOM } from "jsdom";

const baseUrl = new URL("https://docs.litium.com");
const rootPath = "/platform/get-started";
const outputDir = new URL("../tmp/legacy-pages/", import.meta.url);

async function ensureOutputDir() {
  await mkdir(outputDir, { recursive: true });
}

function normalizeUrl(url) {
  const absolute = new URL(url, baseUrl);
  absolute.hash = "";
  if (absolute.pathname.endsWith("/")) {
    absolute.pathname = absolute.pathname.slice(0, -1);
  }
  return absolute;
}

function filenameFromUrl(url) {
  const segments = url.pathname.split("/").filter(Boolean);
  const name = segments.join("-") || "index";
  return `${name}.html`;
}

function isHtmlPath(pathname) {
  const ext = extname(pathname || "").toLowerCase();
  return ext === "" || ext === ".aspx" || ext === ".html";
}

async function savePage(url, content) {
  const filename = filenameFromUrl(url);
  const outputPath = new URL(filename, outputDir);
  await writeFile(outputPath, content, "utf8");
  console.log(`Saved ${url.href} -> ${outputPath.pathname}`);
}

async function hasExisting(url) {
  try {
    const filename = filenameFromUrl(url);
    const fileUrl = new URL(filename, outputDir);
    await stat(fileUrl);
    return true;
  } catch {
    return false;
  }
}

async function crawl() {
  await ensureOutputDir();

  const queue = [normalizeUrl(rootPath)];
  const visited = new Set();

  while (queue.length > 0) {
    const current = queue.shift();
    const key = current.href;
    if (visited.has(key)) continue;
    visited.add(key);

    if (!key.startsWith(new URL(rootPath, baseUrl).href)) {
      continue;
    }

    if (!isHtmlPath(current.pathname)) {
      continue;
    }

    let content;
    if (await hasExisting(current)) {
      content = await readFile(new URL(filenameFromUrl(current), outputDir), "utf8");
    } else {
      const response = await fetch(current, {
        headers: {
          "User-Agent": "litium-docs-migrator/1.0 (+https://litium.com)",
        },
      });
      if (!response.ok) {
        console.warn(`Failed to fetch ${current.href}: HTTP ${response.status}`);
        continue;
      }
      content = await response.text();
      await savePage(current, content);
    }

    const dom = new JSDOM(content);
    const { document } = dom.window;
    const links = Array.from(document.querySelectorAll("a[href]"));
    for (const link of links) {
      const href = link.getAttribute("href");
      if (!href) continue;
      if (href.startsWith("mailto:")) continue;
      const normalized = normalizeUrl(href);
      if (!normalized.href.startsWith(new URL(rootPath, baseUrl).href)) {
        continue;
      }
      if (!isHtmlPath(normalized.pathname)) {
        continue;
      }
      if (!visited.has(normalized.href)) {
        queue.push(normalized);
      }
    }
  }
}

crawl().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

