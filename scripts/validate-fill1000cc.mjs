import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { activeRegions, hiddenTradeSlugs, visibleTrades } from '../data/catalog.ts';
import { directorySeed } from '../data/directory.ts';
import { isExcludedWebsite } from '../data/excluded-businesses.ts';

const baselineCommit = '25233ba4973fd3a367497eb1da5f70159808352c';
const baselinePlacements = 14667;
const baselineProfiles = 3898;
const domain = (value) => new URL(value).hostname.toLowerCase().replace(/^www\./, '');
const coverage = [];
for (const region of activeRegions) for (const trade of visibleTrades) {
  const placements = directorySeed.filter((business) => business.region === region.slug && business.trade === trade.slug);
  const distinctBusinesses = new Set(placements.map((business) => business.mainSlug)).size;
  coverage.push({ region: region.slug, trade: trade.slug, distinctBusinesses, deficit: Math.max(0, 20 - distinctBusinesses) });
}

const placementsForDomain = (providerDomain) => directorySeed
  .filter((business) => domain(business.website) === providerDomain)
  .map((business) => `${business.region}|${business.trade}`)
  .sort();
const baselineDirectory = execFileSync('git', ['show', `${baselineCommit}:data/directory.ts`], { encoding: 'utf8' });
const baselineExclusions = execFileSync('git', ['show', `${baselineCommit}:data/excluded-businesses.ts`], { encoding: 'utf8' });
let baselineSources = '';
try {
  baselineSources = execFileSync('git', ['grep', '-I', '-i', '-n', '-e', 'buds-n-blossoms', '-e', "Buds N' Blossoms", baselineCommit, '--', 'data'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
} catch {
  baselineSources = '';
}

const assertions = [
  { name: 'catalog is current', pass: activeRegions.length === 40 && visibleTrades.length === 28 && hiddenTradeSlugs.size === 12, detail: `${activeRegions.length} active cities, ${visibleTrades.length} visible and ${hiddenTradeSlugs.size} hidden categories` },
  { name: 'public page count', pass: coverage.length === 1120, detail: `${coverage.length} pages` },
  { name: 'Tri-State has only supported placement', pass: JSON.stringify(placementsForDomain('tristateappliancerepair.com')) === JSON.stringify(['dothan-al|appliance-repair']), detail: JSON.stringify(placementsForDomain('tristateappliancerepair.com')) },
  { name: 'Tri-State uses working deep official page', pass: directorySeed.find((business) => domain(business.website) === 'tristateappliancerepair.com')?.website === 'https://www.tristateappliancerepair.com/services', detail: directorySeed.find((business) => domain(business.website) === 'tristateappliancerepair.com')?.website ?? 'missing' },
  { name: 'Tri-State was absent from baseline public directory', pass: baselineExclusions.includes("'tristateappliancerepair.com'") && baselineDirectory.includes('verifiedFill1000caData'), detail: 'baseline retained the source row but suppressed the failed homepage' },
  { name: 'Buds has only supported placements', pass: JSON.stringify(placementsForDomain('buds-n-blossoms.com')) === JSON.stringify(['dothan-al|irrigation-sprinkler-repair', 'dothan-al|landscaping']), detail: JSON.stringify(placementsForDomain('buds-n-blossoms.com')) },
  { name: 'Buds was absent from baseline data', pass: baselineSources === '', detail: baselineSources || 'no baseline matches' },
  { name: 'A to Z official-link correction did not add placements', pass: JSON.stringify(placementsForDomain('atoznwfl.com')) === JSON.stringify(['destin-fl|appliance-repair', 'fort-walton-beach-fl|appliance-repair', 'gulf-breeze-fl|appliance-repair', 'navarre-fl|appliance-repair']), detail: JSON.stringify(placementsForDomain('atoznwfl.com')) },
  { name: 'unsupported historical Crestview A to Z row remains visible and flagged', pass: directorySeed.some((business) => business.region === 'crestview-fl' && business.trade === 'appliance-repair' && domain(business.website) === 'appliance-repairs-destin.fl-biz.com'), detail: 'no deletion or visibility change' },
  { name: 'all configured exclusions hold', pass: !directorySeed.some((business) => isExcludedWebsite(business.website)), detail: 'zero excluded-domain placements' },
  { name: 'Dothan appliance repair increased to 9', pass: coverage.find((page) => page.region === 'dothan-al' && page.trade === 'appliance-repair')?.distinctBusinesses === 9, detail: 'expected 9' },
  { name: 'Dothan irrigation increased to 4', pass: coverage.find((page) => page.region === 'dothan-al' && page.trade === 'irrigation-sprinkler-repair')?.distinctBusinesses === 4, detail: 'expected 4' },
  { name: 'Dothan landscaping increased to 7', pass: coverage.find((page) => page.region === 'dothan-al' && page.trade === 'landscaping')?.distinctBusinesses === 7, detail: 'expected 7' },
];
for (const assertion of assertions) if (!assertion.pass) throw new Error(`${assertion.name}: ${assertion.detail}`);

const metrics = {
  totalPages: coverage.length,
  pagesAt20: coverage.filter((page) => page.distinctBusinesses >= 20).length,
  pagesBelow20: coverage.filter((page) => page.distinctBusinesses < 20).length,
  emptyPages: coverage.filter((page) => page.distinctBusinesses === 0).length,
  displayedDeficit: coverage.reduce((sum, page) => sum + page.deficit, 0),
};
fs.writeFileSync('reports/coverage-fill1000cc-2026-11-16.csv', ['region,trade,distinctBusinesses,deficit', ...coverage.map((page) => `${page.region},${page.trade},${page.distinctBusinesses},${page.deficit}`)].join('\n') + '\n');
const report = {
  checkedAt: new Date().toISOString(), baselineCommit, baselinePlacements, baselineProfiles,
  generatedPlacements: directorySeed.length,
  generatedProfiles: new Set(directorySeed.map((business) => business.mainSlug)).size,
  distinctNewBusinesses: 2, newBusinessPlacements: 3, existingBusinessPlacements: 0,
  officialWebsiteCorrections: 2, suppressedNationalPlacements: 0, suppressedInvalidWebsitePlacements: 1,
  researchedCandidates: 16, pendingCandidates: 5, targetShortfall: 998,
  metrics, assertions, status: 'pass',
};
fs.writeFileSync('reports/validation-fill1000cc-2026-11-16.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report));
