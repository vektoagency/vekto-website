import type { MetadataRoute } from "next";

const BASE = "https://vektoagency.com";

// Only pages that are actually meant to be found: the funnel, the proof
// and the legal pages. Excluded on purpose — /dashboard (internal),
// /preview-* (duplicates of the homepage), /flashka (noindex campaign LP).
const ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/",              changeFrequency: "weekly",  priority: 1.0 },
  { path: "/start",         changeFrequency: "monthly", priority: 0.9 },
  { path: "/portfolio",     changeFrequency: "weekly",  priority: 0.8 },
  { path: "/case-studies",  changeFrequency: "monthly", priority: 0.8 },
  { path: "/websites",      changeFrequency: "monthly", priority: 0.7 },
  { path: "/ai-creative",   changeFrequency: "monthly", priority: 0.7 },
  { path: "/brief",         changeFrequency: "monthly", priority: 0.6 },
  { path: "/work/menscare", changeFrequency: "yearly",  priority: 0.5 },
  { path: "/privacy",       changeFrequency: "yearly",  priority: 0.2 },
  { path: "/terms",         changeFrequency: "yearly",  priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${BASE}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
