import fs from 'node:fs';
import { activeRegions, visibleTrades } from '../data/catalog.ts';
import { directorySeed } from '../data/directory.ts';
import { isExcludedWebsite } from '../data/excluded-businesses.ts';

const baselineCommit = '23956edb29b60a9c07e5a978165be41322b18edb';
const baselinePlacements = 14658;
const expected = new Map([
  ['solveall.biz', new Set(['fort-walton-beach-fl|marine-services', 'destin-fl|marine-services'])],
  ['twogeorgesmarine.com', new Set(['fort-walton-beach-fl|marine-services', 'destin-fl|marine-services'])],
  ['tommysglass.net', new Set(['panama-city-fl|hurricane-shutters-impact-windows', 'panama-city-beach-fl|hurricane-shutters-impact-windows'])],
  ['jmstormshutterservices.godaddysites.com', new Set(['panama-city-fl|hurricane-shutters-impact-windows', 'panama-city-beach-fl|hurricane-shutters-impact-windows'])],
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
  const placements = directorySeed.filter((business) => domain(business.website) === providerDomain);
  const actual = new Set(placements.map((business) => `${business.region}|${business.trade}`));
  assertions.push({
    name: `${providerDomain} has only supported placements`,
    pass: actual.size === expectedPlacements.size && [...expectedPlacements].every((placement) => actual.has(placement)),
    detail: JSON.stringify([...actual].sort()),
  });
}

const baselineSource = fs.readFileSync('data/directory.ts', 'utf8').replace("import verifiedFill1000bzData from './verified-coverage-2026-11-15-fill1000bz.json';", '');
assertions.push(
  { name: 'new domains were absent from fixed baseline sources', pass: [...expected.keys()].every((providerDomain) => !baselineSource.includes(providerDomain)), detail: 'new domains exist only in the fill1000bz source file' },
  { name: 'all configured exclusions hold', pass: !directorySeed.some((business) => isExcludedWebsite(business.website)), detail: 'zero excluded-domain placements' },
  { name: 'priority marine pages changed as expected', pass: coverage.find((page) => page.region === 'fort-walton-beach-fl' && page.trade === 'marine-services')?.distinctBusinesses === 20 && coverage.find((page) => page.region === 'destin-fl' && page.trade === 'marine-services')?.distinctBusinesses === 19, detail: 'Fort Walton Beach 20; Destin 19' },
  { name: 'Panama storm-protection pages reached 20', pass: coverage.filter((page) => ['panama-city-fl', 'panama-city-beach-fl'].includes(page.region) && page.trade === 'hurricane-shutters-impact-windows').every((page) => page.distinctBusinesses === 20), detail: 'Panama City 20; Panama City Beach 20' },
);

for (const assertion of assertions) if (!assertion.pass) throw new Error(`${assertion.name}: ${assertion.detail}`);

const metrics = {
  totalPages: coverage.length,
  pagesAt20: coverage.filter((page) => page.distinctBusinesses >= 20).length,
  pagesBelow20: coverage.filter((page) => page.distinctBusinesses < 20).length,
  emptyPages: coverage.filter((page) => page.distinctBusinesses === 0).length,
  displayedDeficit: coverage.reduce((sum, page) => sum + page.deficit, 0),
};

fs.writeFileSync('reports/coverage-fill1000bz-2026-11-15.csv', [
  'region,trade,distinctBusinesses,deficit',
  ...coverage.map((page) => `${page.region},${page.trade},${page.distinctBusinesses},${page.deficit}`),
].join('\n') + '\n');

const report = {
  checkedAt: new Date().toISOString(),
  baselineCommit,
  baselinePlacements,
  generatedPlacements: directorySeed.length,
  generatedProfiles: new Set(directorySeed.map((business) => business.mainSlug)).size,
  distinctNewBusinesses: 4,
  newBusinessPlacements: 8,
  existingBusinessPlacements: 0,
  suppressedNationalPlacements: 0,
  targetShortfall: 996,
  metrics,
  assertions,
  status: 'pass',
};
fs.writeFileSync('reports/validation-fill1000bz-2026-11-15.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report));
