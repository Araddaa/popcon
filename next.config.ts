import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === 'true' || process.env.NEXT_PUBLIC_BASE_PATH === '/popcon';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isGithubPages ? '/popcon' : '',
  assetPrefix: isGithubPages ? '/popcon' : '',
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: isGithubPages ? '/popcon' : '',
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
