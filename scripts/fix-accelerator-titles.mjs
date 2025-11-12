#!/usr/bin/env node

import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import path from "node:path";

const baseDirs = [
  "docs/accelerators/react",
  "docs/accelerators/mvc"
];

const wordOverrides = {
  smtp: "SMTP",
  api: "API",
  url: "URL",
  lcc: "LCC",
  cli: "CLI",
  google: "Google",
  litium: "Litium",
  tag: "Tag",
  manager: "Manager"
};

function headingFromSlug(filePath) {
  const slug = path.basename(filePath, ".mdx");
  return slug
    .split("-")
    .filter(Boolean)
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (wordOverrides[lower]) {
        return wordOverrides[lower];
      }
      if (index === 0) {
        return lower.charAt(0).toUpperCase() + lower.slice(1);
      }
      return lower;
    })
    .join(" ");
}

async function gatherFiles(dir) {
  const entries = await readdir(dir);
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stats = await stat(fullPath);
    if (stats.isDirectory()) {
      files.push(...(await gatherFiles(fullPath)));
    } else if (fullPath.endsWith(".mdx")) {
      files.push(fullPath);
    }
  }
  return files;
}

async function processFile(filePath) {
  let content = await readFile(filePath, "utf8");
  let heading = headingFromSlug(filePath);
  const fileName = path.basename(filePath);

  if (fileName === "overview.mdx") {
    heading = "Overview";
  }

  content = content.replace(/title:\s*.*\n/, `title: ${heading}\n`);

  const headingMatch = content.match(/^#\s*(.*)$/m);
  if (headingMatch) {
    content = content.replace(/^#\s*.*$/m, `# ${heading}`);
  } else {
    content = `# ${heading}\n\n${content}`;
  }

  await writeFile(filePath, content, "utf8");
}

for (const dir of baseDirs) {
  const files = await gatherFiles(dir);
  for (const file of files) {
    await processFile(file);
  }
}

