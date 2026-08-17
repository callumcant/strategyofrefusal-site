// Prepare photographs for the archive.
//
//   npm run photos                     every jpg in src/assets/photographs
//   npm run photos -- src/assets/photographs/s05-*.jpg   just these
//
// Two jobs, both required before a photograph is committed:
//
// 1. STRIP ALL METADATA. This is a safety requirement, not an optimisation.
//    A straight-from-camera JPEG carries around fifty tags: camera make and
//    model, body serial number, lens, and the capture time to the second.
//    The body serial ties every photograph you ever publish to one camera,
//    and so to you. GPS, when present, places a named person at a workplace
//    on a date. Sharp drops all of it unless asked to keep it, so the strip
//    is simply what happens when we re-encode.
//
// 2. Downscale to 2560px on the long edge. The largest the site ever displays
//    is a full-bleed plate at about 1600px, so this leaves headroom for
//    retina screens, while keeping the repository from filling with 5MB
//    originals that git would then store forever.
//
// Keep your full-resolution masters somewhere outside this repo. What lands
// here is the published copy, not the archive of record.
//
// The script is safe to re-run: a file that is already stripped and small
// enough is skipped rather than re-compressed, so quality does not decay.

import sharp from "sharp";
import { glob } from "node:fs/promises";
import { stat, rename, unlink } from "node:fs/promises";
import path from "node:path";

const MAX_EDGE = 2560;
const QUALITY = 85;

const args = process.argv.slice(2);
const patterns = args.length > 0 ? args : ["src/assets/photographs/*.jpg"];

const files = [];
for (const pattern of patterns) {
  // A shell may have expanded the glob already, in which case this is a path.
  if (!pattern.includes("*")) {
    files.push(pattern);
    continue;
  }
  for await (const entry of glob(pattern)) files.push(entry);
}

if (files.length === 0) {
  console.error("No files matched.");
  process.exit(1);
}

const kb = (bytes) => `${Math.round(bytes / 1024)}KB`;
let processed = 0;
let skipped = 0;
let savedBytes = 0;

for (const file of files.sort()) {
  const before = (await stat(file)).size;
  const meta = await sharp(file).metadata();

  const clean = !meta.exif && !meta.xmp && !meta.iptc && !meta.icc;
  const small = Math.max(meta.width, meta.height) <= MAX_EDGE;

  if (clean && small) {
    console.log(`  skip    ${path.basename(file)}  already stripped, ${meta.width}x${meta.height}`);
    skipped++;
    continue;
  }

  // Write beside the original, then swap, so an interrupted run cannot leave
  // a half-written photograph in place of a good one.
  const tmp = `${file}.tmp`;
  await sharp(file)
    // Bakes in the EXIF orientation before the orientation tag is discarded,
    // otherwise a portrait frame can come out on its side.
    .rotate()
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(tmp);

  await unlink(file);
  await rename(tmp, file);

  const after = (await stat(file)).size;
  const out = await sharp(file).metadata();
  savedBytes += before - after;
  processed++;

  const remaining = [out.exif && "exif", out.xmp && "xmp", out.iptc && "iptc", out.icc && "icc"].filter(Boolean);
  const verdict = remaining.length === 0 ? "clean" : `STILL HAS ${remaining.join(",")}`;

  console.log(
    `  done    ${path.basename(file)}  ${meta.width}x${meta.height} ${kb(before)} → ` +
      `${out.width}x${out.height} ${kb(after)}  ${verdict}`,
  );
}

console.log(`\n${processed} processed, ${skipped} skipped, ${kb(savedBytes)} saved.`);
