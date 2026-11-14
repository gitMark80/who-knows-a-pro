import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { normalizeDomain, validateQualifyingCandidate } from './qualification-policy.mjs';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'silent' });
try {
  const { directorySeed, isAuditedExcludedDomainPlacement } = await server.ssrLoadModule('/data/directory.ts');
  const catalog = await server.ssrLoadModule('/data/catalog.ts');
  const { isExcludedWebsite } = await server.ssrLoadModule('/data/excluded-businesses.ts');
  const baseline = JSON.parse(fs.readFileSync(process.env.FILL_BASELINE_SEED ?? '/tmp/fill1000bs-baseline/seed.json'));
  const ledger = JSON.parse(fs.readFileSync('reports/evidence-fill1000bs-2026-11-14.json'));
  const source = JSON.parse(fs.readFileSync('data/verified-coverage-2026-11-14-fill1000bs.json'));
  const normalizeName = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, '');
  const canonicalSlugs = new Map([
    ['Terminix', 'terminix-panama-city'],
    ['Orkin', 'orkin-panama-city-branch-230'],
  ]);
  const placementKey = (row) => `${row.mainSlug ?? canonicalSlugs.get(row.name) ?? catalog.slug(row.name)}|${row.region}|${row.trade}`;
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
    const domainExists = baselineDomains.has(normalizeDomain(row.website));
    const nameExists = baselineNames.has(normalizeName(row.name));
    assert.equal(evidence.baselineIdentity, domainExists || nameExists ? 'existing' : 'new');
    for (const region of row.regions) for (const trade of row.trades) {
      assert(
        !isExcludedWebsite(row.website) || isAuditedExcludedDomainPlacement({ region, trade, website: row.website }),
        `Excluded website without placement audit ${row.website} ${region} ${trade}`,
      );
      const page = `${region}|${trade}`;
      if (!counts.has(page)) counts.set(page, new Set());
      assert(counts.get(page).size < 20, `Full page ${page}`);
      const placement = placementKey({ name: row.name, region, trade });
      assert(!expected.has(placement), `Duplicate proposed placement ${placement}`);
      assert(!baseline.some((item) => placementKey(item) === placement), `Placement already exists ${placement}`);
      expected.add(placement);
      counts.get(page).add(canonicalSlugs.get(row.name) ?? catalog.slug(row.name));
    }
  }
  assert.deepEqual(new Set(additions.map(placementKey)), expected);
  assert.equal(additions.length, expected.size);

  const newBusinessAdditions = additions.filter((row) => !existedAtBaseline(row));
  const existingBusinessAdditions = additions.filter((row) => existedAtBaseline(row));
  const distinctNewBusinesses = new Set(newBusinessAdditions.map((row) => normalizeName(row.name))).size;
  assert.equal(distinctNewBusinesses, 1);
  assert.equal(newBusinessAdditions.length, 4);
  assert.equal(existingBusinessAdditions.length, 3);

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
    displayedDeficit: publicPages.reduce((sum, page) => sum + page.deficit, 0),
  };
  assert.deepEqual(coverage, { totalPages: 1120, pagesAt20: 211, pagesBelow20: 909, emptyPages: 0, displayedDeficit: 9615 });
  fs.writeFileSync('reports/coverage-fill1000bs-2026-11-14.csv', ['region,trade,distinctBusinesses,deficit', ...publicPages.map((page) => `${page.region},${page.trade},${page.distinctBusinesses},${page.deficit}`)].join('\n') + '\n');
  const report = {
    checkedAt: new Date().toISOString(), status: 'prepared_not_published', baselineCommit: ledger.baselineCommit,
    baselinePreserved: baseline.length, distinctNewBusinessesPrepared: distinctNewBusinesses,
    newBusinessPlacementsPrepared: newBusinessAdditions.length, existingBusinessPlacementsPrepared: existingBusinessAdditions.length,
    placementsPrepared: additions.length, targetDistinctNewBusinesses: 1000,
    shortfallPendingLiveVerification: 1000 - distinctNewBusinesses, coverage, additions,
  };
  fs.writeFileSync('reports/validation-fill1000bs-2026-11-14.json', JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ ...report, additions: additions.length }));
} finally {
  await server.close();
}
