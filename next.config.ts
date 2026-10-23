import type { NextConfig } from "next";

// Conservative headers that cannot break the site, Stripe Checkout redirects, Turnstile, or embeds of
// the "Find us" badge (an image on other sites). A full Content-Security-Policy is intentionally not
// set here because it needs testing against Vercel Analytics, Turnstile, and Stripe first.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Private and token-bearing pages must never be cached by shared caches or indexed.
      { source: "/claim/verify", headers: [{ key: "Cache-Control", value: "no-store" }, { key: "X-Robots-Tag", value: "noindex" }] },
      { source: "/admin/:path*", headers: [{ key: "Cache-Control", value: "no-store" }, { key: "X-Robots-Tag", value: "noindex" }] },
      { source: "/dashboard", headers: [{ key: "Cache-Control", value: "no-store" }, { key: "X-Robots-Tag", value: "noindex" }] },
    ];
  },
  async rewrites() {
    // Reel Studio is a static page in public/reel; serve it at /reel and /reel/ too.
    return [
      { source: "/reel", destination: "/reel/index.html" },
      { source: "/reel/", destination: "/reel/index.html" },
    ];
  },
};

export default nextConfig;
