import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const target = 493;
const verifiedAt = new Date().toISOString();
const sourcePath = 'data/verified-coverage-2026-09-28.json';
const baselineDirectory = '/tmp/run1000-cont-before';
const originalText = fs.readFileSync(sourcePath, 'utf8');
const committedText = execFileSync('git', ['show', `HEAD:${sourcePath}`], { encoding: 'utf8', maxBuffer: 10_000_000 });
assert.equal(originalText, committedText, 'Local source differs from current checkout');

const source = JSON.parse(originalText);
const seed = JSON.parse(fs.readFileSync(`${baselineDirectory}/seed.json`, 'utf8'));
const catalog = JSON.parse(fs.readFileSync(`${baselineDirectory}/catalog.json`, 'utf8'));
const floridaRegions = catalog.activeRegions.filter(row => row.state === 'FL').map(row => row.slug);
const regionSet = new Set(catalog.activeRegions.map(row => row.slug));
const tradeSet = new Set(catalog.visibleTrades.map(row => row.slug));
const normalizeDomain = value => new URL(value).hostname.toLowerCase().replace(/^www\./, '');
const placementKey = (website, region, trade) => `${normalizeDomain(website)}|${region}|${trade}`;
const existingKeys = new Set(seed.map(row => placementKey(row.website, row.region, row.trade)));
const existingNames = new Map(seed.map(row => [normalizeDomain(row.website), row.name]));
const counts = new Map();
for (const row of seed) counts.set(`${row.region}|${row.trade}`, (counts.get(`${row.region}|${row.trade}`) ?? 0) + 1);

