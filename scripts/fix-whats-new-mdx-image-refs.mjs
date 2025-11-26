#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const mdxDir = path.resolve('docs/platform/whats-new');

const mapChars = { 'å':'a','Å':'A','ä':'a','Ä':'A','ö':'o','Ö':'O' };
function asciiSafeSlug(name){
  const ext = path.extname(name);
  let base = path.basename(name, ext);
  base = base.normalize('NFC').split('').map(ch => mapChars[ch] ?? ch).join('');
  base = base.toLowerCase();
  base = base.replace(/[^a-z0-9]+/g, '-');
  base = base.replace(/-+/g, '-');
  base = base.replace(/^-|-$/g, '');
  return `${base}${ext.toLowerCase()}`;
}

function fixContent(content){
  const re = /\/images\/platform\/whats-new\/(.+?)\.(png|jpg|jpeg|gif)/gi;
  return content.replace(re, (match, basename, ext) => {
    try{
      const decoded = decodeURIComponent(`${basename}.${ext}`);
      const safe = asciiSafeSlug(decoded);
      return `/images/platform/whats-new/${safe}`;
    }catch{
      return match;
    }
  });
}

function main(){
  const files = fs.readdirSync(mdxDir).filter(f => f.endsWith('.mdx'));
  let updated = 0;
  for(const f of files){
    const full = path.join(mdxDir, f);
    const before = fs.readFileSync(full, 'utf8');
    const after = fixContent(before);
    if(after !== before){
      fs.writeFileSync(full, after, 'utf8');
      console.log(`Updated: ${f}`);
      updated++;
    }
  }
  console.log(`Done. Updated ${updated} files.`);
}

main();
