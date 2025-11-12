#!/usr/bin/env node

import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DOCS_DIR = path.resolve(process.cwd(), "docs/apps");

function titleCase(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

async function findReleaseNotes(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findReleaseNotes(fullPath)));
    } else if (entry.isFile() && entry.name === "release-notes.mdx") {
      files.push(fullPath);
    }
  }
  return files;
}

function transformContent(content, appSlug) {
  const frontMatterRegex = /^---\n([\s\S]*?)\n---\n/;
  const frontMatch = content.match(frontMatterRegex);
  let body = content;
  let metadata = {};

  if (frontMatch) {
    body = content.slice(frontMatch[0].length);
    for (const line of frontMatch[1].split("\n")) {
      const [key, ...rest] = line.split(":");
      if (key && rest.length) {
        metadata[key.trim()] = rest.join(":").trim().replace(/^"|"$/g, "");
      }
    }
  }

  const releaseRegex = /## Version ([^\n]+)\n+Release date:\s*([^\n]+)\n([\s\S]*?)(?=## Version |\Z)/g;
  const updates = [];
  let match;

  while ((match = releaseRegex.exec(body))) {
    const label = match[1].trim();
    const date = match[2].trim();
    const raw = match[3].trim();
    let inner = raw;

    if (inner) {
      inner = inner.replace(/\n{3,}/g, "\n\n").trim();
    }

    updates.push({
      label,
      description: date,
      content: inner,
    });
  }

  const lines = [];
  const appName = titleCase(appSlug);
  lines.push("---");
  lines.push(`title: Release notes`);
  const description =
    metadata.description && !metadata.description.toLowerCase().startsWith("release date")
      ? metadata.description
      : `Release history for the ${appName} app`;
  lines.push(`description: ${description}`);
  lines.push(`rss: true`);
  lines.push("---");
  lines.push("");
  lines.push("# Release notes");
  lines.push("");

  updates.forEach((update) => {
    if (!update.content) {
      lines.push(`<Update label="${update.label}" description="${update.description}" />`);
      lines.push("");
      return;
    }

    const indented = update.content
      .split("\n")
      .map((line) => (line.length ? `    ${line}` : ""))
      .join("\n");

    lines.push(`<Update label="${update.label}" description="${update.description}">`);
    lines.push(indented);
    lines.push("</Update>");
    lines.push("");
  });

  return lines.join("\n").trim() + "\n";
}

const files = await findReleaseNotes(DOCS_DIR);
for (const file of files) {
  const original = await readFile(file, "utf8");
  const appSlug = path.basename(path.dirname(file));
  const transformed = transformContent(original, appSlug);
  await writeFile(file, transformed, "utf8");
  console.log(`Transformed ${path.relative(process.cwd(), file)}`);
}