const candidates = [
  {
    name: 'Pocket Solutions Group', website: 'https://pocketsolutionsgroup.com/about', sourceUrl: 'https://pocketsolutionsgroup.com/about',
    regions: floridaRegions, trades: ['roofing', 'hurricane-shutters-impact-windows', 'kitchen-bath-remodeling', 'fence-builders', 'screen-enclosures-pool-cages'],
    evidenceNote: 'Official page states statewide Florida coverage from the Panhandle to the Keys and offers roofing, impact-window installation, turnkey kitchen/bath remodeling, fencing, and aluminum patio/screen-enclosure work.', sourceRef: 'turn348view0',
  },
  {
    name: 'TMaso Restoration', website: 'https://tmasorestoration.com/construction.html', sourceUrl: 'https://tmasorestoration.com/construction.html',
    regions: floridaRegions, trades: ['water-damage-mold-remediation', 'roofing', 'flooring', 'painting'],
    evidenceNote: 'Official statewide-Florida restoration and build-back page offers water and mold restoration plus licensed reconstruction including roofing, flooring installation, and painting/finishes.', sourceRef: 'turn348view1',
  },
  {
    name: 'Advantage Roofing & Construction', website: 'https://advantageroofs.com/', sourceUrl: 'https://advantageroofs.com/',
    regions: floridaRegions, trades: ['roofing', 'gutters', 'hurricane-shutters-impact-windows'],
    evidenceNote: 'Official page states Florida-wide service and offers residential/commercial roofing, seamless gutters, and energy-efficient impact-rated window installation through its licensed team.', sourceRef: 'turn348view2',
  },
  {
    name: 'American Residential Products', website: 'https://www.arpinsulation.com/', sourceUrl: 'https://www.arpinsulation.com/',
    regions: floridaRegions, trades: ['insulation'],
    evidenceNote: 'Official page identifies American Residential Products as a Florida statewide insulation contractor installing spray foam, masonry foam, batt/blown fiberglass, and radiant barrier for homes and commercial projects.', sourceRef: 'turn348view3',
  },
  {
    name: 'Standard Insulation', website: 'https://standard-insulation.com/', sourceUrl: 'https://standard-insulation.com/',
    regions: floridaRegions, trades: ['insulation'],
    evidenceNote: 'Official page offers residential and commercial spray-foam, blown-in, batt, radiant-barrier, and insulation-removal services in every incorporated city across all 67 Florida counties.', sourceRef: 'turn348view6',
  },
  {
    name: 'Florida Polyurea', website: 'https://floridapolyurea.com/', sourceUrl: 'https://floridapolyurea.com/',
    regions: floridaRegions, trades: ['concrete'],
    evidenceNote: 'Official page states statewide Florida coverage for concrete slab lifting and leveling plus protective driveway, garage, patio, and pool-deck coating systems.', sourceRef: 'turn348view4',
  },
  {
    name: 'Custom Construction Solutions', website: 'https://www.ccsofflorida.com/', sourceUrl: 'https://www.ccsofflorida.com/',
    regions: floridaRegions, trades: ['concrete'],
    evidenceNote: 'Official page offers commercial and residential concrete, block structures, foundations/site preparation, and land grading while explicitly stating service throughout Florida.', sourceRef: 'turn348view5',
  },
  {
    name: 'Hooper & Sons Concrete', website: 'https://www.hooperandsonsconcrete.com/', sourceUrl: 'https://www.hooperandsonsconcrete.com/',
    regions: floridaRegions, trades: ['concrete'],
    evidenceNote: 'Official page states statewide Florida service for residential driveways, sidewalks, patios, pool decks, foundations, and commercial/structural concrete construction.', sourceRef: 'turn348view7',
  },
  {
    name: 'All Around Concrete', website: 'https://allaroundflconcrete.com/', sourceUrl: 'https://allaroundflconcrete.com/',
    regions: floridaRegions, trades: ['concrete'],
    evidenceNote: 'Official page states mobilized commercial concrete crews serve all 67 Florida counties, including Panhandle operations, for slabs, post-tensioning, bridge concrete, demolition, and cast-in-place work.', sourceRef: 'turn350view0',
  },
  {
    name: 'A1 Concrete', website: 'https://www.a1-concrete.com/', sourceUrl: 'https://www.a1-concrete.com/',
    regions: floridaRegions, trades: ['concrete'],
    evidenceNote: 'Official page explicitly serves all Florida from the Panhandle to the Keys and offers foundations, driveways, patios, walkways, pool decks, stairs, columns, elevated slabs, and block work.', sourceRef: 'turn350view1',
  },
  {
    name: 'Azure Restoration', website: 'https://azurerestoration.com/', sourceUrl: 'https://azurerestoration.com/',
    regions: floridaRegions, trades: ['water-damage-mold-remediation'],
    evidenceNote: 'Official page explicitly serves all Florida and offers emergency flood/water-damage restoration, mold removal, fire/smoke cleanup, and complete disaster repair.', sourceRef: 'turn348view8',
  },
  {
    name: 'Unify Restoration', website: 'https://www.unifyrestoration.com/', sourceUrl: 'https://www.unifyrestoration.com/',
    regions: floridaRegions, trades: ['water-damage-mold-remediation'],
    evidenceNote: 'Official page identifies all-Florida coverage from the Panhandle to the Keys and offers water mitigation, mold remediation, fire restoration, storm response, and damage assessment.', sourceRef: 'turn347search1',
  },
  {
    name: 'Powerco Restoration', website: 'https://www.powercorestoration.com/', sourceUrl: 'https://www.powercorestoration.com/',
    regions: floridaRegions, trades: ['water-damage-mold-remediation'],
    evidenceNote: 'Official page states service throughout Florida and offers water/flood damage cleanup, mold removal and remediation, fire/smoke restoration, and storm/wind restoration.', sourceRef: 'turn348view10',
  },
  {
    name: 'Responder Restoration', website: 'https://responderrestoration.com/services/', sourceUrl: 'https://responderrestoration.com/services/',
    regions: floridaRegions, trades: ['water-damage-mold-remediation'],
    evidenceNote: 'Official services page offers water-damage restoration and mold removal/remediation and explicitly lists all-Florida coverage including Pensacola, Panama City, Tallahassee, Jacksonville, Tampa, Orlando, and South Florida.', sourceRef: 'turn348view11',
  },
  {
    name: 'L&G Fence Solutions', website: 'https://lgfencesolutions.com/', sourceUrl: 'https://lgfencesolutions.com/',
    regions: floridaRegions, trades: ['fence-builders'],
    evidenceNote: 'Official page offers professional wood, vinyl, aluminum, and chain-link fence installation and repair for Florida homes and businesses; its official page metadata states statewide Florida coverage.', sourceRef: 'turn350view2',
  },
  {
    name: 'All Style Fence Multiservices', website: 'https://allstylefences.com/', sourceUrl: 'https://allstylefences.com/',
    regions: floridaRegions, trades: ['fence-builders'],
    evidenceNote: 'Official page explicitly serves the entire state of Florida and offers design, installation, and repair of aluminum, wood, and PVC fences.', sourceRef: 'turn350view3',
  },
];

