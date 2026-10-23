import type { MetadataRoute } from 'next';
import { activeRegions, trades, hiddenTradeSlugs } from '@/data/catalog';
import { listDirectoryPairCounts, listIndexableBusinessSlugs } from '@/db/runtime';
import { MIN_INDEXABLE_LISTINGS } from '@/data/directory-config';

export const dynamic = 'force-dynamic';

/**
 * Only pages that are indexable and useful: the home page, city pages with listings,
 * city/category pages with at least MIN_INDEXABLE_LISTINGS businesses, and business
 * profiles that contain owner-supplied detail. Thin pages remain reachable by links
 * (noindex, follow) but are not submitted.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://whoknowsapro.com';
  const pages: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/pricing`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/terms`, changeFrequency: 'yearly', priority: 0.2 },
  ];

  // Let this route fail during a database outage instead of publishing a
  // misleadingly shrunken sitemap that search engines may cache.
  const listedPairs = await listDirectoryPairCounts();
  const activeRegionSlugs = new Set<string>(activeRegions.map((region) => region.slug));
  const tradeSlugs = new Set<string>(trades.filter((trade) => !hiddenTradeSlugs.has(trade.slug)).map((trade) => trade.slug));
  const visiblePairs = listedPairs.filter((pair) => activeRegionSlugs.has(pair.region) && tradeSlugs.has(pair.trade));
  const regionsWithListings = new Set(visiblePairs.filter((pair) => pair.count > 0).map((pair) => pair.region));

  for (const region of activeRegions) {
    if (regionsWithListings.has(region.slug)) {
      pages.push({ url: `${base}/${region.slug}`, changeFrequency: 'weekly', priority: 0.8 });
    }
  }

  for (const pair of visiblePairs) {
    if (pair.count >= MIN_INDEXABLE_LISTINGS) {
      pages.push({ url: `${base}/${pair.region}/${pair.trade}`, changeFrequency: 'weekly', priority: 0.7 });
    }
  }

  for (const business of await listIndexableBusinessSlugs()) {
    pages.push({
      url: `${base}/business/${business.slug}`,
      lastModified: new Date(business.updated_at),
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  return pages;
}
