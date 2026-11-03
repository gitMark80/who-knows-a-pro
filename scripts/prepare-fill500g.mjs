import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { normalizeDomain, validateQualifyingCandidate } from './qualification-policy.mjs';

const target = Number(process.env.FILL_TARGET ?? 500);
const runNewBusinessTarget = Number(process.env.FILL_NEW_BUSINESS_TARGET ?? 1000);
const run = process.env.FILL_RUN ?? 'fill500g';
const date = process.env.FILL_DATE ?? '2026-11-01';
const verifiedAt = new Date().toISOString();
const sourcePath = process.env.FILL_SOURCE_PATH ?? 'data/verified-coverage-2026-09-28.json';
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
// Optional fresh-evidence mode: old displayed rows are preserved, but they do
// not block additions until twenty distinct businesses have reviewed evidence.
const reviewedEvidenceFiles = JSON.parse(process.env.FILL_REVIEWED_EVIDENCE_FILES ?? '[]');
const regionSet = new Set(catalog.activeRegions.map((row) => row.slug));
const tradeSet = new Set(catalog.visibleTrades.map((row) => row.slug));
const placementKey = (website, region, trade) => `${normalizeDomain(website)}|${region}|${trade}`;
const existingKeys = new Set(seed.map((row) => placementKey(row.website, row.region, row.trade)));
const baselineDomains = new Set(seed.map((row) => normalizeDomain(row.website)));
const existingNames = new Map(seed.map((row) => [normalizeDomain(row.website), row.name]));
const beforeCounts = new Map();
for (const row of seed) {
  const key = `${row.region}|${row.trade}`;
  beforeCounts.set(key, (beforeCounts.get(key) ?? 0) + 1);
}
const counts = new Map(beforeCounts);

