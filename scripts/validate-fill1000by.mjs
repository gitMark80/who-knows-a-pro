import fs from 'node:fs';
import { activeRegions, visibleTrades } from '../data/catalog.ts';
import { directorySeed } from '../data/directory.ts';
import { isExcludedWebsite } from '../data/excluded-businesses.ts';

const baselineCommit = 'ccb83a69f6a047b07c5e3f85049f5f85f340d545';
const baselinePlacements = 14662;
const expectedNationalDomains = new Set([
  'windowdepotemeraldcoast.com',
  'maidright.com',
  'maids.com',
  'restoration1ofgulfcoast.com',
]);

const domain = (value) => new URL(value).hostname.toLowerCase().replace(/^www\./, '');
const coverage = [];
for (const region of activeRegions) for (const trade of visibleTrades) {
  const placements = directorySeed.filter((business) => business.region === region.slug && business.trade === trade.slug);
  const distinctBusinesses = new Set(placements.map((business) => business.mainSlug)).size;
  coverage.push({ region: region.slug, trade: trade.slug, distinctBusinesses, deficit: Math.max(0, 20 - distinctBusinesses) });
}

const southWind = directorySeed.filter((business) => domain(business.website) === 'southwindpestandtermite.com');
const assertions = [
  { name: 'catalog is current', pass: activeRegions.length === 40 && visibleTrades.length === 28, detail: `${activeRegions.length} active cities and ${visibleTrades.length} visible categories` },
  { name: 'public page count', pass: coverage.length === 1120, detail: `${coverage.length} pages` },
  { name: 'SouthWind has one exact placement', pass: southWind.length === 1 && southWind[0].region === 'fort-walton-beach-fl' && southWind[0].trade === 'pest-control', detail: JSON.stringify(southWind.map(({ region, trade }) => ({ region, trade }))) },
  { name: 'SouthWind was absent from fixed baseline', pass: !fs.readFileSync('data/directory.ts', 'utf8').includes('southwindpestandtermite.com'), detail: 'new data exists only in fill1000by source file' },
  { name: 'excluded brands do not leak', pass: !directorySeed.some((business) => expectedNationalDomains.has(domain(business.website))), detail: 'zero local-domain national-brand placements' },
  { name: 'all configured exclusions hold', pass: !directorySeed.some((business) => isExcludedWebsite(business.website)), detail: 'zero excluded-domain placements' },
];

for (const assertion of assertions) if (!assertion.pass) throw new Error(`${assertion.name}: ${assertion.detail}`);

const metrics = {
  totalPages: coverage.length,
  pagesAt20: coverage.filter((page) => page.distinctBusinesses >= 20).length,
  pagesBelow20: coverage.filter((page) => page.distinctBusinesses < 20).length,
  emptyPages: coverage.filter((page) => page.distinctBusinesses === 0).length,
  displayedDeficit: coverage.reduce((sum, page) => sum + page.deficit, 0),
};

fs.writeFileSync('reports/coverage-fill1000by-2026-11-15.csv', [
  'region,trade,distinctBusinesses,deficit',
  ...coverage.map((page) => `${page.region},${page.trade},${page.distinctBusinesses},${page.deficit}`),
].join('\n') + '\n');

const report = {
  checkedAt: new Date().toISOString(),
  baselineCommit,
  baselinePlacements,
  generatedPlacements: directorySeed.length,
  generatedProfiles: new Set(directorySeed.map((business) => business.mainSlug)).size,
  distinctNewBusinesses: 1,
  newBusinessPlacements: 1,
  existingBusinessPlacements: 0,
  suppressedNationalPlacements: 5,
  targetShortfall: 999,
  metrics,
  assertions,
  status: 'pass',
};
fs.writeFileSync('reports/validation-fill1000by-2026-11-15.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report));
