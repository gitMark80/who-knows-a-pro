import type { MetadataRoute } from 'next';

// Query-string variants of /claim and /pricing are per-listing calls to action, not content.
// Blocking them saves crawl budget for city, category, and business pages; the base
// /claim and /pricing pages stay crawlable. Search engines and the Stripe webhook are unaffected.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/dashboard', '/api/', '/reel', '/claim?', '/claim/verify', '/pricing?'],
    },
    sitemap: 'https://whoknowsapro.com/sitemap.xml',
  };
}
