import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { activeRegions, hiddenTradeSlugs, visibleTrades } from '../data/catalog.ts';
import { directorySeed } from '../data/directory.ts';
import { isExcludedWebsite } from '../data/excluded-businesses.ts';

const baselineCommit = 'f07585bfe57e40dee6c40563ba6ea0d1d2d6e2b4';
const baselinePlacements = 14709;
const baselineProfiles = 3919;
const domain = (value) => new URL(value).hostname.toLowerCase().replace(/^www\./, '');
const newDomains = [
  'flooringdunnright.com',
  'concretecontractorgulfport.com',
  'alldayconstructionllc.com',
  'dannymillerplumbing.com',
  'cjsplumbingrepair.com',
  'arfplumbing.com',
  'waleswilsonplumbingllc.com',
  'tillmansheatingandair.com',
];
const expectedPlacements = new Map([
  ['flooringdunnright.com', ['biloxi-ms|flooring']],
  ['concretecontractorgulfport.com', ['gulfport-ms|concrete']],
  ['alldayconstructionllc.com', ['gulfport-ms|concrete', 'gulfport-ms|flooring']],
  ['dannymillerplumbing.com', ['biloxi-ms|plumbing', 'gulfport-ms|plumbing']],
  ['cjsplumbingrepair.com', ['biloxi-ms|plumbing', 'gulfport-ms|plumbing']],
  ['arfplumbing.com', ['biloxi-ms|plumbing', 'gulfport-ms|plumbing']],
  ['waleswilsonplumbingllc.com', ['biloxi-ms|plumbing', 'gulfport-ms|plumbing']],
  ['tillmansheatingandair.com', ['biloxi-ms|electrical', 'biloxi-ms|hvac', 'biloxi-ms|plumbing', 'gulfport-ms|electrical', 'gulfport-ms|hvac', 'gulfport-ms|plumbing']],
  ['relyonreliance.com', ['biloxi-ms|electrical', 'biloxi-ms|generator-installation', 'biloxi-ms|plumbing', 'gulfport-ms|electrical', 'gulfport-ms|generator-installation', 'gulfport-ms|plumbing']],
  ['teddybearservices.com', ['biloxi-ms|insulation', 'biloxi-ms|kitchen-bath-remodeling', 'biloxi-ms|plumbing', 'biloxi-ms|water-damage-mold-remediation', 'gulfport-ms|insulation', 'gulfport-ms|kitchen-bath-remodeling', 'gulfport-ms|plumbing', 'gulfport-ms|water-damage-mold-remediation']],
]);
const placementsForDomain = (providerDomain) => directorySeed
  .filter((business) => domain(business.website) === providerDomain)
  .map((business) => `${business.region}|${business.trade}`)
  .sort();

const coverage = [];
for (const region of activeRegions) for (const trade of visibleTrades) {
  const rows = directorySeed.filter((business) => business.region === region.slug && business.trade === trade.slug);
  const count = new Set(rows.map((business) => business.mainSlug)).size;
  coverage.push({ region: region.slug, trade: trade.slug, count, deficit: Math.max(0, 20 - count) });
}

let baselineMatches = '';
try {
  const args = ['grep', '-I', '-i', '-n'];
  for (const providerDomain of newDomains) args.push('-e', providerDomain);
  args.push(baselineCommit, '--', 'data');
  baselineMatches = execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
} catch {
  baselineMatches = '';
}

const assertions = [
  { name: 'catalog preserved', pass: activeRegions.length === 40 && visibleTrades.length === 28 && hiddenTradeSlugs.size === 12, detail: `${activeRegions.length} active, ${visibleTrades.length} visible, ${hiddenTradeSlugs.size} hidden` },
  { name: 'public page count preserved', pass: coverage.length === 1120, detail: `${coverage.length} pages` },
  { name: 'new identities absent from fixed baseline', pass: baselineMatches === '', detail: baselineMatches || 'no fixed-baseline source matches' },
  ...[...expectedPlacements].map(([providerDomain, expected]) => ({ name: `${providerDomain} has only supported placements`, pass: JSON.stringify(placementsForDomain(providerDomain)) === JSON.stringify(expected), detail: JSON.stringify(placementsForDomain(providerDomain)) })),
  { name: 'placement total', pass: directorySeed.length === baselinePlacements + 24, detail: `${directorySeed.length} placements` },
  { name: 'profile total', pass: new Set(directorySeed.map((business) => business.mainSlug)).size === baselineProfiles + 8, detail: `${new Set(directorySeed.map((business) => business.mainSlug)).size} profiles` },
  { name: 'all affected pages remain under target', pass: coverage.filter((page) => ['biloxi-ms', 'gulfport-ms'].includes(page.region) && ['flooring', 'concrete', 'plumbing', 'hvac', 'electrical'].includes(page.trade)).every((page) => page.count < 20), detail: 'no padding or above-target placement' },
  { name: 'all configured exclusions hold', pass: !directorySeed.some((business) => isExcludedWebsite(business.website)), detail: 'zero excluded-domain placements' },
];
for (const assertion of assertions) if (!assertion.pass) throw new Error(`${assertion.name}: ${assertion.detail}`);

const metrics = {
  totalPages: coverage.length,
  pagesAt20: coverage.filter((page) => page.count >= 20).length,
  pagesBelow20: coverage.filter((page) => page.count < 20).length,
  emptyPages: coverage.filter((page) => page.count === 0).length,
  displayedDeficit: coverage.reduce((sum, page) => sum + page.deficit, 0),
};
const report = {
  checkedAt: new Date().toISOString(),
  baselineCommit,
  baselinePlacements,
  baselineProfiles,
  generatedPlacements: directorySeed.length,
  generatedProfiles: new Set(directorySeed.map((business) => business.mainSlug)).size,
  distinctNewBusinesses: 8,
  newBusinessPlacements: 18,
  existingBusinessPlacements: 6,
  targetShortfall: 992,
  metrics,
  assertions,
  status: 'pass',
};
fs.writeFileSync('reports/validation-fill1000cj-2026-11-18.json', `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report));
