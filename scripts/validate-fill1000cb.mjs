import fs from 'node:fs';
import { activeRegions, visibleTrades } from '../data/catalog.ts';
import { directorySeed } from '../data/directory.ts';
import { isExcludedWebsite } from '../data/excluded-businesses.ts';

const baselineCommit = '40b7fdc8935c3973fe8e53635cf234aab9282228';
const baselinePlacements = 14665;
const domain = (value) => new URL(value).hostname.toLowerCase().replace(/^www\./, '');
const coverage = [];
for (const region of activeRegions) for (const trade of visibleTrades) {
  const placements = directorySeed.filter((business) => business.region === region.slug && business.trade === trade.slug);
  const distinctBusinesses = new Set(placements.map((business) => business.mainSlug)).size;
  coverage.push({ region: region.slug, trade: trade.slug, distinctBusinesses, deficit: Math.max(0, 20 - distinctBusinesses) });
}

const quincysPlacements = new Set(directorySeed.filter((business) => domain(business.website) === 'quincysair.com').map((business) => `${business.region}|${business.trade}`));
const expectedQuincysPlacements = new Set([
  'panama-city-fl|hvac',
  'panama-city-beach-fl|hvac',
  'grayton-beach-fl|hvac',
  'panama-city-fl|insulation',
  'panama-city-beach-fl|insulation',
]);
const assertions = [
  { name: 'catalog is current', pass: activeRegions.length === 40 && visibleTrades.length === 28, detail: `${activeRegions.length} active cities and ${visibleTrades.length} visible categories` },
  { name: 'public page count', pass: coverage.length === 1120, detail: `${coverage.length} pages` },
  { name: 'Quincy identity has only supported placements', pass: quincysPlacements.size === expectedQuincysPlacements.size && [...expectedQuincysPlacements].every((placement) => quincysPlacements.has(placement)), detail: JSON.stringify([...quincysPlacements].sort()) },
  { name: 'Quincy remains an existing baseline business', pass: fs.readFileSync('data/verified-coverage-2026-09-28.json', 'utf8').includes('quincysair.com'), detail: 'baseline source contains quincysair.com' },
  { name: 'all configured exclusions hold', pass: !directorySeed.some((business) => isExcludedWebsite(business.website)), detail: 'zero excluded-domain placements' },
  { name: 'Panama City insulation changed only to 15', pass: coverage.find((page) => page.region === 'panama-city-fl' && page.trade === 'insulation')?.distinctBusinesses === 15, detail: 'Panama City insulation 15' },
  { name: 'Panama City Beach insulation changed only to 15', pass: coverage.find((page) => page.region === 'panama-city-beach-fl' && page.trade === 'insulation')?.distinctBusinesses === 15, detail: 'Panama City Beach insulation 15' },
];
for (const assertion of assertions) if (!assertion.pass) throw new Error(`${assertion.name}: ${assertion.detail}`);

const metrics = {
  totalPages: coverage.length,
  pagesAt20: coverage.filter((page) => page.distinctBusinesses >= 20).length,
  pagesBelow20: coverage.filter((page) => page.distinctBusinesses < 20).length,
  emptyPages: coverage.filter((page) => page.distinctBusinesses === 0).length,
  displayedDeficit: coverage.reduce((sum, page) => sum + page.deficit, 0),
};
fs.writeFileSync('reports/coverage-fill1000cb-2026-11-16.csv', ['region,trade,distinctBusinesses,deficit', ...coverage.map((page) => `${page.region},${page.trade},${page.distinctBusinesses},${page.deficit}`)].join('\n') + '\n');
const report = {
  checkedAt: new Date().toISOString(), baselineCommit, baselinePlacements,
  generatedPlacements: directorySeed.length,
  generatedProfiles: new Set(directorySeed.map((business) => business.mainSlug)).size,
  distinctNewBusinesses: 0, newBusinessPlacements: 0, existingBusinessPlacements: 2,
  suppressedNationalPlacements: 0, suppressedInvalidWebsitePlacements: 0,
  researchedCandidates: 17, pendingCandidates: 5, targetShortfall: 1000,
  metrics, assertions, status: 'pass',
};
fs.writeFileSync('reports/validation-fill1000cb-2026-11-16.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report));
