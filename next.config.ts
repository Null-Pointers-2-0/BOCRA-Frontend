import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
  },
  async redirects() {
    return [
      {
        source: "/tarrifs",
        destination: "/tariffs",
        permanent: true,
      },
      {
        source: "/news-and-events",
        destination: "/news",
        permanent: true,
      },
    ];
  },
  // Empty turbopack config to silence warning
  turbopack: {},
};

export default nextConfig;
