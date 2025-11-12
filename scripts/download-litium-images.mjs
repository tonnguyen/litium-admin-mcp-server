#!/usr/bin/env node

import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DOCS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../docs");
const IMAGE_BASE = path.join(DOCS_DIR, "images");
const IMAGE_HOST = "https://docs.litium.com/storage/";

const VALID_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"]);

const fetched = new Map(); // url -> localPath

async function findMdxFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findMdxFiles(fullPath)));
    } else if (entry.isFile() && entry.name.endsWith(".mdx")) {
      files.push(fullPath);
    }
  }
  return files;
}

function getImageUrls(content) {
  const regex = /https:\/\/docs\.litium\.com\/storage\/[^\s)"']+/g;
  const matches = content.match(regex);
  return matches ? [...new Set(matches)] : [];
}

async function download(url, destination) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status} ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, Buffer.from(arrayBuffer));
}

async function ensureImage(url, mdxPath) {
  if (fetched.has(url)) {
    return fetched.get(url);
  }
  const ext = path.extname(new URL(url).pathname).toLowerCase();
  if (!VALID_EXTENSIONS.has(ext)) {
    return null;
  }

  const relativeDir = path.relative(DOCS_DIR, path.dirname(mdxPath));
  const filename = path.basename(new URL(url).pathname);
  const localDir = path.join(IMAGE_BASE, relativeDir);
  const localPath = path.join(localDir, filename);

  try {
    await download(url, localPath);
    fetched.set(url, localPath);
    return localPath;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

async function processFile(filePath) {
  let content = await readFile(filePath, "utf8");
  const urls = getImageUrls(content);

  for (const url of urls) {
    const localPath = await ensureImage(url, filePath);
    if (!localPath) {
      continue;
    }
    const relativeLocal = path.relative(DOCS_DIR, localPath).replace(/\\/g, "/");
    const replacement = `/images/${relativeLocal.replace(/^images\//, "")}`;
    content = content.split(url).join(replacement);
  }

  await writeFile(filePath, content, "utf8");
}

const mdxFiles = await findMdxFiles(DOCS_DIR);
for (const file of mdxFiles) {
  await processFile(file);
}

console.log(`Processed ${mdxFiles.length} MDX files. Downloaded ${fetched.size} images.`);


