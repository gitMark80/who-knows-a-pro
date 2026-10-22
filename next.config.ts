import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // Reel Studio is a static page in public/reel; serve it at /reel and /reel/ too.
    return [
      { source: "/reel", destination: "/reel/index.html" },
      { source: "/reel/", destination: "/reel/index.html" },
    ];
  },
};

export default nextConfig;
