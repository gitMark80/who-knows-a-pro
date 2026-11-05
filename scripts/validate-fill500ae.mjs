import fs from 'node:fs';
import assert from 'node:assert/strict';
import { directorySeed } from '../data/directory.ts';
import * as catalog from '../data/catalog.ts';
import { isExcludedWebsite } from '../data/excluded-businesses.ts';
import { normalizeDomain, validateQualifyingCandidate } from './qualification-policy.mjs';

const baseline = JSON.parse(fs.readFileSync(process.env.FILL_BASELINE_SEED ?? '/tmp/fill500ae-baseline-directory.json'));
const evidence = JSON.parse(fs.readFileSync('reports/evidence-fill500ae-2026-11-05.json'));
const source = JSON.parse(fs.readFileSync('data/verified-coverage-2026-11-05-fill500ae.json'));
const baselineIds = new Map(baseline.map(x => [x.id, x]));
const currentIds = new Map(directorySeed.map(x => [x.id, x]));
for (const row of baseline) assert.deepEqual(currentIds.get(row.id), row, `Baseline changed: ${row.id}`);
const additions = directorySeed.filter(x => !baselineIds.has(x.id));
const baselineDomains = new Set(baseline.map(x => normalizeDomain(x.website)));
const baselineNames = new Set(baseline.map(x => x.name.toLowerCase().replace(/[^a-z0-9]/g,'')));
const key = x => `${normalizeDomain(x.website)}|${x.region}|${x.trade}`;
const baselineKeys = new Set(baseline.map(key));
const expected = new Set();
const counts = new Map();
for (const row of baseline) {
  const pair = `${row.region}|${row.trade}`;
  if (!counts.has(pair)) counts.set(pair, new Set());
  counts.get(pair).add(row.mainSlug);
}
for (const row of source) {
  const reviewed = evidence.records.find(x => x.name === row.name);
  assert(reviewed, `Missing evidence: ${row.name}`);
  validateQualifyingCandidate(reviewed, {catalog});
  assert(!isExcludedWebsite(row.website), `Excluded brand: ${row.name}`);
  assert.equal(reviewed.sourceVerifiedAt, row.sourceVerifiedAt);
  const existed = baselineDomains.has(normalizeDomain(row.website));
  assert.equal(existed, reviewed.baselineIdentity === 'previously_listed');
  if (!existed) assert(!baselineNames.has(row.name.toLowerCase().replace(/[^a-z0-9]/g,'')), `Review same name: ${row.name}`);
  for (const region of row.regions) for (const trade of row.trades) {
    const k = key({...row, region, trade});
    assert(!baselineKeys.has(k), `Existing placement: ${k}`);
    assert(!expected.has(k), `Duplicate new placement: ${k}`);
    assert((counts.get(`${region}|${trade}`)?.size ?? 0) < 20, `Already full: ${region}/${trade}`);
    expected.add(k);
  }
}
assert.deepEqual(new Set(additions.map(key)), expected);
assert.equal(additions.length, expected.size);
const newDomains = new Set(additions.filter(x => !baselineDomains.has(normalizeDomain(x.website))).map(x => normalizeDomain(x.website)));
const pages = [];
for (const region of catalog.activeRegions) for (const trade of catalog.visibleTrades) {
  const before = counts.get(`${region.slug}|${trade.slug}`)?.size ?? 0;
  const after = new Set(directorySeed.filter(x => x.region === region.slug && x.trade === trade.slug).map(x => x.mainSlug)).size;
  pages.push({region:region.slug,trade:trade.slug,before,after,added:after-before,displayedDeficit:Math.max(0,20-after),qualifyingHistoricalCount:null});
}
const report = {baselineCommit:evidence.baselineCommit,status:'prepared_not_published',checkedAt:new Date().toISOString(),baselinePreserved:baseline.length,newBusinessesPrepared:newDomains.size,placementsPrepared:additions.length,placementsFromNewBusinesses:additions.filter(x=>newDomains.has(normalizeDomain(x.website))).length,placementsFromExistingBusinesses:additions.filter(x=>!newDomains.has(normalizeDomain(x.website))).length,target:500,shortfallPendingLiveVerification:500,totalPages:pages.length,displayedPagesAt20:pages.filter(x=>x.after>=20).length,displayedPagesBelow20:pages.filter(x=>x.after<20).length,displayedEmptyPages:pages.filter(x=>x.after===0).length,displayedDeficit:pages.reduce((n,x)=>n+x.displayedDeficit,0),verifiedPagesAt20:null,qualifyingDeficit:null,additions,pages};
fs.writeFileSync('reports/validation-fill500ae-2026-11-05.json', JSON.stringify({...report,pages:undefined,coverageFile:'reports/coverage-fill500ae-2026-11-05.csv'},null,2)+'\n');
fs.writeFileSync('reports/coverage-fill500ae-2026-11-05.csv','city,category,before,after,added,displayed_deficit,qualifying_historical_count\n'+pages.map(x=>[x.region,x.trade,x.before,x.after,x.added,x.displayedDeficit,'unknown'].join(',')).join('\n')+'\n');
console.log(JSON.stringify({...report,additions:additions.length,pages:pages.length}));
