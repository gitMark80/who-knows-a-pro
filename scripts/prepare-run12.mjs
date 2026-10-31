import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const target = 500;
const verifiedAt = new Date().toISOString();
const sourcePath = 'data/verified-coverage-2026-09-28.json';
const baselineDirectory = '/tmp/run12-before';
const originalText = fs.readFileSync(sourcePath, 'utf8');
const committedText = execFileSync('git', ['show', `HEAD:${sourcePath}`], {
  encoding: 'utf8',
  maxBuffer: 12_000_000,
});
assert.equal(originalText, committedText, 'Local source differs from current checkout');

const source = JSON.parse(originalText);
const seed = JSON.parse(fs.readFileSync(`${baselineDirectory}/seed.json`, 'utf8'));
const catalog = JSON.parse(fs.readFileSync(`${baselineDirectory}/catalog.json`, 'utf8'));
const regionSet = new Set(catalog.activeRegions.map((row) => row.slug));
const tradeSet = new Set(catalog.visibleTrades.map((row) => row.slug));
const normalizeDomain = (value) => new URL(value).hostname.toLowerCase().replace(/^www\./, '');
const placementKey = (website, region, trade) => `${normalizeDomain(website)}|${region}|${trade}`;
const existingKeys = new Set(seed.map((row) => placementKey(row.website, row.region, row.trade)));
const existingNames = new Map(seed.map((row) => [normalizeDomain(row.website), row.name]));
const counts = new Map();
for (const row of seed) {
  const key = `${row.region}|${row.trade}`;
  counts.set(key, (counts.get(key) ?? 0) + 1);
}

const candidates = JSON.parse(fs.readFileSync('reports/candidates-run12-2026-10-31.json', 'utf8')).map((candidate) => {
  const areas = Array.isArray(candidate.regions) ? candidate.regions : [candidate.regions];
  return { ...candidate, regions: catalog.activeRegions.filter((region) => areas.includes(region.state) || areas.includes(region.slug)).map((region) => region.slug) };
});

const priorityOrder = ['destin-fl', 'fort-walton-beach-fl', 'crestview-fl', 'panama-city-fl'];
const priority = new Map(priorityOrder.map((slug, index) => [slug, index]));
const outwardOrder = [
 'pensacola-fl', 'gulf-breeze-fl', 'pace-fl', 'perdido-key-fl', 'milton-fl', 'navarre-fl',
 'orange-beach-al', 'gulf-shores-al', 'foley-al', 'fort-walton-beach-fl', 'crestview-fl',
 'destin-fl', 'fairhope-al', 'daphne-al', 'grayton-beach-fl', 'mobile-al',
 'panama-city-beach-fl', 'panama-city-fl', 'biloxi-ms', 'gulfport-ms', 'dothan-al',
 'montgomery-al', 'tallahassee-fl', 'auburn-al', 'new-orleans-la', 'baton-rouge-la',
 'birmingham-al', 'huntsville-al', 'atlanta-ga', 'jacksonville-fl', 'tampa-fl',
 'clearwater-fl', 'st-petersburg-fl', 'orlando-fl', 'sarasota-fl', 'fort-myers-fl',
 'naples-fl', 'west-palm-beach-fl', 'fort-lauderdale-fl', 'miami-fl',
];
const distance = new Map(outwardOrder.map((slug, index) => [slug, index]));
const options = [];
for (const candidate of candidates) {
  assert(candidate.evidenceNote.length > 80);
  for (const region of candidate.regions) {
    assert(regionSet.has(region), `Inactive region ${region}`);
    for (const trade of candidate.trades) {
      assert(tradeSet.has(trade), `Inactive trade ${trade}`);
      const key = placementKey(candidate.website, region, trade);
      if (existingKeys.has(key)) continue;
      const count = counts.get(`${region}|${trade}`) ?? 0;
      if (count >= 20) continue;
      options.push({ candidate, region, trade, count, key });
    }
  }
}