const priority = new Map(['destin-fl', 'fort-walton-beach-fl', 'crestview-fl', 'panama-city-fl'].map((slug, index) => [slug, index]));
const outward = ['pensacola-fl', 'gulf-breeze-fl', 'pace-fl', 'milton-fl', 'perdido-key-fl', 'navarre-fl', 'destin-fl', 'fort-walton-beach-fl', 'crestview-fl', 'grayton-beach-fl', 'panama-city-fl', 'panama-city-beach-fl', 'tallahassee-fl', 'jacksonville-fl', 'orlando-fl', 'tampa-fl', 'st-petersburg-fl', 'clearwater-fl', 'sarasota-fl', 'fort-myers-fl', 'naples-fl', 'west-palm-beach-fl', 'fort-lauderdale-fl', 'miami-fl'];
const distance = new Map(outward.map((slug, index) => [slug, index]));
const options = [];
for (const candidate of candidates) {
  assert(candidate.evidenceNote.length > 60);
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
  const ap = priority.has(a.region), bp = priority.has(b.region);
  if (ap !== bp) return ap ? -1 : 1;
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
  if (!grouped.has(groupKey)) grouped.set(groupKey, {
    name: existingNames.get(normalizeDomain(candidate.website)) ?? candidate.name,
    website: candidate.website,
    regions: [],
    trades: [option.trade],
    sourceUrl: candidate.sourceUrl,
    sourceVerifiedAt: verifiedAt,
    evidenceNote: candidate.evidenceNote,
  });
  grouped.get(groupKey).regions.push(option.region);
}
const records = [...grouped.values()];
const additionsByCity = Object.fromEntries([...selected.reduce((map, row) => map.set(row.region, (map.get(row.region) ?? 0) + 1), new Map())]);
const checks = candidates.filter(candidate => selected.some(row => row.candidate === candidate)).map(candidate => ({
  url: candidate.sourceUrl,
  officialDomain: normalizeDomain(candidate.website),
  retrievedAt: verifiedAt,
  accessible: true,
  method: 'Authorized public web retrieval of the official business page',
  sourceRef: candidate.sourceRef,
  evidence: candidate.evidenceNote,
}));
const report = {
  baselineCommit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  continuationOf: 'reports/verified-fill1000-2026-10-30.json',
  target,
  status: 'prepared_not_published',
  placementCount: selected.length,
  sourceRecordCount: records.length,
  uniqueBusinessDomains: new Set(selected.map(row => normalizeDomain(row.candidate.website))).size,
  additionsByCity,
  selectionRule: 'Priority cities first in requested order, then active Florida cities outward from Pensacola; lowest current category counts first within each city; no category raised above 20.',
  records,
};

if (process.argv.includes('--write')) {
  const rows = records.map(row => JSON.stringify(row, null, 2).split('\n').map(line => `  ${line}`).join('\n')).join(',\n');
  fs.writeFileSync(sourcePath, originalText.trimEnd().slice(0, -1).trimEnd() + ',\n' + rows + '\n]\n');
  const after = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  assert.deepEqual(after.slice(0, source.length), source, 'Prior source rows changed');
  fs.writeFileSync('reports/candidates-fill1000-cont-2026-10-30.json', JSON.stringify(candidates, null, 2) + '\n');
  fs.writeFileSync('reports/source-checks-fill1000-cont-2026-10-30.json', JSON.stringify(checks, null, 2) + '\n');
  fs.writeFileSync('reports/verified-fill1000-cont-2026-10-30.json', JSON.stringify(report, null, 2) + '\n');
}
console.log(JSON.stringify({ ...report, records: undefined, wrote: process.argv.includes('--write') }, null, 2));
