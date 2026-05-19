// One-off: download every clip from bunny-clips.json into a desktop folder.
// Tries the highest-quality URL available for each (original → 1080p → 720p).
// Local /videos/*.mp4 entries are copied straight across.

import fs from "node:fs";
import path from "node:path";
import data from "../app/data/bunny-clips.json" with { type: "json" };

const OUT_DIR = "C:/Users/yavor/Desktop/vekto-portfolio-videos";
const PUBLIC_DIR = "C:/Users/yavor/vekto-website/public";
const API_KEY = "2685f60e-c67a-4e16-a6de5f9c2872-4223-41e1";

fs.mkdirSync(OUT_DIR, { recursive: true });

function safeName(s) {
  return s
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

async function tryDownload(url, useApiKey = false) {
  const headers = useApiKey ? { AccessKey: API_KEY } : {};
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, { headers });
      if (!res.ok) return null;
      return res;
    } catch (err) {
      if (attempt === 3) throw err;
      console.log(`  retry ${attempt} after error: ${err.message}`);
      await new Promise((r) => setTimeout(r, 2000 * attempt));
    }
  }
  return null;
}

function fileMatch(dir, prefix) {
  return fs.readdirSync(dir).find((f) => f.startsWith(prefix));
}

async function downloadBunnyClip(clip) {
  const base = `https://vz-5279644d-ac4.b-cdn.net/${clip.id}`;
  // Try in order: original (4K source) → 1080p → 720p → 480p
  const candidates = [
    `${base}/original`,
    `${base}/play_1080p.mp4`,
    `${base}/play_720p.mp4`,
    `${base}/play_480p.mp4`,
  ];
  for (const url of candidates) {
    const res = await tryDownload(url);
    if (res) {
      const tag = url.endsWith("/original") ? "original" : url.match(/play_(\d+p)/)?.[1] ?? "src";
      return { res, tag };
    }
  }
  return null;
}

async function saveTo(filepath, res) {
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(filepath, buf);
  return buf.length;
}

async function main() {
  let idx = 1;
  for (const clip of data.clips) {
    const baseName = `${String(idx).padStart(2, "0")}_${safeName(clip.brand)}_${safeName(clip.description).slice(0, 40)}`;
    let filename;
    let size = 0;

    // Skip if already downloaded (idempotent — safe to re-run after a crash)
    const existing = fileMatch(OUT_DIR, `${String(idx).padStart(2, "0")}_`);
    if (existing) {
      const sz = fs.statSync(path.join(OUT_DIR, existing)).size;
      console.log(`↩ SKIP    ${existing}  (already ${(sz / 1024 / 1024).toFixed(1)} MB)`);
      idx++;
      continue;
    }

    if (clip.previewMp4 && clip.previewMp4.startsWith("/")) {
      // Local file in /public — copy directly.
      const src = path.join(PUBLIC_DIR, clip.previewMp4);
      filename = `${baseName}_local.mp4`;
      fs.copyFileSync(src, path.join(OUT_DIR, filename));
      size = fs.statSync(path.join(OUT_DIR, filename)).size;
      console.log(`✓ [LOCAL] ${filename}  (${(size / 1024 / 1024).toFixed(1)} MB)`);
    } else {
      const got = await downloadBunnyClip(clip);
      if (!got) {
        console.log(`✗ FAILED  ${clip.brand} — ${clip.description}`);
        idx++;
        continue;
      }
      filename = `${baseName}_${got.tag}.mp4`;
      size = await saveTo(path.join(OUT_DIR, filename), got.res);
      console.log(`✓ [${got.tag.toUpperCase()}] ${filename}  (${(size / 1024 / 1024).toFixed(1)} MB)`);
    }

    idx++;
  }

  // Summary
  const files = fs.readdirSync(OUT_DIR);
  const totalSize = files.reduce((s, f) => s + fs.statSync(path.join(OUT_DIR, f)).size, 0);
  console.log(`\nDone. ${files.length} files · ${(totalSize / 1024 / 1024).toFixed(1)} MB total`);
  console.log(`Folder: ${OUT_DIR}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
