import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const target = Number(process.env.FILL_TARGET ?? 500);
const run = process.env.FILL_RUN ?? 'fill500g';
const date = process.env.FILL_DATE ?? '2026-11-01';
const verifiedAt = new Date().toISOString();
const sourcePath = 'data/verified-coverage-2026-09-28.json';
const baselineDirectory = process.env.FILL_BASELINE_DIRECTORY ?? '/tmp/fill500g-before';
const originalText = fs.readFileSync(sourcePath, 'utf8');
const committedText = execFileSync('git', ['show', `HEAD:${sourcePath}`], {
  encoding: 'utf8',
  maxBuffer: 20_000_000,
});
assert.equal(originalText, committedText, 'Local source differs from current checkout');

const source = JSON.parse(originalText);
const seed = JSON.parse(fs.readFileSync(`${baselineDirectory}/seed.json`, 'utf8'));
const catalog = JSON.parse(fs.readFileSync(`${baselineDirectory}/catalog.json`, 'utf8'));
const candidateFiles = process.env.FILL_CANDIDATE_FILES ? JSON.parse(process.env.FILL_CANDIDATE_FILES) : [
  'reports/candidates-fill1000f-2026-10-31.json',
  `reports/candidates-${run}-${date}.json`,
];
const rawCandidates = candidateFiles.flatMap((path) => JSON.parse(fs.readFileSync(path, 'utf8')));
const regionSet = new Set(catalog.activeRegions.map((row) => row.slug));
const tradeSet = new Set(catalog.visibleTrades.map((row) => row.slug));
const normalizeDomain = (value) => new URL(value).hostname.toLowerCase().replace(/^www\./, '');
const placementKey = (website, region, trade) => `${normalizeDomain(website)}|${region}|${trade}`;
const existingKeys = new Set(seed.map((row) => placementKey(row.website, row.region, row.trade)));
const existingNames = new Map(seed.map((row) => [normalizeDomain(row.website), row.name]));
const beforeCounts = new Map();
for (const row of seed) {
  const key = `${row.region}|${row.trade}`;
  beforeCounts.set(key, (beforeCounts.get(key) ?? 0) + 1);
}
const counts = new Map(beforeCounts);

