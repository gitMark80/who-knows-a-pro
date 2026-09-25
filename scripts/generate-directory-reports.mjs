import fs from 'node:fs/promises';
import { activeRegions, trades } from '../data/catalog.ts';
import { directorySeed } from '../data/directory.ts';
import { MIN_INDEXABLE_LISTINGS } from '../data/directory-config.ts';

const quote = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
const csv = (rows) => rows.map((row) => row.map(quote).join(',')).join('\n') + '\n';
const pairCounts = new Map();
for (const business of directorySeed) {
  const key = `${business.region}|${business.trade}`;
  const identities = pairCounts.get(key) ?? new Set();
  identities.add(business.mainSlug);
  pairCounts.set(key, identities);
}

const countRows = [['city', 'city_slug', 'category', 'category_slug', 'listing_count', 'under_12', 'under_3', 'indexable']];
for (const region of activeRegions) for (const trade of trades) {
  const count = pairCounts.get(`${region.slug}|${trade.slug}`)?.size ?? 0;
  countRows.push([region.name, region.slug, trade.name, trade.slug, count, count < 12 ? 'yes' : 'no', count < MIN_INDEXABLE_LISTINGS ? 'yes' : 'no', count >= MIN_INDEXABLE_LISTINGS ? 'yes' : 'no']);
}

// Public outreach email is intentionally separate from owner_email. No seed
// row is exported unless an address was verified on the business's own site.
const inviteRows = [['business_name', 'email', 'email_source_url', 'cities', 'categories', 'main_profile_url', 'claim_url']];
const profileRows = new Map();
for (const business of directorySeed) {
  const profile = profileRows.get(business.mainSlug) ?? {
    primary: business,
    cities: new Set(),
    categories: new Set(),
  };
  const region = activeRegions.find((item) => item.slug === business.region);
  const trade = trades.find((item) => item.slug === business.trade);
  profile.cities.add(region?.name ?? business.location);
  profile.categories.add(trade?.name ?? business.trade);
  if (!profile.primary.publicEmail && business.publicEmail) profile.primary = business;
  profileRows.set(business.mainSlug, profile);
}
for (const [mainSlug, profile] of [...profileRows].sort((a, b) => a[1].primary.name.localeCompare(b[1].primary.name))) {
  const business = profile.primary;
  if (!business.publicEmail || !business.emailSourceUrl) continue;
  inviteRows.push([
    business.name,
    business.publicEmail,
    business.emailSourceUrl,
    [...profile.cities].sort().join('; '),
    [...profile.categories].sort().join('; '),
    `https://whoknowsapro.com/business/${mainSlug}`,
    `https://whoknowsapro.com/claim?business=${business.id}`,
  ]);
}

await fs.mkdir('reports', { recursive: true });
await fs.writeFile('reports/directory-listing-counts.csv', csv(countRows));
await fs.writeFile('reports/unclaimed-business-claim-invitations.csv', csv(inviteRows));

const uniqueProfiles = new Set(directorySeed.map((business) => business.mainSlug)).size;
console.log(JSON.stringify({ placements: directorySeed.length, uniqueProfiles, consolidatedPlacements: directorySeed.length - uniqueProfiles, pages: countRows.length - 1, invitations: inviteRows.length - 1 }, null, 2));