const validateCandidates = (input) => input.map((candidate) => {
  // A national commercial service area alone does not qualify a home-service listing.
  // Keep this evidence in the candidate checkpoint so later runs can review it.
  const consumerTrades = new Set(['auto-mechanics', 'auto-body-collision', 'towing', 'marine-services']);
  validateQualifyingCandidate(candidate);
  assert(['residential', 'consumer'].includes(candidate.customerScope), `Residential/consumer scope missing for ${candidate.name}`);
  assert(typeof candidate.customerEvidence === 'string' && candidate.customerEvidence.length > 80, `Residential/consumer evidence missing for ${candidate.name}`);
  assert(candidate.customerSourceUrl?.startsWith('https://'), `Customer evidence URL missing for ${candidate.name}`);
  if (candidate.trades.some((trade) => !consumerTrades.has(trade))) {
    assert.equal(candidate.customerScope, 'residential', `Home-service category needs residential evidence for ${candidate.name}`);
  }
  const areas = Array.isArray(candidate.regions) ? candidate.regions : [candidate.regions];
  const regions = catalog.activeRegions
    .filter((region) => areas.includes(region.state) || areas.includes(region.slug))
    .map((region) => region.slug);
  assert(regions.length > 0, `No active regions for ${candidate.name}`);
  assert(candidate.evidenceNote.length > 80, `Short evidence note for ${candidate.name}`);
  return validateQualifyingCandidate({ ...candidate, regions }, { catalog });
});
const candidates = validateCandidates(rawCandidates);
const reviewedKeys = new Set();
for (const candidate of validateCandidates(reviewedEvidenceFiles.flatMap((path) => JSON.parse(fs.readFileSync(path, 'utf8'))))) {
  assert(candidate.sourceVerifiedAt?.startsWith(date), `Evidence is not from this audit date: ${candidate.name}`);
  for (const region of candidate.regions) for (const trade of candidate.trades) {
    assert(regionSet.has(region) && tradeSet.has(trade), `Inactive reviewed placement for ${candidate.name}`);
    const key = placementKey(candidate.website, region, trade);
    if (existingKeys.has(key)) reviewedKeys.add(key);
  }
}
const reviewedBeforeCounts = new Map();
for (const key of reviewedKeys) {
  const [, region, trade] = key.split('|');
  const pair = `${region}|${trade}`;
  reviewedBeforeCounts.set(pair, (reviewedBeforeCounts.get(pair) ?? 0) + 1);
}
const selectionBeforeCounts = reviewedEvidenceFiles.length ? reviewedBeforeCounts : beforeCounts;
const quotaCounts = new Map(selectionBeforeCounts);

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
      const count = selectionBeforeCounts.get(`${region}|${trade}`) ?? 0;
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
  if ((quotaCounts.get(countKey) ?? 0) >= 20 || selectedKeys.has(option.key)) continue;
  selected.push(option);
  selectedKeys.add(option.key);
  counts.set(countKey, (counts.get(countKey) ?? 0) + 1);
  quotaCounts.set(countKey, (quotaCounts.get(countKey) ?? 0) + 1);
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
      ...(candidate.summary ? { summary: candidate.summary } : {}),
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
const selectedNewBusinessDomains = new Set(selected.map((row) => normalizeDomain(row.candidate.website)).filter((domain) => !baselineDomains.has(domain)));
const placementsFromNewBusinesses = selected.filter((row) => selectedNewBusinessDomains.has(normalizeDomain(row.candidate.website))).length;
const checks = [...new Map(selectedCandidates.map((candidate) => [candidate.sourceUrl, candidate])).values()].map((candidate) => ({
  url: candidate.sourceUrl,
  officialDomain: normalizeDomain(candidate.website),
  retrievedAt: candidate.sourceVerifiedAt,
  accessible: true,
  method: 'Authorized public web retrieval of the official business page',
  sourceRef: candidate.sourceRef,
  evidence: candidate.evidenceNote,
  supplementarySourceUrls: candidate.supplementarySourceUrls ?? [],
  customerScope: candidate.customerScope,
  customerEvidence: candidate.customerEvidence,
  customerSourceUrl: candidate.customerSourceUrl,
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
const remainingEligiblePlacements = options.filter((option) => !selectedKeys.has(option.key) && !existingKeys.has(option.key) && (quotaCounts.get(`${option.region}|${option.trade}`) ?? 0) < 20).length;
const report = {
  baselineCommit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  continuationOf: process.env.FILL_CONTINUATION_OF ?? 'reports/verified-fill1000f-2026-10-31.json',
  verifiedAt,
  target,
  runNewBusinessTarget,
  newBusinessCount: selectedNewBusinessDomains.size,
  newBusinessShortfall: Math.max(0, runNewBusinessTarget - selectedNewBusinessDomains.size),
  placementsFromNewBusinesses,
  placementsFromPreviouslyListedBusinesses: selected.length - placementsFromNewBusinesses,
  status: 'prepared_not_published',
  placementCount: selected.length,
  sourceRecordCount: records.length,
  uniqueBusinessDomains: new Set(selected.map((row) => normalizeDomain(row.candidate.website))).size,
  additionsByCity,
  additionsByCategory,
  additionsByBusiness,
  selectionRule: `Priority cities first at their lowest ${reviewedEvidenceFiles.length ? 'freshly reviewed qualifying' : 'displayed'} counts, then cities approximately outward from Pensacola and lowest counts within each city; no selected quota raised above 20. Historical display counts are not a fresh relevance audit.`,
  ...(reviewedEvidenceFiles.length ? { reviewedEvidence: {
    files: reviewedEvidenceFiles,
    auditDate: date,
    beforePlacements: reviewedKeys.size,
    afterPlacements: reviewedKeys.size + selected.length,
    beforeCounts: Object.fromEntries(reviewedBeforeCounts),
    afterCounts: Object.fromEntries(quotaCounts),
    note: 'Conservative reviewed-evidence coverage only; unreviewed historical listings are preserved and remain unaudited. Display counts are reported separately.',
  } } : {}),
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
