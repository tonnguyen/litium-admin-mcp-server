#!/usr/bin/env node

import { readdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const rootDir = new URL("../", import.meta.url);
const docsDir = new URL("docs/cloud/serverless/", rootDir);

// Map of old paths to new flattened paths
const pathMapping = {
  "get-started": "get-started",
  "guides": "guides",
  "apps": "apps",
  "faq": "faq",
  "change-log": "change-log",
};

function toSlug(pathPart) {
  // Remove leading/trailing slashes and split
  const cleanPath = pathPart.replace(/^\/+|\/+$/g, "");
  if (!cleanPath) return "overview";
  
  let segments = cleanPath.split("/").filter(Boolean);
  
  // Remove "cloud/serverless" if present
  const serverlessIndex = segments.indexOf("serverless");
  if (serverlessIndex >= 0) {
    segments = segments.slice(serverlessIndex + 1);
  }
  
  // If empty after removal, return overview
  if (segments.length === 0) return "overview";
  
  // Remove parent directory prefixes (get-started, guides, apps, faq, change-log)
  // These are flattened in our structure
  const parentDirs = ["get-started", "guides", "apps", "faq", "change-log"];
  
  // Case 1: Parent dir is a separate segment (e.g., ["get-started", "install-litium-insights"])
  if (segments.length > 1 && parentDirs.includes(segments[0])) {
    segments = segments.slice(1);
  }
  
  // Case 2: Parent dir is a prefix in the first segment (e.g., ["get-started-install-litium-insights"])
  if (segments.length > 0) {
    const firstSeg = segments[0];
    for (const parentDir of parentDirs) {
      if (firstSeg.startsWith(parentDir + "-")) {
        segments[0] = firstSeg.substring(parentDir.length + 1);
        break;
      }
    }
  }
  
  // If empty after removal, return overview
  if (segments.length === 0) return "overview";
  
  // Convert to slug format (replace underscores, join with hyphens)
  return segments.map((segment) => segment.replace(/_/g, "-")).join("-");
}

function normalizeLink(original) {
  // Remove hash if present
  const [pathPart, hashPart] = original.split("#");
  
  // Remove query strings
  const cleanPath = pathPart.split("?")[0];
  
  // Convert to slug
  const slug = toSlug(cleanPath);
  const hash = hashPart ? `#${hashPart.toLowerCase()}` : "";
  
  return `/cloud/serverless/${slug}${hash}`;
}

async function processFile(fileName) {
  const filePath = join(fileURLToPath(docsDir), fileName);
  let content = await readFile(filePath, "utf8");
  let updated = content;
  let changed = false;

  // Match markdown links: [text](/cloud/serverless/path)
  const markdownLinkPattern = /(\[([^\]]*)\]\()(\/cloud\/serverless\/[^\s)"'<>]+)(\))/gi;
  updated = updated.replace(markdownLinkPattern, (match, prefix, linkText, url, suffix) => {
    const normalized = normalizeLink(url);
    if (url !== normalized) {
      changed = true;
      return `${prefix}${normalized}${suffix}`;
    }
    return match;
  });

  // Match absolute URLs: https://docs.litium.com/cloud/serverless/path
  const absoluteUrlPattern = /(https?:\/\/docs\.litium\.com\/cloud\/serverless\/[^\s)"'<>]+)/gi;
  updated = updated.replace(absoluteUrlPattern, (match) => {
    const normalized = normalizeLink(match);
    if (match !== normalized) {
      changed = true;
      return normalized;
    }
    return match;
  });

  if (changed) {
    await writeFile(filePath, updated, "utf8");
    console.log(`Normalized links in ${fileName}`);
    return true;
  }
  return false;
}

async function main() {
  const entries = await readdir(fileURLToPath(docsDir));
  const mdxFiles = entries.filter((name) => name.endsWith(".mdx"));
  
  let count = 0;
  for (const file of mdxFiles) {
    if (await processFile(file)) {
      count++;
    }
  }
  
  console.log(`\nNormalized links in ${count} files.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

