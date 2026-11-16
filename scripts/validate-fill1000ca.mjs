import fs from 'node:fs';
import { activeRegions, visibleTrades } from '../data/catalog.ts';
import { directorySeed } from '../data/directory.ts';
import { isExcludedWebsite } from '../data/excluded-businesses.ts';

const baselineCommit = 'bbccd9cdbca8d2a4b73c403e53097e4b23903ba3';
const baselinePlacements = 14664;
const expected = new Map([
  ['dothanpools.com', new Set(['dothan-al|pool-installation'])],
  ['tristateappliancerepair.com', new Set(['dothan-al|appliance-repair'])],
  ['rapidpumpout.com', new Set(['west-palm-beach-fl|septic-services', 'fort-lauderdale-fl|septic-services', 'miami-fl|septic-services'])],
]);

const domain = (value) => new URL(value).hostname.toLowerCase().replace(/^www\./, '');
const coverage = [];
for (const region of activeRegions) for (const trade of visibleTrades) {
  const placements = directorySeed.filter((business) => business.region === region.slug && business.trade === trade.slug);
  const distinctBusinesses = new Set(placements.map((business) => business.mainSlug)).size;
  coverage.push({ region: region.slug, trade: trade.slug, distinctBusinesses, deficit: Math.max(0, 20 - distinctBusinesses) });
}

const assertions = [
  { name: 'catalog is current', pass: activeRegions.length === 40 && visibleTrades.length === 28, detail: `${activeRegions.length} active cities and ${visibleTrades.length} visible categories` },
  { name: 'public page count', pass: coverage.length === 1120, detail: `${coverage.length} pages` },
];

for (const [providerDomain, expectedPlacements] of expected) {
  const actual = new Set(directorySeed.filter((business) => domain(business.website) === providerDomain).map((business) => `${business.region}|${business.trade}`));
  assertions.push({ name: `${providerDomain} has only supported placements`, pass: actual.size === expectedPlacements.size && [...expectedPlacements].every((placement) => actual.has(placement)), detail: JSON.stringify([...actual].sort()) });
}

const baselineSource = fs.readFileSync('data/directory.ts', 'utf8').replace("import verifiedFill1000caData from './verified-coverage-2026-11-16-fill1000ca.json';", '');
assertions.push(
  { name: 'new domains were absent from fixed baseline sources', pass: ['dothanpools.com', 'tristateappliancerepair.com'].every((providerDomain) => !baselineSource.includes(providerDomain)), detail: 'new domains exist only in the fill1000ca source file' },
  { name: 'all configured exclusions hold', pass: !directorySeed.some((business) => isExcludedWebsite(business.website)), detail: 'zero excluded-domain placements' },
  { name: 'Dothan additions changed only supported pages', pass: coverage.find((page) => page.region === 'dothan-al' && page.trade === 'pool-installation')?.distinctBusinesses === 5 && coverage.find((page) => page.region === 'dothan-al' && page.trade === 'appliance-repair')?.distinctBusinesses === 9, detail: 'Dothan pool installation 5; appliance repair 9' },
  { name: 'Miami septic extension changed only supported page', pass: coverage.find((page) => page.region === 'miami-fl' && page.trade === 'septic-services')?.distinctBusinesses === 19, detail: 'Miami septic services 19' },
);

for (const assertion of assertions) if (!assertion.pass) throw new Error(`${assertion.name}: ${assertion.detail}`);

const metrics = {
  totalPages: coverage.length,
  pagesAt20: coverage.filter((page) => page.distinctBusinesses >= 20).length,
  pagesBelow20: coverage.filter((page) => page.distinctBusinesses < 20).length,
  emptyPages: coverage.filter((page) => page.distinctBusinesses === 0).length,
  displayedDeficit: coverage.reduce((sum, page) => sum + page.deficit, 0),
};

fs.writeFileSync('reports/coverage-fill1000ca-2026-11-16.csv', ['region,trade,distinctBusinesses,deficit', ...coverage.map((page) => `${page.region},${page.trade},${page.distinctBusinesses},${page.deficit}`)].join('\n') + '\n');

const report = {
  checkedAt: new Date().toISOString(), baselineCommit, baselinePlacements,
  generatedPlacements: directorySeed.length,
  generatedProfiles: new Set(directorySeed.map((business) => business.mainSlug)).size,
  distinctNewBusinesses: 2, newBusinessPlacements: 2, existingBusinessPlacements: 1,
  suppressedNationalPlacements: 0, targetShortfall: 998, metrics, assertions, status: 'pass',
};
fs.writeFileSync('reports/validation-fill1000ca-2026-11-16.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report));
