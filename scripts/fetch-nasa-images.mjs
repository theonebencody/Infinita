#!/usr/bin/env node
/**
 * Fetch public domain NASA images for Starship flight phases
 * NASA Image API: https://images.nasa.gov/docs/images.nasa.gov%20API.pdf
 * All NASA imagery is public domain — no licensing restrictions.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.resolve(__dirname, '..', 'public', 'images', 'starship');

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const SEARCHES = [
  { query: 'SpaceX Starship launch', filename: 'liftoff', description: 'Starship liftoff' },
  { query: 'SpaceX Starship', filename: 'prelaunch', description: 'Starship on pad' },
  { query: 'SpaceX rocket stage separation', filename: 'separation', description: 'Stage separation' },
  { query: 'SpaceX booster landing', filename: 'boostback', description: 'Booster return' },
  { query: 'SpaceX rocket ascent', filename: 'ascent', description: 'Ascent through atmosphere' },
  { query: 'spacecraft orbit Earth', filename: 'orbit', description: 'Spacecraft in orbit' },
  { query: 'rocket engine ignition plume', filename: 'hotstage', description: 'Engine ignition' },
  { query: 'SpaceX spacecraft reentry', filename: 'ship-burn', description: 'Ship in space' },
];

async function fetchImage(search) {
  console.log(`\nSearching: "${search.query}"`);

  try {
    const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(search.query)}&media_type=image&page_size=5`;
    const resp = await fetch(url);
    if (!resp.ok) { console.error(`  API error: ${resp.status}`); return false; }

    const data = await resp.json();
    const items = data.collection?.items || [];

    if (items.length === 0) { console.log('  No results found.'); return false; }

    // Find the first item with a usable image
    for (const item of items) {
      const links = item.links || [];
      const href = links.find(l => l.rel === 'preview')?.href;
      if (!href) continue;

      // Get the full-res version from the asset manifest
      const nasaId = item.data?.[0]?.nasa_id;
      const title = item.data?.[0]?.title || search.description;

      // Try to get high-res from asset endpoint
      let imageUrl = href; // fallback to preview
      try {
        const assetResp = await fetch(`https://images-api.nasa.gov/asset/${nasaId}`);
        if (assetResp.ok) {
          const assetData = await assetResp.json();
          const assets = assetData.collection?.items || [];
          // Prefer orig, then large, then medium
          const orig = assets.find(a => a.href?.includes('~orig.'));
          const large = assets.find(a => a.href?.includes('~large.'));
          const medium = assets.find(a => a.href?.includes('~medium.'));
          imageUrl = (orig || large || medium)?.href || href;
        }
      } catch (e) { /* use preview */ }

      console.log(`  Found: "${title}"`);
      console.log(`  URL: ${imageUrl}`);

      // Download
      const imgResp = await fetch(imageUrl);
      if (!imgResp.ok) { console.log('  Download failed, trying next...'); continue; }

      const buffer = Buffer.from(await imgResp.arrayBuffer());
      const ext = imageUrl.match(/\.(jpg|jpeg|png|gif|webp)/i)?.[1] || 'jpg';
      const outPath = path.join(OUTPUT_DIR, `${search.filename}.${ext}`);
      fs.writeFileSync(outPath, buffer);
      console.log(`  Saved: ${outPath} (${(buffer.length / 1024).toFixed(1)} KB)`);

      // Save attribution
      const attrPath = path.join(OUTPUT_DIR, `${search.filename}.txt`);
      fs.writeFileSync(attrPath, `Title: ${title}\nSource: NASA\nID: ${nasaId}\nLicense: Public Domain\nURL: ${imageUrl}\n`);

      return true;
    }

    console.log('  No downloadable images found.');
    return false;
  } catch (err) {
    console.error(`  Error: ${err.message}`);
    return false;
  }
}

console.log('Fetching NASA public domain images for Starship flight phases...');
console.log(`Output directory: ${OUTPUT_DIR}\n`);

let success = 0;
for (const search of SEARCHES) {
  const ok = await fetchImage(search);
  if (ok) success++;
}

console.log(`\n✓ Downloaded ${success}/${SEARCHES.length} images.`);
console.log('All NASA images are public domain — no attribution required (but recommended).');
