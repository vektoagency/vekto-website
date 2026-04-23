import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
  },
  async redirects() {
    return [
      // Old standalone /work page is retired — portfolio lives in the Mac-128K
      // hero overlay now. Handled at the edge so no stale HTML is served.
      // Individual case studies (e.g. /work/menscare) keep working.
      {
        source: "/work",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
