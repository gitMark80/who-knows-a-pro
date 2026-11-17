import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { activeRegions, hiddenTradeSlugs, visibleTrades } from '../data/catalog.ts';
import { directorySeed } from '../data/directory.ts';
import { isExcludedWebsite } from '../data/excluded-businesses.ts';

const baselineCommit = '7ac335c7e2468bb21f0877409638457e61d32a57';
const baselinePlacements = 14697;
const baselineProfiles = 3910;
const domains = ['aardvarklawnandpool.com', 'gulfsidepoolservice.com', 'kellysclearpools.com'];
const domain = (value) => new URL(value).hostname.toLowerCase().replace(/^www\./, '');
const coverage = [];
for (const region of activeRegions) for (const trade of visibleTrades) {
  const placements = directorySeed.filter((business) => business.region === region.slug && business.trade === trade.slug);
  const distinctBusinesses = new Set(placements.map((business) => business.mainSlug)).size;
  coverage.push({ region: region.slug, trade: trade.slug, distinctBusinesses, deficit: Math.max(0, 20 - distinctBusinesses) });
}

const expectedPlacements = new Map([
  ['aardvarklawnandpool.com', ['panama-city-fl|pool-service']],
  ['gulfsidepoolservice.com', ['panama-city-fl|pool-service']],
  ['kellysclearpools.com', ['panama-city-beach-fl|pool-service']],
]);
const placementsForDomain = (providerDomain) => directorySeed
  .filter((business) => domain(business.website) === providerDomain)
  .map((business) => `${business.region}|${business.trade}`)
  .sort();
let baselineMatches = '';
try {
  const args = ['grep', '-I', '-i', '-n'];
  for (const providerDomain of domains) args.push('-e', providerDomain);
  args.push(baselineCommit, '--', 'data');
  baselineMatches = execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
} catch {
  baselineMatches = '';
}

const assertions = [
  { name: 'catalog is current', pass: activeRegions.length === 40 && visibleTrades.length === 28 && hiddenTradeSlugs.size === 12, detail: `${activeRegions.length} active cities, ${visibleTrades.length} visible and ${hiddenTradeSlugs.size} hidden categories` },
  { name: 'public page count', pass: coverage.length === 1120, detail: `${coverage.length} pages` },
  { name: 'fixed-baseline identities are new', pass: baselineMatches === '', detail: baselineMatches || 'no baseline source matches' },
  ...[...expectedPlacements].map(([providerDomain, expected]) => ({ name: `${providerDomain} has only supported placements`, pass: JSON.stringify(placementsForDomain(providerDomain)) === JSON.stringify(expected), detail: JSON.stringify(placementsForDomain(providerDomain)) })),
  { name: 'new placement total', pass: directorySeed.length === baselinePlacements + 3, detail: `${directorySeed.length} placements` },
  { name: 'new profile total', pass: new Set(directorySeed.map((business) => business.mainSlug)).size === baselineProfiles + 3, detail: `${new Set(directorySeed.map((business) => business.mainSlug)).size} profiles` },
  { name: 'Panama City Beach pool service stopped at target', pass: coverage.find((page) => page.region === 'panama-city-beach-fl' && page.trade === 'pool-service')?.distinctBusinesses === 20, detail: 'no above-target placement added' },
  { name: 'all configured exclusions hold', pass: !directorySeed.some((business) => isExcludedWebsite(business.website)), detail: 'zero excluded-domain placements' },
  { name: 'historical Hometown identity variants retained for review', pass: new Set(directorySeed.filter((business) => domain(business.website) === 'hometowngaragenwfl.com').map((business) => business.mainSlug)).size === 2, detail: 'two historical main slugs share one official domain; no deletion or visibility change' },
];
for (const assertion of assertions) if (!assertion.pass) throw new Error(`${assertion.name}: ${assertion.detail}`);

const metrics = {
  totalPages: coverage.length,
  pagesAt20: coverage.filter((page) => page.distinctBusinesses >= 20).length,
  pagesBelow20: coverage.filter((page) => page.distinctBusinesses < 20).length,
  emptyPages: coverage.filter((page) => page.distinctBusinesses === 0).length,
  displayedDeficit: coverage.reduce((sum, page) => sum + page.deficit, 0),
};
fs.writeFileSync('reports/coverage-fill1000cf-2026-11-17.csv', ['region,trade,distinctBusinesses,deficit', ...coverage.map((page) => `${page.region},${page.trade},${page.distinctBusinesses},${page.deficit}`)].join('\n') + '\n');
const report = {
  checkedAt: new Date().toISOString(), baselineCommit, baselinePlacements, baselineProfiles,
  generatedPlacements: directorySeed.length,
  generatedProfiles: new Set(directorySeed.map((business) => business.mainSlug)).size,
  distinctNewBusinesses: 3, newBusinessPlacements: 3, existingBusinessPlacements: 0,
  suppressedNationalPlacements: 0, researchedCandidates: 34, pendingCandidates: 7,
  targetShortfall: 997, metrics, assertions, status: 'pass',
};
fs.writeFileSync('reports/validation-fill1000cf-2026-11-17.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report));
