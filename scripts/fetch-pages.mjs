#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import { basename } from "node:path";

const urls = process.argv.slice(2);

if (urls.length === 0) {
  console.error("Usage: fetch-pages.mjs <url> [url...]");
  process.exit(1);
}

const outputDir = new URL("../tmp/legacy-pages/", import.meta.url);

async function ensureOutputDirectory() {
  await mkdir(outputDir, { recursive: true });
}

function filenameFromUrl(url) {
  const urlObj = new URL(url);
  const pathname = urlObj.pathname.replace(/\/$/, "");
  const slug = pathname.split("/").filter(Boolean).join("-") || "index";
  return `${slug || "index"}.html`;
}

async function fetchAndSave(url) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "litium-docs-migrator/1.0 (+https://litium.com)"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const text = await response.text();
    const filename = filenameFromUrl(url);
    const outputPath = new URL(filename, outputDir);
    await writeFile(outputPath, text, "utf8");
    console.log(`Saved ${url} -> ${outputPath.pathname}`);
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error.message);
  }
}

await ensureOutputDirectory();
await Promise.all(urls.map(fetchAndSave));

