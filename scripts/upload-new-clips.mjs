// One-off Bunny Stream upload for 3 new brand reels.
// Reads compressed mp4s from /tmp and PUTs them to library 637364.
// Prints the resulting GUIDs so we can wire them into bunny-clips.json.

import fs from "node:fs";
import path from "node:path";

const LIBRARY_ID = "637364";
const API_KEY = "2685f60e-c67a-4e16-a6de5f9c2872-4223-41e1";
const BASE = `https://video.bunnycdn.com/library/${LIBRARY_ID}`;

const HEADERS = {
  AccessKey: API_KEY,
  "Content-Type": "application/json",
};

const TMP = "C:/Users/yavor/AppData/Local/Temp";
const clips = [
  { brand: "DUSQ", category: "Cinematic", description: "Brand reel.", file: `${TMP}/DUSQ-compressed.mp4` },
  { brand: "PARFEN", category: "UGC", description: "Product spot.", file: `${TMP}/Parfen-compressed.mp4` },
  { brand: "BEMEACNE", category: "UGC", description: "Acne skincare cut.", file: `${TMP}/beMe-compressed.mp4` },
];

async function createVideo(title) {
  const res = await fetch(`${BASE}/videos`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error(`Create failed: ${res.status} ${await res.text()}`);
  return res.json();
}

async function uploadBinary(guid, filepath) {
  const data = fs.readFileSync(filepath);
  const res = await fetch(`${BASE}/videos/${guid}`, {
    method: "PUT",
    headers: { AccessKey: API_KEY, "Content-Type": "application/octet-stream" },
    body: data,
  });
  if (!res.ok) throw new Error(`Upload failed: ${res.status} ${await res.text()}`);
  return res.json();
}

async function main() {
  const results = [];
  for (const c of clips) {
    const title = `${c.brand} | ${c.category} | ${c.description}`;
    console.log(`Creating ${title}...`);
    const created = await createVideo(title);
    const guid = created.guid;
    if (!guid) throw new Error(`No guid in response: ${JSON.stringify(created)}`);
    console.log(`  guid=${guid}, uploading ${path.basename(c.file)}...`);
    await uploadBinary(guid, c.file);
    console.log(`  ✓ uploaded`);
    results.push({ ...c, guid });
  }

  console.log("\n=== Results ===");
  for (const r of results) {
    console.log(`${r.brand}: ${r.guid}`);
  }

  // Pretty-print json snippets for bunny-clips.json
  console.log("\n=== JSON snippets ===");
  for (const r of results) {
    const obj = {
      id: r.guid,
      brand: r.brand,
      logo: null,
      category: r.category,
      description: r.description,
      thumbnail: `https://vz-5279644d-ac4.b-cdn.net/${r.guid}/thumbnail.jpg`,
      previewMp4: `https://vz-5279644d-ac4.b-cdn.net/${r.guid}/play_1080p.mp4`,
      hlsPlaylist: `https://vz-5279644d-ac4.b-cdn.net/${r.guid}/playlist.m3u8`,
      embedUrl: `https://iframe.mediadelivery.net/embed/${LIBRARY_ID}/${r.guid}?autoplay=true&muted=false&loop=false`,
      duration: null,
      width: 720,
      height: 1280,
      portrait: true,
      metric: null,
      href: null,
      featured: false,
    };
    console.log(JSON.stringify(obj, null, 2) + ",");
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