const candidates = rawCandidates.map((candidate) => {
  const areas = Array.isArray(candidate.regions) ? candidate.regions : [candidate.regions];
  const regions = catalog.activeRegions
    .filter((region) => areas.includes(region.state) || areas.includes(region.slug))
    .map((region) => region.slug);
  assert(regions.length > 0, `No active regions for ${candidate.name}`);
  assert(candidate.evidenceNote.length > 80, `Short evidence note for ${candidate.name}`);
  return { ...candidate, regions };
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
  for (const region of candidate.regions) {
    assert(regionSet.has(region), `Inactive region ${region}`);
    for (const trade of candidate.trades) {
      assert(tradeSet.has(trade), `Inactive trade ${trade}`);
      const key = placementKey(candidate.website, region, trade);
      if (existingKeys.has(key)) continue;
      const count = beforeCounts.get(`${region}|${trade}`) ?? 0;
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
  if (ap && priority.get(a.region) !== priority.get(b.region)) return priority.get(a.region) - priority.get(b.region);
  if (!ap && distance.get(a.region) !== distance.get(b.region)) return distance.get(a.region) - distance.get(b.region);
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
      name: candidate.displayName ?? existingNames.get(normalizeDomain(candidate.website)) ?? candidate.name,
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
const additionsByCity = Object.fromEntries([...selected.reduce((m, r) => m.set(r.region, (m.get(r.region) ?? 0) + 1), new Map())]);
const additionsByCategory = Object.fromEntries([...selected.reduce((m, r) => m.set(r.trade, (m.get(r.trade) ?? 0) + 1), new Map())]);
const additionsByBusiness = Object.fromEntries([...selected.reduce((m, r) => {
  const key = r.candidate.name;
  return m.set(key, (m.get(key) ?? 0) + 1);
}, new Map())]);
const selectedCandidates = candidates.filter((candidate) => selected.some((row) => row.candidate === candidate));
const checks = [...new Map(selectedCandidates.map((candidate) => [candidate.sourceUrl, candidate])).values()].map((candidate) => ({
  url: candidate.sourceUrl,
  officialDomain: normalizeDomain(candidate.website),
  retrievedAt: candidate.sourceVerifiedAt,
  accessible: true,
  method: 'Authorized public web retrieval of the official business page',
  sourceRef: candidate.sourceRef,
  evidence: candidate.evidenceNote,
  supplementarySourceUrls: candidate.supplementarySourceUrls ?? [],
}));

const rows = [];
let beforeAt20 = 0;
let afterAt20 = 0;
let beforeDeficit = 0;
let afterDeficit = 0;
const newlyCompletedCombinations = [];
for (const region of catalog.activeRegions) {
  for (const trade of catalog.visibleTrades) {
    const key = `${region.slug}|${trade.slug}`;
    const before = beforeCounts.get(key) ?? 0;
    const after = counts.get(key) ?? before;
    beforeAt20 += before >= 20 ? 1 : 0;
    afterAt20 += after >= 20 ? 1 : 0;
    beforeDeficit += Math.max(0, 20 - before);
    afterDeficit += Math.max(0, 20 - after);
    if (before < 20 && after >= 20) newlyCompletedCombinations.push(key);
    rows.push({ city: region.name, city_slug: region.slug, category: trade.name, category_slug: trade.slug, listing_count: after, minimum: 20, missing: Math.max(0, 20 - after), meets_minimum: after >= 20 });
  }
}
const remainingEligiblePlacements = options.filter((option) => !selectedKeys.has(option.key) && !existingKeys.has(option.key) && (counts.get(`${option.region}|${option.trade}`) ?? 0) < 20).length;
const report = {
  baselineCommit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  continuationOf: process.env.FILL_CONTINUATION_OF ?? 'reports/verified-fill1000f-2026-10-31.json',
  verifiedAt,
  target,
  status: 'prepared_not_published',
  placementCount: selected.length,
  sourceRecordCount: records.length,
  uniqueBusinessDomains: new Set(selected.map((row) => normalizeDomain(row.candidate.website))).size,
  additionsByCity,
  additionsByCategory,
  additionsByBusiness,
  selectionRule: 'Priority cities first at their lowest verified counts, then cities approximately outward from Pensacola and lowest counts within each city; no pair raised above 20.',
  before: { pairsAt20: beforeAt20, pairsBelow20: rows.length - beforeAt20, deficit: beforeDeficit },
  prepared: { pairsAt20: afterAt20, pairsBelow20: rows.length - afterAt20, deficit: afterDeficit, emptyPairs: rows.filter((row) => row.listing_count === 0).length },
  newlyCompletedCombinations,
  unselectedEligiblePlacements: remainingEligiblePlacements,
  records,
};

if (process.argv.includes('--write')) {
  const renderedRows = records.map((row) => JSON.stringify(row, null, 2).split('\n').map((line) => `  ${line}`).join('\n')).join(',\n');
  fs.writeFileSync(sourcePath, `${originalText.trimEnd().slice(0, -1).trimEnd()},\n${renderedRows}\n]\n`);
  const after = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  assert.deepEqual(after.slice(0, source.length), source, 'Prior source rows changed');
  fs.writeFileSync(`reports/source-checks-${run}-${date}.json`, `${JSON.stringify(checks, null, 2)}\n`);
  fs.writeFileSync(`reports/verified-${run}-${date}.json`, `${JSON.stringify(report, null, 2)}\n`);
  const header = ['city','city_slug','category','category_slug','listing_count','minimum','missing','meets_minimum'];
  const csv = [header.join(','), ...rows.map((row) => header.map((key) => JSON.stringify(row[key])).join(','))].join('\n') + '\n';
  fs.writeFileSync(`reports/coverage-${run}-prepared-${date}.csv`, csv);
}
console.log(JSON.stringify({ ...report, records: undefined, wrote: process.argv.includes('--write') }, null, 2));
