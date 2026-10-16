import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      {
        source: "/dispatches",
        destination: "/news",
        permanent: true,
      },
      {
        source: "/dispatches/:slug",
        destination: "/news/:slug",
        permanent: true,
      },
      {
        source: "/contacts",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/cart",
        destination: "/checkout",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
