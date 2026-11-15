import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { normalizeDomain, validateQualifyingCandidate } from './qualification-policy.mjs';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'silent' });
try {
  const { directorySeed, isAuditedExcludedDomainPlacement } = await server.ssrLoadModule('/data/directory.ts');
  const catalog = await server.ssrLoadModule('/data/catalog.ts');
  const { isExcludedWebsite } = await server.ssrLoadModule('/data/excluded-businesses.ts');
  const baseline = JSON.parse(fs.readFileSync(process.env.FILL_BASELINE_SEED ?? '/tmp/fill1000bw-baseline/seed.json'));
  const ledger = JSON.parse(fs.readFileSync('reports/evidence-fill1000bw-2026-11-15.json'));
  const source = JSON.parse(fs.readFileSync('data/verified-coverage-2026-11-15-fill1000bw.json'));
  const normalizeName = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, '');
  const ids = new Map(directorySeed.map((row) => [row.id, row]));
  for (const row of baseline) assert.deepEqual(ids.get(row.id), row, `Baseline changed ${row.id}`);
  const baselineIds = new Set(baseline.map((row) => row.id));
  const additions = directorySeed.filter((row) => !baselineIds.has(row.id));
  const baselineDomains = new Set(baseline.map((row) => normalizeDomain(row.website)));
  const baselineNames = new Set(baseline.map((row) => normalizeName(row.name)));
  const existedAtBaseline = (row) => baselineDomains.has(normalizeDomain(row.website)) || baselineNames.has(normalizeName(row.name));
  const expected = new Set();
  const counts = new Map();
  for (const row of baseline) {
    const page = `${row.region}|${row.trade}`;
    if (!counts.has(page)) counts.set(page, new Set());
    counts.get(page).add(row.mainSlug);
  }
  for (const row of source) {
    const evidence = ledger.records.find((record) => record.name === row.name);
    assert(evidence, `Missing evidence ${row.name}`);
    validateQualifyingCandidate(evidence, { catalog, finalUrl: evidence.officialWebsiteFinalUrl });
    const existed = baselineDomains.has(normalizeDomain(row.website)) || baselineNames.has(normalizeName(row.name));
    assert.equal(evidence.baselineIdentity, existed ? 'existing' : 'new');
    for (const region of row.regions) for (const trade of row.trades) {
      assert(!isExcludedWebsite(row.website) || isAuditedExcludedDomainPlacement({ region, trade, website: row.website }), `Excluded website without audit ${row.website}`);
      const page = `${region}|${trade}`;
      if (!counts.has(page)) counts.set(page, new Set());
      assert.equal(counts.get(page).size, 19, `Expected one-business gap ${page}`);
      const placement = `${catalog.slug(row.name)}|${region}|${trade}`;
      assert(!expected.has(placement), `Duplicate proposed placement ${placement}`);
      assert(!baseline.some((item) => item.region === region && item.trade === trade && normalizeName(item.name) === normalizeName(row.name)), `Placement already exists ${placement}`);
      expected.add(placement);
      counts.get(page).add(catalog.slug(row.name));
    }
  }
  assert.deepEqual(new Set(additions.map((row) => `${catalog.slug(row.name)}|${row.region}|${row.trade}`)), expected);
  const newBusinessAdditions = additions.filter((row) => !existedAtBaseline(row));
  const existingBusinessAdditions = additions.filter((row) => existedAtBaseline(row));
  const distinctNewBusinesses = new Set(newBusinessAdditions.map((row) => normalizeName(row.name))).size;
  assert.equal(distinctNewBusinesses, 5);
  assert.equal(newBusinessAdditions.length, 8);
  assert.equal(existingBusinessAdditions.length, 0);
  const publicPages = [];
  for (const region of catalog.activeRegions) for (const trade of catalog.visibleTrades) {
    const distinct = new Set(directorySeed.filter((row) => row.region === region.slug && row.trade === trade.slug).map((row) => row.mainSlug)).size;
    publicPages.push({ region: region.slug, trade: trade.slug, distinctBusinesses: distinct, deficit: Math.max(0, 20 - distinct) });
  }
  const coverage = {totalPages:publicPages.length,pagesAt20:publicPages.filter((p)=>p.distinctBusinesses>=20).length,pagesBelow20:publicPages.filter((p)=>p.distinctBusinesses<20).length,emptyPages:publicPages.filter((p)=>p.distinctBusinesses===0).length,displayedDeficit:publicPages.reduce((s,p)=>s+p.deficit,0)};
  assert.deepEqual(coverage,{totalPages:1120,pagesAt20:230,pagesBelow20:890,emptyPages:0,displayedDeficit:9594});
  assert.equal(catalog.activeRegions.length,40); assert.equal(catalog.visibleTrades.length,28); assert.equal(catalog.hiddenTradeSlugs.size,12);
  assert(catalog.activeRegions.some((r)=>r.slug==='grayton-beach-fl')); assert(!catalog.activeRegions.some((r)=>r.slug==='pensacola-beach-fl'));
  fs.writeFileSync('reports/coverage-fill1000bw-2026-11-15.csv',['region,trade,distinctBusinesses,deficit',...publicPages.map((p)=>`${p.region},${p.trade},${p.distinctBusinesses},${p.deficit}`)].join('\n')+'\n');
  const report={checkedAt:new Date().toISOString(),status:'prepared_not_published',baselineCommit:ledger.baselineCommit,baselinePreserved:baseline.length,distinctNewBusinessesPrepared:distinctNewBusinesses,newBusinessPlacementsPrepared:newBusinessAdditions.length,existingBusinessPlacementsPrepared:existingBusinessAdditions.length,placementsPrepared:additions.length,targetDistinctNewBusinesses:1000,shortfallPendingLiveVerification:1000-distinctNewBusinesses,coverage,additions};
  fs.writeFileSync('reports/validation-fill1000bw-2026-11-15.json',JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({...report,additions:additions.length}));
} finally { await server.close(); }
