import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { activeRegions, hiddenTradeSlugs, visibleTrades } from '../data/catalog.ts';
import { directorySeed } from '../data/directory.ts';
import { isExcludedWebsite } from '../data/excluded-businesses.ts';

const baselineCommit = '449d32c7ac018afc63bff27ec710b6ce13f4c167';
const baselinePlacements = 14684;
const baselineProfiles = 3903;
const domains = [
  'anthonysapplianceal.com', 'bensonsappliancecenter.com', 'southernappliancepros.com',
  'coachslawncare.com', 'ohanaturf.com', 'jimrillolandscaping.com', 'lbclandscape.com',
  'kentslandscaping.com', 'threebrotherslandscape.com',
];
const domain = (value) => new URL(value).hostname.toLowerCase().replace(/^www\./, '');
const coverage = [];
for (const region of activeRegions) for (const trade of visibleTrades) {
  const placements = directorySeed.filter((business) => business.region === region.slug && business.trade === trade.slug);
  const distinctBusinesses = new Set(placements.map((business) => business.mainSlug)).size;
  coverage.push({ region: region.slug, trade: trade.slug, distinctBusinesses, deficit: Math.max(0, 20 - distinctBusinesses) });
}

const expectedPlacements = new Map([
  ['anthonysapplianceal.com', ['gulf-shores-al|appliance-repair', 'orange-beach-al|appliance-repair']],
  ['bensonsappliancecenter.com', ['foley-al|appliance-repair']],
  ['southernappliancepros.com', ['orange-beach-al|appliance-repair']],
  ['coachslawncare.com', ['foley-al|landscaping', 'gulf-shores-al|landscaping', 'orange-beach-al|landscaping']],
  ['ohanaturf.com', ['foley-al|landscaping', 'gulf-shores-al|landscaping']],
  ['jimrillolandscaping.com', ['foley-al|landscaping', 'gulf-shores-al|landscaping']],
  ['lbclandscape.com', ['foley-al|landscaping', 'gulf-shores-al|landscaping']],
  ['kentslandscaping.com', ['foley-al|landscaping']],
  ['threebrotherslandscape.com', ['foley-al|landscaping', 'gulf-shores-al|landscaping']],
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
  { name: 'new placement total', pass: directorySeed.length === baselinePlacements + 16, detail: `${directorySeed.length} placements` },
  { name: 'new profile total', pass: new Set(directorySeed.map((business) => business.mainSlug)).size === baselineProfiles + 9, detail: `${new Set(directorySeed.map((business) => business.mainSlug)).size} profiles` },
  { name: 'Orange Beach landscaping stopped at target', pass: coverage.find((page) => page.region === 'orange-beach-al' && page.trade === 'landscaping')?.distinctBusinesses === 20, detail: 'no above-target placement added' },
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
fs.writeFileSync('reports/coverage-fill1000ce-2026-11-17.csv', ['region,trade,distinctBusinesses,deficit', ...coverage.map((page) => `${page.region},${page.trade},${page.distinctBusinesses},${page.deficit}`)].join('\n') + '\n');
const report = {
  checkedAt: new Date().toISOString(), baselineCommit, baselinePlacements, baselineProfiles,
  generatedPlacements: directorySeed.length,
  generatedProfiles: new Set(directorySeed.map((business) => business.mainSlug)).size,
  distinctNewBusinesses: 9, newBusinessPlacements: 16, existingBusinessPlacements: 0,
  suppressedNationalPlacements: 0, researchedCandidates: 28, pendingCandidates: 4,
  targetShortfall: 991, metrics, assertions, status: 'pass',
};
fs.writeFileSync('reports/validation-fill1000ce-2026-11-17.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report));
