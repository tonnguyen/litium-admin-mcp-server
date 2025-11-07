#!/usr/bin/env node

import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const docsDir = "/Users/tonnguyen/Documents/GitHub/litium-admin-mcp-server/docs/platform/get-started";

function toSlug(pathPart) {
  const segments = pathPart.split("/").filter(Boolean);
  const getStartedIndex = segments.indexOf("get-started");
  const relevant = getStartedIndex >= 0 ? segments.slice(getStartedIndex + 1) : segments;
  if (relevant.length === 0) return "overview";
  return relevant.map((segment) => segment.replace(/_/g, "-")).join("-");
}

function normalizeLink(original) {
  const [pathPart, hashPart] = original.split("#");
  const slug = toSlug(pathPart);
  const hash = hashPart ? `#${hashPart.toLowerCase()}` : "";
  return `/platform/get-started/${slug}${hash}`;
}

async function processFile(filePath) {
  const absolutePath = join(docsDir, filePath);
  let content = await readFile(absolutePath, "utf8");
  let updated = content;

  const absoluteRegex = /https?:\/\/docs\.litium\.com\/platform\/get-started\/([^\s)"'<>]+)/gi;
  updated = updated.replace(absoluteRegex, (_match, group) => normalizeLink(`/platform/get-started/${group}`));

  const relativeRegex = /\/platform\/get-started\/([^\s)"'<>]+)/gi;
  updated = updated.replace(relativeRegex, (_match, group) => normalizeLink(`/platform/get-started/${group}`));

  if (updated !== content) {
    await writeFile(absolutePath, updated, "utf8");
    console.log(`Normalized links in ${filePath}`);
  }
}

async function main() {
  const entries = await readdir(docsDir);
  const mdxFiles = entries.filter((name) => name.endsWith(".mdx"));
  for (const file of mdxFiles) {
    await processFile(file);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
