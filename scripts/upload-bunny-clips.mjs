#!/usr/bin/env node
/**
 * Upload all .mp4 files from ./clips-source/ to Bunny Stream with proper
 * "BRAND | CATEGORY | DESCRIPTION" titles, based on the FILE_MAP below.
 *
 * For each file:
 *   1. POST /library/{id}/videos          — create video, get guid
 *   2. PUT  /library/{id}/videos/{guid}   — upload the binary
 *
 * After all uploads finish, run:
 *   node scripts/fetch-bunny-clips.mjs
 * to regenerate app/data/bunny-clips.json.
 *
 * Skips files already uploaded (matched by title on the library).
 *
 * Run:
 *   node scripts/upload-bunny-clips.mjs
 */

import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CLIPS_DIR = path.join(ROOT, "clips-source");

// Map each filename in clips-source/ to a Bunny title.
// Format: "BRAND | CATEGORY | DESCRIPTION"
// Categories must be one of: Short-Form, Organic, AI Visuals, Cinematic, Experimental.
const FILE_MAP = {
  "AI _ Exploding Cones _ Hook 2 mens care.mp4":
    "MEN'S CARE | AI Visuals | AI hook — exploding cones.",
  "Bansko Estates.mp4":
    "BANSKO ESTATES | Cinematic | Luxury real-estate reel.",
  "ISTINSKIMED.BG.mp4":
    "ISTINSKIMED.BG | Short-Form | Brand spot.",
  "Krista G ugc.mp4":
    "MEN'S CARE | Organic | UGC — Krista G.",
  "cinematic  Джошуа - IsoSport.mp4":
    "ISOSPORT | Cinematic | Joshua — athlete portrait.",
  "cinematic Parfen - Вдъхновен от BIANCO LATEE № 764.mp4":
    "BIANCO LATTE | Cinematic | Parfen — inspired by Bianco Latte No. 764.",
  "experimental Cinematic vekto.mp4":
    "VEKTO LAB | Experimental | Cinematic R&D.",
  "experimental Vekto Agency.mp4":
    "VEKTO LAB | Experimental | Agency reel.",
  "menscare UGC.mp4":
    "MEN'S CARE | Organic | UGC spot.",
  "organik Gifto.bg - SPA.mp4":
    "GIFTO.BG | Organic | SPA offer.",
  "organik John Johnes ASP менс кеър.mp4":
    "MEN'S CARE | Organic | John Johnes ASP.",
};

async function loadEnv() {
  try {
    const raw = await fsp.readFile(path.join(ROOT, ".env.local"), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (!m) continue;
      const [, key, rawVal] = m;
      if (process.env[key]) continue;
      process.env[key] = rawVal.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
    }
  } catch {}
}

async function listExistingTitles(libraryId, apiKey) {
  const url = `https://video.bunnycdn.com/library/${libraryId}/videos?page=1&itemsPerPage=200&orderBy=date`;
  const res = await fetch(url, { headers: { AccessKey: apiKey, accept: "application/json" } });
  if (!res.ok) throw new Error(`list failed: ${res.status} ${res.statusText}`);
  const data = await res.json();
  return new Set((data.items || []).map((v) => (v.title || "").trim()));
}

async function createVideo(libraryId, apiKey, title) {
  const url = `https://video.bunnycdn.com/library/${libraryId}/videos`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      AccessKey: apiKey,
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error(`create failed: ${res.status} ${res.statusText}\n${await res.text()}`);
  return res.json();
}

async function uploadVideo(libraryId, apiKey, guid, filePath) {
  const url = `https://video.bunnycdn.com/library/${libraryId}/videos/${guid}`;
  const stat = await fsp.stat(filePath);
  const stream = fs.createReadStream(filePath);
  const res = await fetch(url, {
    method: "PUT",
    // @ts-ignore — undici accepts Node streams as duplex body
    duplex: "half",
    headers: {
      AccessKey: apiKey,
      accept: "application/json",
      "content-type": "application/octet-stream",
      "content-length": String(stat.size),
    },
    body: stream,
  });
  if (!res.ok) throw new Error(`upload failed: ${res.status} ${res.statusText}\n${await res.text()}`);
  return res.json().catch(() => ({}));
}

function bytes(n) {
  const mb = n / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

async function main() {
  await loadEnv();
  const libraryId = process.env.BUNNY_LIBRARY_ID;
  const apiKey = process.env.BUNNY_API_KEY;
  if (!libraryId || !apiKey) {
    console.error("Missing BUNNY_LIBRARY_ID / BUNNY_API_KEY in .env.local");
    process.exit(1);
  }

  const entries = Object.entries(FILE_MAP);
  console.log(`[upload] ${entries.length} files to sync → library ${libraryId}`);

  const existing = await listExistingTitles(libraryId, apiKey);
  console.log(`[upload] ${existing.size} videos already in library`);

  let uploaded = 0;
  let skipped = 0;
  let missing = 0;

  for (const [filename, title] of entries) {
    const filePath = path.join(CLIPS_DIR, filename);
    if (!fs.existsSync(filePath)) {
      console.warn(`[skip] file not found: ${filename}`);
      missing++;
      continue;
    }
    if (existing.has(title)) {
      console.log(`[skip] already in library: ${title}`);
      skipped++;
      continue;
    }
    const size = (await fsp.stat(filePath)).size;
    console.log(`[up ] ${title}  (${bytes(size)})`);
    const created = await createVideo(libraryId, apiKey, title);
    const guid = created.guid;
    if (!guid) throw new Error(`no guid returned for ${title}`);
    await uploadVideo(libraryId, apiKey, guid, filePath);
    console.log(`      ✓ uploaded → ${guid}`);
    uploaded++;
  }

  console.log(
    `[upload] done — ${uploaded} uploaded, ${skipped} already existed, ${missing} missing.`
  );
  if (uploaded > 0) {
    console.log(`[upload] next: wait for Bunny to finish encoding, then run`);
    console.log(`         node scripts/fetch-bunny-clips.mjs`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
