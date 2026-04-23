#!/usr/bin/env node
/**
 * Fetch all videos from a Bunny Stream library and write them as
 * app/data/bunny-clips.json. The PortfolioOverlay reads from that JSON.
 *
 * Title convention on Bunny:
 *   BRAND | CATEGORY | DESCRIPTION
 *   e.g.  MEN'S CARE | Short-Form | Hero spot — 4.6x ROAS across 6 months.
 *
 * Categories must match the filter list in PortfolioOverlay.tsx:
 *   Short-Form, Organic, AI Visuals, Cinematic, Experimental
 *
 * Credentials come from .env.local (not committed):
 *   BUNNY_LIBRARY_ID=637364
 *   BUNNY_API_KEY=xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx
 *   BUNNY_CDN_HOSTNAME=vz-xxxxxxxx-xxx.b-cdn.net
 *
 * Run:
 *   node scripts/fetch-bunny-clips.mjs
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_FILE = path.join(ROOT, "app", "data", "bunny-clips.json");

// Load .env.local manually (no dotenv dep).
async function loadEnv() {
  try {
    const raw = await fs.readFile(path.join(ROOT, ".env.local"), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (!m) continue;
      const [, key, rawVal] = m;
      if (process.env[key]) continue;
      const val = rawVal.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
      process.env[key] = val;
    }
  } catch {
    // .env.local may not exist — fall back to process.env only.
  }
}

const KNOWN_CATEGORIES = ["Short-Form", "Organic", "AI Visuals", "Cinematic", "Experimental"];

// A logo lookup map — extend as new brands appear.
const BRAND_LOGOS = {
  "MEN'S CARE": "/images/logo-menscare.png",
  "MENSCARE": "/images/logo-menscare.png",
  "ISOSPORT": "/images/logo-isosport.png",
  "VEKTO LAB": "/images/logo.png",
  "VEKTO": "/images/logo.png",
  "BANSKO ESTATES": "/images/logo.png",
  "ISTINSKIMED.BG": "/images/logo.png",
  "BIANCO LATTE": "/images/logo.png",
  "GIFTO.BG": "/images/logo.png",
};

// Case study links per brand (null if no page yet).
const BRAND_CASE_LINKS = {
  "MEN'S CARE": "/work/menscare",
  "MENSCARE": "/work/menscare",
};

// Fallback metadata for placeholder-titled uploads (video-1s … video-12s).
// Remove a key once the real clip is uploaded with a proper
// "BRAND | CATEGORY | DESCRIPTION" title on Bunny.
const PLACEHOLDER_MAP = {
  "video-1s":  { brand: "MEN'S CARE", category: "Short-Form",   description: "Hero spot — 4.6x ROAS across 6 months." },
  "video-2s":  { brand: "ISOSPORT",   category: "Cinematic",    description: "Cinematic brand film." },
  "video-3s":  { brand: "MEN'S CARE", category: "Organic",      description: "Organic TikTok cut." },
  "video-4s":  { brand: "VEKTO LAB",  category: "Experimental", description: "Shader study." },
  "video-5s":  { brand: "MEN'S CARE", category: "Short-Form",   description: "Product demo." },
  "video-6s":  { brand: "ISOSPORT",   category: "AI Visuals",   description: "AI-assisted packshot." },
  "video-7s":  { brand: "VEKTO LAB",  category: "Experimental", description: "Motion R&D loop." },
  "video-8s":  { brand: "VEKTO LAB",  category: "Experimental", description: "Generative R&D reel." },
  "video-9s":  { brand: "MEN'S CARE", category: "AI Visuals",   description: "AI-generated b-roll." },
  "video-10s": { brand: "ISOSPORT",   category: "Cinematic",    description: "Promo cutdown for paid social." },
  "video-11s": { brand: "VEKTO LAB",  category: "Experimental", description: "Camera mapping test." },
  "video-12s": { brand: "VEKTO LAB",  category: "AI Visuals",   description: "AI character exploration." },
};

function parseTitle(title) {
  const raw = (title || "").trim();
  const parts = raw.split("|").map((s) => s.trim()).filter(Boolean);
  if (parts.length >= 3) {
    return { brand: parts[0], category: parts[1], description: parts.slice(2).join(" | ") };
  }
  if (parts.length === 2) {
    return { brand: parts[0], category: parts[1], description: "" };
  }
  // Placeholder fallback — match "video-1s" etc. case-insensitively.
  const key = raw.toLowerCase();
  if (PLACEHOLDER_MAP[key]) return { ...PLACEHOLDER_MAP[key] };
  return { brand: raw || "VEKTO", category: "Experimental", description: "" };
}

function resolveLogo(brand) {
  const key = brand?.toUpperCase();
  return BRAND_LOGOS[key] || "/images/logo.png";
}

function resolveCaseLink(brand) {
  const key = brand?.toUpperCase();
  return BRAND_CASE_LINKS[key] || null;
}

async function main() {
  await loadEnv();
  const libraryId = process.env.BUNNY_LIBRARY_ID;
  const apiKey = process.env.BUNNY_API_KEY;
  const cdnHostname = process.env.BUNNY_CDN_HOSTNAME;

  if (!libraryId || !apiKey || !cdnHostname) {
    console.error("Missing env vars. Add to .env.local:");
    console.error("  BUNNY_LIBRARY_ID=...");
    console.error("  BUNNY_API_KEY=...");
    console.error("  BUNNY_CDN_HOSTNAME=vz-xxxxxxxx-xxx.b-cdn.net");
    process.exit(1);
  }

  const url = `https://video.bunnycdn.com/library/${libraryId}/videos?page=1&itemsPerPage=100&orderBy=date`;
  console.log(`[bunny] fetching ${url}`);

  const res = await fetch(url, { headers: { AccessKey: apiKey, accept: "application/json" } });
  if (!res.ok) {
    console.error(`[bunny] ${res.status} ${res.statusText}`);
    console.error(await res.text());
    process.exit(1);
  }
  const data = await res.json();
  const items = data.items || [];
  console.log(`[bunny] ${items.length} videos found`);

  const clips = [];
  const unknownCategories = new Set();

  for (const v of items) {
    // Skip legacy placeholder uploads (titled "video-1s" … "video-12s").
    // Real clips use "BRAND | CATEGORY | DESCRIPTION" format.
    if (/^video-\d+s?$/i.test((v.title || "").trim())) {
      continue;
    }
    const { brand, category, description } = parseTitle(v.title);
    if (!KNOWN_CATEGORIES.includes(category)) unknownCategories.add(category);

    const id = v.guid;
    const base = `https://${cdnHostname}/${id}`;

    // Bunny reports renditions as "240p,360p,480p,720p". Pick the highest
    // so the player isn't pinned to 720p when a 1080p rendition exists.
    const resList = (v.availableResolutions || "")
      .split(",")
      .map((s) => parseInt(s, 10))
      .filter((n) => !Number.isNaN(n))
      .sort((a, b) => b - a);
    const bestRes = resList[0] || 720;

    const width = v.width || 0;
    const height = v.height || 0;
    // Default to portrait when Bunny hasn't reported dimensions yet
    // (right after upload). The UI then renders the 9:16 tile shape.
    const portrait = width && height ? height >= width : true;

    clips.push({
      id,
      brand,
      logo: resolveLogo(brand),
      category,
      description,
      thumbnail: `${base}/${v.thumbnailFileName || "thumbnail.jpg"}`,
      previewMp4: `${base}/play_${bestRes}p.mp4`,
      hlsPlaylist: `${base}/playlist.m3u8`,
      embedUrl: `https://iframe.mediadelivery.net/embed/${libraryId}/${id}?autoplay=true&muted=false&loop=false`,
      duration: v.length || null,
      width: width || null,
      height: height || null,
      portrait,
      metric: null,
      href: resolveCaseLink(brand),
      featured: false,
    });
  }


  if (unknownCategories.size > 0) {
    console.warn(
      `[bunny] WARNING — these video titles used categories not in the filter list:`,
      [...unknownCategories]
    );
    console.warn(`[bunny] Known categories: ${KNOWN_CATEGORIES.join(", ")}`);
  }

  const out = {
    generatedAt: new Date().toISOString(),
    libraryId,
    cdnHostname,
    clips,
  };

  await fs.writeFile(OUT_FILE, JSON.stringify(out, null, 2) + "\n", "utf8");
  console.log(`[bunny] wrote ${clips.length} clips → ${path.relative(ROOT, OUT_FILE)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
