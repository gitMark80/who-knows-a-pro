import fs from 'node:fs';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const baselineDirectory = process.argv[2];
assert(baselineDirectory, 'Usage: node scripts/prepare-empty58.mjs BASELINE_EXPORT [--write]');
const sourcePath = 'data/verified-coverage-2026-09-28.json';
const original = fs.readFileSync(sourcePath, 'utf8');
const committed = execFileSync('git', ['show', `HEAD:${sourcePath}`], { encoding: 'utf8', maxBuffer: 5_000_000 });
assert.equal(original, committed, 'Source already changed: reconcile before importing');
const source = JSON.parse(original);
const seed = JSON.parse(fs.readFileSync(`${baselineDirectory}/seed.json`, 'utf8'));
const catalog = JSON.parse(fs.readFileSync(`${baselineDirectory}/catalog.json`, 'utf8'));
const candidates = JSON.parse(fs.readFileSync('reports/candidates-empty58-2026-10-30.json', 'utf8'));
const checks = JSON.parse(fs.readFileSync('reports/source-checks-empty58-2026-10-30.json', 'utf8'));
const passedUrls = new Set(checks.filter(row => row.status === 200).map(row => row.url));
const regions = new Set(catalog.activeRegions.map(row => row.slug));
const trades = new Set(catalog.visibleTrades.map(row => row.slug));
const domain = url => new URL(url).hostname.toLowerCase().replace(/^www\./, '');
const key = (host, region, trade) => `${host}|${region}|${trade}`;
const existingKeys = new Set(seed.map(row => key(domain(row.website), row.region, row.trade)));
const candidateKeys = new Set();
const existingNames = new Map(seed.map(row => [domain(row.website), row.name]));
const csv = fs.readFileSync('reports/coverage-empty58-before-2026-10-30.csv', 'utf8').trim().split('\n');
const headers = csv.shift().split(',');
const coverage = csv.map(line => Object.fromEntries(line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((value, i) => [headers[i], value.replace(/^"|"$/g, '')])));
const empty = new Set(coverage.filter(row => Number(row.listing_count) === 0).map(row => `${row.city_slug}|${row.category_slug}`));
const covered = new Set();
const verifiedAt = new Date().toISOString();
const records = candidates.map(candidate => {
  for (const url of [candidate.website, candidate.sourceUrl, ...(candidate.additionalSourceUrls ?? [])]) {
    assert(passedUrls.has(url), `Official URL has not passed HTTP verification: ${url}`);
  }
  assert(candidate.evidenceNote.length > 30, 'Missing meaningful evidence');
  for (const region of candidate.regions) for (const trade of candidate.trades) {
    assert(regions.has(region), `Invalid active city ${region}`);
    assert(trades.has(trade), `Invalid active category ${trade}`);
    assert(empty.has(`${region}|${trade}`), `Placement is outside this run's empty-category scope: ${region}/${trade}`);
    const placementKey = key(domain(candidate.website), region, trade);
    assert(!existingKeys.has(placementKey), `Already present: ${placementKey}`);
    assert(!candidateKeys.has(placementKey), `Candidate duplicate: ${placementKey}`);
    candidateKeys.add(placementKey);
    covered.add(`${region}|${trade}`);
  }
  const record = { ...candidate };
  delete record.additionalSourceUrls;
  return { ...record, name: existingNames.get(domain(record.website)) ?? record.name, sourceVerifiedAt: verifiedAt };
});
assert.equal(empty.size, 58);
assert.equal(covered.size, 58);
assert.equal(candidateKeys.size, 58);
const additionsByCity = {};
for (const row of records) for (const region of row.regions) additionsByCity[region] = (additionsByCity[region] ?? 0) + row.trades.length;
const evidence = {
  baselineCommit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  verifiedAt, scope: 'Give each of the 58 empty active city/category combinations its first relevant official-website listing.',
  status: 'prepared_not_yet_published',
  placementCount: candidateKeys.size, sourceRecordCount: records.length, additionsByCity,
  records,
  supplementalSources: candidates.filter(row => row.additionalSourceUrls).map(row => ({ name: row.name, urls: row.additionalSourceUrls })),
  identityNotes: [
    'Action Marine explicitly identifies itself as formerly Boyd’s Marine; only one business identity is added.',
    '21stcenturyhomeinspections.com and auhomeinspection.com identify the same Marc and Sherrill Orgeron business; only the former is listed.',
    'Existing FC Design Center, Sexton Lawn & Landscape and Trinity Property Maintenance names and identities are retained.',
    'American WallZone Supply is identified as an Auburn impact-window supplier; no on-site installation service is asserted.',
  ],
  blockersResolved: [
    'Hal Leary Home Inspections returned repeated HTTP 503; withheld and replaced with Home Check Inspections.',
    'Sunrise Pools NOLA returned repeated HTTP 503; withheld and replaced with Kingfish Pools.',
    'PC’s Nursery dynamic contact fields rendered as placeholders; direct irrigation and landscaping service pages provide relevance and Dothan coverage. Unknown contact fields omitted.',
    'Rapid Mitigation is client-rendered; official JavaScript content explicitly names Gulfport and Biloxi and water-damage/mold services.',
    'South Florida Insulation initially returned HTTP 502, then HTTP 200 on fresh retry.',
    'Wrong-state search results, excluded franchise businesses, and an unresolved generic Auburn window-site identity were not imported.',
  ],
};
if (process.argv.includes('--write')) {
  const rows = records.map(row => JSON.stringify(row, null, 2).split('\n').map(line => `  ${line}`).join('\n')).join(',\n');
  fs.writeFileSync(sourcePath, original.trimEnd().slice(0, -1).trimEnd() + ',\n' + rows + '\n]\n');
  const after = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  assert.deepEqual(after.slice(0, source.length), source, 'Prior source records changed');
  fs.writeFileSync('reports/verified-empty58-2026-10-30.json', JSON.stringify(evidence, null, 2)+'\n');
}
console.log(JSON.stringify({ placements: candidateKeys.size, records: records.length, additionsByCity, oldSourceRows: source.length, expectedNewSourceRows: source.length+records.length, wrote: process.argv.includes('--write') }, null, 2));
