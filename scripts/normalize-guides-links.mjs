#!/usr/bin/env node

import { join } from "node:path";
import { readdir, readFile, writeFile } from "node:fs/promises";

const guidesDir = "/Users/tonnguyen/Documents/GitHub/litium-admin-mcp-server/docs/platform/guides";

function toSlug(pathPart) {
  const segments = pathPart.split("/").filter(Boolean);
  const guidesIndex = segments.indexOf("guides");
  const relevant = guidesIndex >= 0 ? segments.slice(guidesIndex + 1) : segments;
  if (relevant.length === 0) return "overview";
  return relevant.map((segment) => segment.replace(/_/g, "-")).join("-");
}

function normalizeLink(original) {
  const [pathPart, hashPart] = original.split("#");
  const slug = toSlug(pathPart);
  const hash = hashPart ? `#${hashPart.toLowerCase()}` : "";
  return `/platform/guides/${slug}${hash}`;
}

async function processFile(fileName) {
  const filePath = join(guidesDir, fileName);
  let content = await readFile(filePath, "utf8");
  let updated = content;

  const absoluteRegex = /https?:\/\/docs\.litium\.com\/platform\/guides\/([^\s)"'<>]+)/gi;
  updated = updated.replace(absoluteRegex, (_match, group) => normalizeLink(`/platform/guides/${group}`));

  const relativeRegex = /\/platform\/guides\/([^\s)"'<>]+)/gi;
  updated = updated.replace(relativeRegex, (_match, group) => normalizeLink(`/platform/guides/${group}`));

  if (updated !== content) {
    await writeFile(filePath, updated, "utf8");
    console.log(`Normalized links in ${fileName}`);
  }
}

async function main() {
  const entries = await readdir(guidesDir);
  const mdxFiles = entries.filter((name) => name.endsWith(".mdx"));
  for (const file of mdxFiles) {
    await processFile(file);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

