import type { MetadataRoute } from 'next';
import { activeRegions, trades } from '@/data/catalog';
import { listBusinessSlugs, listDirectoryPairCounts } from '@/db/runtime';
import { MIN_INDEXABLE_LISTINGS } from '@/data/directory-config';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://whoknowsapro.com';
  const pages: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: 'weekly', priority: 1 },
  ];

  for (const region of activeRegions) {
    pages.push({ url: `${base}/${region.slug}`, changeFrequency: 'weekly', priority: 0.8 });
  }

  // Let this route fail during a database outage instead of publishing a
  // misleadingly shrunken sitemap that search engines may cache.
  const listedPairs = await listDirectoryPairCounts();
  const activeRegionSlugs = new Set<string>(activeRegions.map((region) => region.slug));
  const tradeSlugs = new Set<string>(trades.map((trade) => trade.slug));
  for (const pair of listedPairs) {
    if (pair.count >= MIN_INDEXABLE_LISTINGS && activeRegionSlugs.has(pair.region) && tradeSlugs.has(pair.trade)) {
      pages.push({
        url: `${base}/${pair.region}/${pair.trade}`,
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  }

  const businesses = await listBusinessSlugs();
  for (const business of businesses) {
    pages.push({
      url: `${base}/business/${business.slug}`,
      lastModified: new Date(business.updated_at),
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  }

  return pages;
}