options.sort((a, b) => {
  const ap = priority.has(a.region);
  const bp = priority.has(b.region);
  if (ap !== bp) return ap ? -1 : 1;
  if (ap && a.count !== b.count) return a.count - b.count;
  if (ap && priority.get(a.region) !== priority.get(b.region)) {
    return priority.get(a.region) - priority.get(b.region);
  }
  if (!ap && distance.get(a.region) !== distance.get(b.region)) {
    return distance.get(a.region) - distance.get(b.region);
  }
  if (a.count !== b.count) return a.count - b.count;
  if (a.trade !== b.trade) return a.trade.localeCompare(b.trade);
  return normalizeDomain(a.candidate.website).localeCompare(normalizeDomain(b.candidate.website));
});

const selected = [];
const selectedKeys = new Set();
for (const option of options) {
  if (selected.length === target) break;
  const countKey = `${option.region}|${option.trade}`;
  if ((counts.get(countKey) ?? 0) >= 20 || selectedKeys.has(option.key)) continue;
  selected.push(option);
  selectedKeys.add(option.key);
  counts.set(countKey, (counts.get(countKey) ?? 0) + 1);
}
assert.equal(selected.length, target, `Verified pool supplied ${selected.length}/${target}`);

const grouped = new Map();
for (const option of selected) {
  const candidate = option.candidate;
  const groupKey = `${normalizeDomain(candidate.website)}|${option.trade}|${candidate.sourceUrl}`;
  if (!grouped.has(groupKey)) {
    grouped.set(groupKey, {
      name: existingNames.get(normalizeDomain(candidate.website)) ?? candidate.name,
      website: candidate.website,
      regions: [],
      trades: [option.trade],
      sourceUrl: candidate.sourceUrl,
      sourceVerifiedAt: candidate.sourceVerifiedAt,
      evidenceNote: candidate.evidenceNote,
    });
  }
  grouped.get(groupKey).regions.push(option.region);
}
const records = [...grouped.values()];
const additionsByCity = Object.fromEntries(
  [...selected.reduce((map, row) => map.set(row.region, (map.get(row.region) ?? 0) + 1), new Map())],
);
const additionsByCategory = Object.fromEntries(
  [...selected.reduce((map, row) => map.set(row.trade, (map.get(row.trade) ?? 0) + 1), new Map())],
);
const selectedCandidates = candidates.filter((candidate) => selected.some((row) => row.candidate === candidate));
const checks = [...new Map(selectedCandidates.map(c => [normalizeDomain(c.website), c])).values()].map((candidate) => ({
  url: candidate.sourceUrl,
  officialDomain: normalizeDomain(candidate.website),
  retrievedAt: candidate.sourceVerifiedAt,
  accessible: true,
  method: 'Authorized public web retrieval of the official business page',
  sourceRef: candidate.sourceRef,
  evidence: candidate.evidenceNote,
  supplementarySourceUrls: candidate.supplementarySourceUrls ?? [],
  retrievalNote: 'Official page content was successfully retrieved using the authorized public web retrieval tool; this is not an independent uptime guarantee.',
}));
const report = {
  baselineCommit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  continuationOf: 'reports/verified-fill1000c-2026-10-31.json',
  verifiedAt,
  rawCandidateCount: candidates.length,
  target,
  status: 'prepared_not_published',
  placementCount: selected.length,
  sourceRecordCount: records.length,
  uniqueBusinessDomains: new Set(selected.map((row) => normalizeDomain(row.candidate.website))).size,
  additionsByCity,
  additionsByCategory,
  selectionRule: 'Four priority cities first, lowest baseline category counts first across those cities, then cities approximately outward from Pensacola and lowest category counts within each city; no category raised above 20.',
  records,
};

if (process.argv.includes('--write')) {
  const renderedRows = records
    .map((row) => JSON.stringify(row, null, 2).split('\n').map((line) => `  ${line}`).join('\n'))
    .join(',\n');
  fs.writeFileSync(sourcePath, `${originalText.trimEnd().slice(0, -1).trimEnd()},\n${renderedRows}\n]\n`);
  const after = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  assert.deepEqual(after.slice(0, source.length), source, 'Prior source rows changed');
  fs.writeFileSync('reports/source-checks-run12-2026-10-31.json', `${JSON.stringify(checks, null, 2)}\n`);
  fs.writeFileSync('reports/verified-run12-2026-10-31.json', `${JSON.stringify(report, null, 2)}\n`);
}

console.log(JSON.stringify({ ...report, records: undefined, wrote: process.argv.includes('--write') }, null, 2));
