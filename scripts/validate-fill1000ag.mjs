import fs from 'node:fs';
import assert from 'node:assert/strict';
import { directorySeed } from '../data/directory.ts';
import * as catalog from '../data/catalog.ts';
import { isExcludedWebsite } from '../data/excluded-businesses.ts';
import { normalizeDomain, validateQualifyingCandidate } from './qualification-policy.mjs';

const baseline = JSON.parse(fs.readFileSync(process.env.FILL_BASELINE_SEED ?? '/tmp/fill1000ag-baseline.json'));
const ledger = JSON.parse(fs.readFileSync('reports/evidence-fill1000ag-2026-11-05.json'));
const source = JSON.parse(fs.readFileSync('data/verified-coverage-2026-11-05-fill1000ag.json'));
const currentById = new Map(directorySeed.map((row) => [row.id, row]));
for (const row of baseline) assert.deepEqual(currentById.get(row.id), row, `Baseline changed ${row.id}`);

const baselineIds = new Set(baseline.map((row) => row.id));
const additions = directorySeed.filter((row) => !baselineIds.has(row.id));
const sourceDomains = new Set(source.map((row) => normalizeDomain(row.website)));
const runAdditions = additions.filter((row) => sourceDomains.has(normalizeDomain(row.website)));
const concurrentAdditions = additions.filter((row) => !sourceDomains.has(normalizeDomain(row.website)));
const baselineDomains = new Set(baseline.map((row) => normalizeDomain(row.website)));
const baselineNames = new Set(baseline.map((row) => row.name.toLowerCase().replace(/[^a-z0-9]/g, '')));
const placementKey = (row) => `${normalizeDomain(row.website)}|${row.region}|${row.trade}`;
const expected = new Set();
const counts = new Map();
for (const row of baseline) {
  const key = `${row.region}|${row.trade}`;
  if (!counts.has(key)) counts.set(key, new Set());
  counts.get(key).add(row.mainSlug);
}
for (const row of source) {
  const evidence = ledger.records.find((record) => record.name === row.name);
  assert(evidence, `Missing evidence ${row.name}`);
  validateQualifyingCandidate(evidence, { catalog });
  assert(!isExcludedWebsite(row.website), `Excluded website ${row.name}`);
  assert(!baselineDomains.has(normalizeDomain(row.website)), `Existing domain ${row.name}`);
  assert(!baselineNames.has(row.name.toLowerCase().replace(/[^a-z0-9]/g, '')), `Existing name ${row.name}`);
  for (const region of row.regions) for (const trade of row.trades) {
    const page = `${region}|${trade}`;
    if (!counts.has(page)) counts.set(page, new Set());
    assert(counts.get(page).size < 20, `Full page ${page}`);
    counts.get(page).add(normalizeDomain(row.website));
    const placement = placementKey({ ...row, region, trade });
    assert(!expected.has(placement), `Duplicate placement ${placement}`);
    expected.add(placement);
  }
}
assert.deepEqual(new Set(runAdditions.map(placementKey)), expected);
assert.equal(runAdditions.length, expected.size);
const newBusinesses = new Set(runAdditions.map((row) => normalizeDomain(row.website))).size;
assert.equal(newBusinesses, source.length);
const after = new Map();
for (const row of directorySeed) {
  const key = `${row.region}|${row.trade}`;
  if (!after.has(key)) after.set(key, new Set());
  after.get(key).add(row.mainSlug);
}
const pages = [];
for (const region of catalog.activeRegions) for (const trade of catalog.visibleTrades) {
  const count = after.get(`${region.slug}|${trade.slug}`)?.size ?? 0;
  pages.push({ region: region.slug, trade: trade.slug, displayedCount: count, displayedDeficit: Math.max(0, 20 - count) });
}
const report = {
  checkedAt: new Date().toISOString(), status: 'prepared_not_published', baselineCommit: ledger.baselineCommit,
  baselinePreserved: baseline.length, newBusinessesPrepared: newBusinesses, placementsPrepared: runAdditions.length,
  concurrentPlacementsPreserved: concurrentAdditions.length,
  target: 1000, shortfallPendingLiveVerification: 1000 - newBusinesses,
  catalog: { activeCities: catalog.activeRegions.length, visibleCategories: catalog.visibleTrades.length, pages: pages.length },
  displayedCoverage: { pagesAt20: pages.filter((page) => page.displayedCount >= 20).length, pagesBelow20: pages.filter((page) => page.displayedCount < 20).length, emptyPages: pages.filter((page) => page.displayedCount === 0).length, remainingDeficit: pages.reduce((sum, page) => sum + page.displayedDeficit, 0), qualificationStatus: 'displayed counts only; historical qualification remains unaudited' },
  additions: runAdditions
};
fs.writeFileSync('reports/validation-fill1000ag-2026-11-05.json', `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ ...report, additions: runAdditions.length }));
