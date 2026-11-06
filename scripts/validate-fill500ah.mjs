import fs from 'node:fs';
import assert from 'node:assert/strict';
import { directorySeed } from '../data/directory.ts';
import * as catalog from '../data/catalog.ts';
import { isExcludedWebsite } from '../data/excluded-businesses.ts';
import { normalizeDomain, validateQualifyingCandidate } from './qualification-policy.mjs';
const baseline = JSON.parse(fs.readFileSync(process.env.FILL_BASELINE_SEED ?? '/workspace/shared/fill500ah-baseline.json'));
const ledger = JSON.parse(fs.readFileSync('reports/evidence-fill500ah-2026-11-05.json'));
const source = JSON.parse(fs.readFileSync('data/verified-coverage-2026-11-05-fill500ah.json'));
const ids = new Map(directorySeed.map(x => [x.id,x]));
for (const row of baseline) assert.deepEqual(ids.get(row.id),row,`Baseline changed ${row.id}`);
const baselineIds = new Set(baseline.map(x=>x.id));
const additions = directorySeed.filter(x=>!baselineIds.has(x.id));
const domains = new Set(baseline.map(x=>normalizeDomain(x.website)));
const names = new Set(baseline.map(x=>x.name.toLowerCase().replace(/[^a-z0-9]/g,'')));
const key = x=>`${normalizeDomain(x.website)}|${x.region}|${x.trade}`;
const expected = new Set();
const counts = new Map();
for(const row of baseline){const k=`${row.region}|${row.trade}`; if(!counts.has(k))counts.set(k,new Set());counts.get(k).add(row.mainSlug);}
for(const row of source){
 const evidence=ledger.records.find(x=>x.name===row.name);
 assert(evidence,`Missing evidence ${row.name}`); validateQualifyingCandidate(evidence,{catalog});
 assert(!isExcludedWebsite(row.website)); assert(!domains.has(normalizeDomain(row.website)),`Existing domain ${row.name}`);
 assert(!names.has(row.name.toLowerCase().replace(/[^a-z0-9]/g,'')),`Existing name ${row.name}`);
 for(const region of row.regions)for(const trade of row.trades){
  const k=`${region}|${trade}`; if(!counts.has(k))counts.set(k,new Set());
  assert(counts.get(k).size<20,`Full page ${k}`); counts.get(k).add(normalizeDomain(row.website));
  const placement=key({...row,region,trade}); assert(!expected.has(placement));expected.add(placement);
 }
}
assert.deepEqual(new Set(additions.map(key)),expected);
assert.equal(additions.length,expected.size);
const newBusinesses=new Set(additions.map(x=>normalizeDomain(x.website))).size;
assert.equal(newBusinesses,source.length);
const report={checkedAt:new Date().toISOString(),status:'prepared_not_published',baselineCommit:ledger.baselineCommit,baselinePreserved:baseline.length,newBusinessesPrepared:newBusinesses,placementsPrepared:additions.length,priorQualifiedNewBusinesses:103,cumulativePendingLiveVerification:103+newBusinesses,target:500,shortfallPendingLiveVerification:397-newBusinesses,additions};
fs.writeFileSync('reports/validation-fill500ah-2026-11-05.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({...report,additions:additions.length}));
