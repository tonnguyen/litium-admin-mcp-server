#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const imagesDir = path.resolve('docs/images/platform/whats-new');
const mdxDir = path.resolve('docs/platform/whats-new');

// Basic transliteration for Swedish chars and common punctuation
const mapChars = {
  'å':'a','Å':'A','ä':'a','Ä':'A','ö':'o','Ö':'O',
};

function asciiSafeSlug(name){
  const ext = path.extname(name);
  let base = path.basename(name, ext);
  // Normalize to NFC then replace Swedish diacritics
  base = base.normalize('NFC').split('').map(ch => mapChars[ch] ?? ch).join('');
  // Lowercase
  base = base.toLowerCase();
  // Replace anything non a-z0-9 with hyphen
  base = base.replace(/[^a-z0-9]+/g, '-');
  // Collapse hyphens
  base = base.replace(/-+/g, '-');
  // Trim leading/trailing hyphens
  base = base.replace(/^-|-$/g, '');
  return `${base}${ext.toLowerCase()}`;
}

function gatherImages(){
  const files = fs.readdirSync(imagesDir);
  const map = new Map();
  for(const f of files){
    const safe = asciiSafeSlug(f);
    if(safe !== f){
      map.set(f, safe);
    }
  }
  return map;
}

function renameFiles(renameMap){
  for(const [from, to] of renameMap){
    const src = path.join(imagesDir, from);
    const dst = path.join(imagesDir, to);
    if(fs.existsSync(dst)){
      console.warn(`Skip: destination exists ${to}`);
      continue;
    }
    fs.renameSync(src, dst);
    console.log(`Renamed: ${from} -> ${to}`);
  }
}

function updateMdx(renameMap){
  const files = fs.readdirSync(mdxDir).filter(f => f.endsWith('.mdx'));
  for(const f of files){
    const full = path.join(mdxDir, f);
    let content = fs.readFileSync(full, 'utf8');
    let changed = false;
    for(const [from, to] of renameMap){
      const encFrom = encodeURIComponent(from);
      const encTo = encodeURIComponent(to);
      // Update both encoded and raw references
      const before = content;
      content = content
        .replaceAll(`/images/platform/whats-new/${encFrom}`, `/images/platform/whats-new/${encTo}`)
        .replaceAll(`/images/platform/whats-new/${from}`, `/images/platform/whats-new/${to}`);
      if(content !== before){ changed = true; }
    }
    if(changed){
      fs.writeFileSync(full, content, 'utf8');
      console.log(`Updated MDX: ${f}`);
    }
  }
}

function main(){
  if(!fs.existsSync(imagesDir)){
    console.error('Images directory not found:', imagesDir);
    process.exit(1);
  }
  console.log('Scanning images in:', imagesDir);
  const renameMap = gatherImages();
  if(renameMap.size === 0){
    console.log('No files to rename.');
    return;
  }
  console.log(`Found ${renameMap.size} files to normalize.`);
  renameFiles(renameMap);
  console.log('Updating MDX references in:', mdxDir);
  updateMdx(renameMap);
  // Remove old files if new ones already exist
  for(const [from, to] of renameMap){
    const src = path.join(imagesDir, from);
    const dst = path.join(imagesDir, to);
    if(fs.existsSync(src) && fs.existsSync(dst)){
      try{
        fs.unlinkSync(src);
        console.log(`Removed old file: ${from}`);
      }catch(e){
        console.warn(`Could not remove old file ${from}:`, e.message);
      }
    }
  }
  console.log('Normalization complete.');
}

main();
