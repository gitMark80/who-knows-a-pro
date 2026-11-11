import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { normalizeDomain, validateQualifyingCandidate } from './qualification-policy.mjs';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'silent' });
try {
  const { directorySeed } = await server.ssrLoadModule('/data/directory.ts');
  const catalog = await server.ssrLoadModule('/data/catalog.ts');
  const { isExcludedWebsite } = await server.ssrLoadModule('/data/excluded-businesses.ts');
  const baseline = JSON.parse(fs.readFileSync(process.env.FILL_BASELINE_SEED ?? '/tmp/fill1000bg-baseline/seed.json'));
  const ledger = JSON.parse(fs.readFileSync('reports/evidence-fill1000bg-2026-11-11.json'));
  const source = JSON.parse(fs.readFileSync('data/verified-coverage-2026-11-11-fill1000bg.json'));
  const ids = new Map(directorySeed.map((row) => [row.id, row]));
  for (const row of baseline) assert.deepEqual(ids.get(row.id), row, `Baseline changed ${row.id}`);

  const baselineIds = new Set(baseline.map((row) => row.id));
  const additions = directorySeed.filter((row) => !baselineIds.has(row.id));
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
    assert.equal(evidence.baselineIdentity, 'new');
    assert(!isExcludedWebsite(row.website), `Excluded website ${row.website}`);
    const domain = normalizeDomain(row.website);
    const name = row.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    assert(!baselineDomains.has(domain), `Existing domain marked new: ${row.name}`);
    assert(!baselineNames.has(name), `Existing name marked new: ${row.name}`);
    for (const region of row.regions) for (const trade of row.trades) {
      const page = `${region}|${trade}`;
      if (!counts.has(page)) counts.set(page, new Set());
      assert(counts.get(page).size < 20, `Full page ${page}`);
      const placement = placementKey({ ...row, region, trade });
      assert(!expected.has(placement), `Duplicate proposed placement ${placement}`);
      assert(!baseline.some((item) => placementKey(item) === placement), `Placement already exists ${placement}`);
      expected.add(placement);
      counts.get(page).add(domain);
    }
  }
  assert.deepEqual(new Set(additions.map(placementKey)), expected);
  assert.equal(additions.length, expected.size);

  const newBusinessAdditions = additions.filter((row) => !baselineDomains.has(normalizeDomain(row.website)));
  const existingBusinessAdditions = additions.filter((row) => baselineDomains.has(normalizeDomain(row.website)));
  const distinctNewBusinesses = new Set(newBusinessAdditions.map((row) => normalizeDomain(row.website))).size;
  assert.equal(distinctNewBusinesses, 4);
  assert.equal(existingBusinessAdditions.length, 0);
  assert.equal(newBusinessAdditions.length, 8);

  const publicPages = [];
  for (const region of catalog.activeRegions) for (const trade of catalog.visibleTrades) {
    const distinct = new Set(directorySeed.filter((row) => row.region === region.slug && row.trade === trade.slug).map((row) => row.mainSlug)).size;
    publicPages.push({ region: region.slug, trade: trade.slug, distinctBusinesses: distinct, deficit: Math.max(0, 20 - distinct) });
  }
  const coverage = {
    totalPages: publicPages.length,
    pagesAt20: publicPages.filter((page) => page.distinctBusinesses >= 20).length,
    pagesBelow20: publicPages.filter((page) => page.distinctBusinesses < 20).length,
    emptyPages: publicPages.filter((page) => page.distinctBusinesses === 0).length,
    displayedDeficit: publicPages.reduce((sum, page) => sum + page.deficit, 0)
  };
  fs.writeFileSync('reports/coverage-fill1000bg-2026-11-11.csv', ['region,trade,distinctBusinesses,deficit', ...publicPages.map((page) => `${page.region},${page.trade},${page.distinctBusinesses},${page.deficit}`)].join('\n') + '\n');
  const report = {
    checkedAt: new Date().toISOString(), status: 'prepared_not_published', baselineCommit: ledger.baselineCommit,
    baselinePreserved: baseline.length, distinctNewBusinessesPrepared: distinctNewBusinesses,
    newBusinessPlacementsPrepared: newBusinessAdditions.length, existingBusinessPlacementsPrepared: existingBusinessAdditions.length,
    placementsPrepared: additions.length, targetDistinctNewBusinesses: 1000,
    shortfallPendingLiveVerification: 1000 - distinctNewBusinesses, coverage, additions
  };
  fs.writeFileSync('reports/validation-fill1000bg-2026-11-11.json', JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ ...report, additions: additions.length }));
} finally {
  await server.close();
}
