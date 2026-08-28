import type { MetadataRoute } from "next";

// Crawl rules. The marketing pages are open; everything that is either an
// internal tool, a duplicate of the homepage, or a campaign landing page
// with its own noindex stays out of the index.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",      // internal tool — data is behind the API session,
          "/dashboard/",     // but the shell should never be listed
          "/api/",
          "/preview-brutalism", // same component the homepage renders
          "/preview-cinematic", // the scroll-film variant, kept for rollback
          "/flashka",        // campaign landing page, carries its own noindex
        ],
      },
    ],
    sitemap: "https://vektoagency.com/sitemap.xml",
    host: "https://vektoagency.com",
  };
}
