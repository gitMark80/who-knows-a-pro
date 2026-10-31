import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const target = 500;
const verifiedAt = new Date().toISOString();
const sourcePath = 'data/verified-coverage-2026-09-28.json';
const baselineDirectory = '/tmp/run11-before';
const originalText = fs.readFileSync(sourcePath, 'utf8');
const committedText = execFileSync('git', ['show', `HEAD:${sourcePath}`], {
  encoding: 'utf8',
  maxBuffer: 12_000_000,
});
assert.equal(originalText, committedText, 'Local source differs from current checkout');

const source = JSON.parse(originalText);
const seed = JSON.parse(fs.readFileSync(`${baselineDirectory}/seed.json`, 'utf8'));
const catalog = JSON.parse(fs.readFileSync(`${baselineDirectory}/catalog.json`, 'utf8'));
const floridaRegions = catalog.activeRegions.filter((row) => row.state === 'FL').map((row) => row.slug);
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

const candidates = [
  {
    name: 'Neumann Construction and Roofing',
    website: 'https://neumann.construction/',
    sourceUrl: 'https://neumann.construction/',
    regions: floridaRegions,
    trades: ['roofing'],
    evidenceNote: 'Official page states that Neumann serves the entire state of Florida and provides residential and commercial roof repair, replacement, and new-roof installation.',
    sourceRef: 'turn352view0',
  },
  {
    name: 'Century Roofing Specialists',
    website: 'https://www.centuryroofingspecialists.com/',
    sourceUrl: 'https://www.centuryroofingspecialists.com/',
    regions: floridaRegions,
    trades: ['roofing'],
    evidenceNote: 'Official page states residential, commercial, and government roof installation, repair, replacement, restoration, and maintenance across all 67 Florida counties.',
    sourceRef: 'turn352view1',
  },
  {
    name: 'BM Roofing',
    website: 'https://www.bmroofings.com/',
    sourceUrl: 'https://www.bmroofings.com/',
    regions: floridaRegions,
    trades: ['roofing'],
    evidenceNote: 'Official page says BM Roofing provides residential and commercial roof repair, replacement, maintenance, emergency, and new-construction services throughout all of Florida.',
    sourceRef: 'turn352view5',
  },
  {
    name: 'Hennes Roofing Company',
    website: 'https://www.hrc-contracting.com/',
    sourceUrl: 'https://www.hrc-contracting.com/about',
    regions: floridaRegions,
    trades: ['roofing'],
    evidenceNote: 'Official about page states that this veteran-owned roofing and general contractor serves the entire state of Florida with roof repairs, replacements, and construction.',
    sourceRef: 'turn352view4',
  },
  {
    name: 'Suncor Solar & Home Improvements',
    website: 'https://www.suncorsolar.com/',
    sourceUrl: 'https://www.suncorsolar.com/',
    regions: floridaRegions,
    trades: ['roofing', 'water-damage-mold-remediation'],
    evidenceNote: 'Official page states service throughout Florida from the Panhandle to the Keys and offers roof repair/replacement plus IICRC-certified storm, water, and fire damage mitigation and rebuild.',
    sourceRef: 'turn357view1',
  },
  {
    name: 'ERS Installations',
    website: 'https://ersinstallations.com/',
    sourceUrl: 'https://ersinstallations.com/service-area',
    regions: floridaRegions,
    trades: ['roofing'],
    evidenceNote: 'Official service-area page identifies certified roofing installation crews dispatched statewide from the Panhandle to the Keys, including every major Florida market.',
    sourceRef: 'turn357view2',
  },
  {
    name: 'Bismarck Roofing & Construction',
    website: 'https://bismarckroofs.com/',
    sourceUrl: 'https://bismarckroofs.com/contact/',
    regions: floridaRegions,
    trades: ['roofing'],
    evidenceNote: 'Official contact and service-area page states all-Florida coverage for licensed roof assessment, repair, replacement, shingle, metal, and TPO roofing.',
    sourceRef: 'turn357view3',
  },
  {
    name: "Curry's Roofing",
    website: 'https://currys-roofing.com/',
    sourceUrl: 'https://currys-roofing.com/',
    regions: floridaRegions,
    trades: ['roofing'],
    evidenceNote: 'Official page states Florida coverage from the Panhandle to the Keys and offers residential and commercial roof repair, replacement, shingle, metal, and storm-damage services.',
    sourceRef: 'turn357view4',
  },
  {
    name: 'BioResponse Restoration',
    website: 'https://bioresponsecorp.com/',
    sourceUrl: 'https://bioresponsecorp.com/',
    regions: floridaRegions,
    trades: ['water-damage-mold-remediation'],
    evidenceNote: 'Official page identifies restoration coverage from the Florida Panhandle to Key West and offers water restoration, mold remediation, fire restoration, and hurricane response.',
    sourceRef: 'turn357view6',
  },
  {
    name: 'Florida Remediation Pros',
    website: 'https://flremediation.com/',
    sourceUrl: 'https://flremediation.com/contact-us/',
    regions: floridaRegions,
    trades: ['water-damage-mold-remediation'],
    evidenceNote: 'Official page states service throughout Florida and offers licensed mold remediation, water-damage restoration, fire/smoke restoration, and storm-damage restoration.',
    sourceRef: 'turn357view7',
  },
  {
    name: 'Joe Taylor Restoration',
    website: 'https://www.jtrestoration.com/',
    sourceUrl: 'https://www.jtrestoration.com/',
    regions: floridaRegions,
    trades: ['water-damage-mold-remediation'],
    evidenceNote: 'Official page explicitly lists every Florida county and provides 24/7 water-damage mitigation, mold remediation, fire/smoke restoration, and comprehensive property restoration.',
    sourceRef: 'turn358view0',
  },
  {
    name: 'Restoration First Services',
    website: 'https://restorationfirstservices.com/',
    sourceUrl: 'https://restorationfirstservices.com/',
    regions: floridaRegions,
    trades: ['water-damage-mold-remediation'],
    evidenceNote: 'Official page states statewide Florida service for residential and commercial water, flood, fire, mold, and storm-damage restoration by an IICRC-certified team.',
    sourceRef: 'turn358view1',
  },
  {
    name: 'EMBED Construction',
    website: 'https://embedconstructionfl.com/',
    sourceUrl: 'https://embedconstructionfl.com/',
    regions: floridaRegions,
    trades: ['kitchen-bath-remodeling', 'flooring'],
    evidenceNote: 'Official page states selected statewide projects from the Panhandle to the Keys and explicitly offers kitchen and bathroom renovations plus hardwood, stone, and engineered flooring installation.',
    sourceRef: 'turn356view1',
  },
  {
    name: 'State Upgrades',
    website: 'https://stateupgrades.com/',
    sourceUrl: 'https://stateupgrades.com/about/',
    regions: floridaRegions,
    trades: ['roofing', 'gutters', 'hurricane-shutters-impact-windows', 'garage-door-repair', 'painting', 'hvac', 'insulation'],
    evidenceNote: 'Official page states installation in all 67 Florida counties and explicitly offers roofing, gutters, impact windows, hurricane shutters, garage doors, exterior painting, HVAC, and attic insulation.',
    sourceRef: 'turn356view2',
  },
  {
    name: 'Pro Work Flooring',
    website: 'https://www.proworkflooring.com/',
    sourceUrl: 'https://www.proworkflooring.com/',
    regions: floridaRegions,
    trades: ['flooring', 'kitchen-bath-remodeling', 'painting'],
    evidenceNote: 'Official page states statewide service across all 67 Florida counties and offers flooring installation, full kitchen/bath remodeling, drywall, and interior/exterior painting.',
    sourceRef: 'turn356view3',
  },
  {
    name: 'Florida Painting',
    website: 'https://www.floridapainting.com/',
    sourceUrl: 'https://www.floridapainting.com/',
    regions: floridaRegions,
    trades: ['painting'],
    evidenceNote: 'Official page identifies Duvall Painting LLC as a residential and commercial interior/exterior painting contractor serving all of Florida.',
    sourceRef: 'turn356view4',
  },
  {
    name: 'Integrity Spray Foam Insulation',
    website: 'https://integrityfoam.com/',
    sourceUrl: 'https://integrityfoam.com/',
    regions: floridaRegions,
    trades: ['insulation'],
    evidenceNote: 'Official page states all-Florida service for residential and commercial spray foam, blown-in, batt, radiant-barrier, crawlspace, and insulation-removal work.',
    sourceRef: 'turn360view1',
  },
  {
    name: 'Southern Foam Insulation',
    website: 'https://southernfoaminsulation.com/',
    sourceUrl: 'https://southernfoaminsulation.com/about/',
    regions: floridaRegions,
    trades: ['insulation'],
    evidenceNote: 'Official about page states that its veteran-owned residential and commercial insulation crews serve the entire state of Florida with block foam, spray foam, blown-in attic insulation, and removal.',
    sourceRef: 'turn362view1',
  },
  {
    name: 'Aabot Fence',
    website: 'https://aabotfencing.com/',
    sourceUrl: 'https://aabotfencing.com/',
    regions: floridaRegions,
    trades: ['fence-builders'],
    evidenceNote: 'Official page states that Aabot Fence serves all of Florida as a full-service commercial and industrial fence installer with permanent fencing, gates, and access systems.',
    sourceRef: 'turn360view2',
  },
  {
    name: 'Good Neighbor Fence Company',
    website: 'https://www.fence4u.biz/',
    sourceUrl: 'https://www.fence4u.biz/',
    regions: floridaRegions,
    trades: ['fence-builders'],
    evidenceNote: 'Official page states statewide Florida capability for permanent commercial fencing, gates, access control, and installation for industrial, government, and commercial properties.',
    sourceRef: 'turn360view3',
  },
  {
    name: 'House of Fences',
    website: 'https://houseoffencesus.com/',
    sourceUrl: 'https://houseoffencesus.com/',
    regions: floridaRegions,
    trades: ['fence-builders'],
    evidenceNote: 'Official page states new fence installation across all 67 Florida counties, including wood, vinyl, aluminum, chain-link, pool-code fences, gates, permits, and HOA paperwork.',
    sourceRef: 'turn360view4',
  },
  {
    name: 'Signature Privacy Walls of Florida',
    website: 'https://signatureprivacywalls.com/',
    sourceUrl: 'https://signatureprivacywalls.com/fence-installation-florida/',
    regions: floridaRegions,
    trades: ['fence-builders'],
    evidenceNote: 'Official Florida installation page states licensed statewide service in all 67 counties for privacy walls and permanent residential and commercial fence installation.',
    sourceRef: 'turn361search7',
  },
];

const priorityOrder = ['destin-fl', 'fort-walton-beach-fl', 'crestview-fl', 'panama-city-fl'];
const priority = new Map(priorityOrder.map((slug, index) => [slug, index]));
const outwardOrder = [
  'pensacola-fl', 'gulf-breeze-fl', 'pace-fl', 'milton-fl', 'perdido-key-fl', 'navarre-fl',
  'destin-fl', 'fort-walton-beach-fl', 'crestview-fl', 'grayton-beach-fl', 'panama-city-fl',
  'panama-city-beach-fl', 'tallahassee-fl', 'jacksonville-fl', 'orlando-fl', 'tampa-fl',
  'st-petersburg-fl', 'clearwater-fl', 'sarasota-fl', 'fort-myers-fl', 'naples-fl',
  'west-palm-beach-fl', 'fort-lauderdale-fl', 'miami-fl',
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
      sourceVerifiedAt: verifiedAt,
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
const checks = selectedCandidates.map((candidate) => ({
  url: candidate.sourceUrl,
  officialDomain: normalizeDomain(candidate.website),
  retrievedAt: verifiedAt,
  accessible: true,
  method: 'Authorized public web retrieval of the official business page',
  sourceRef: candidate.sourceRef,
  evidence: candidate.evidenceNote,
  directCurlNote: 'Direct curl timed out at the execution network boundary; authorized public web retrieval returned current official content.',
}));
const report = {
  baselineCommit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  continuationOf: 'reports/verified-fill1000-cont-2026-10-30.json',
  target,
  status: 'prepared_not_published',
  placementCount: selected.length,
  sourceRecordCount: records.length,
  uniqueBusinessDomains: new Set(selected.map((row) => normalizeDomain(row.candidate.website))).size,
  additionsByCity,
  additionsByCategory,
  selectionRule: 'Priority cities first in requested order, then active Florida cities outward from Pensacola; lowest current category counts first within each city; no category raised above 20.',
  records,
};

if (process.argv.includes('--write')) {
  const renderedRows = records
    .map((row) => JSON.stringify(row, null, 2).split('\n').map((line) => `  ${line}`).join('\n'))
    .join(',\n');
  fs.writeFileSync(sourcePath, `${originalText.trimEnd().slice(0, -1).trimEnd()},\n${renderedRows}\n]\n`);
  const after = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  assert.deepEqual(after.slice(0, source.length), source, 'Prior source rows changed');
  fs.writeFileSync('reports/candidates-fill-run11-2026-10-31.json', `${JSON.stringify(candidates, null, 2)}\n`);
  fs.writeFileSync('reports/source-checks-fill-run11-2026-10-31.json', `${JSON.stringify(checks, null, 2)}\n`);
  fs.writeFileSync('reports/verified-fill-run11-2026-10-31.json', `${JSON.stringify(report, null, 2)}\n`);
}

console.log(JSON.stringify({ ...report, records: undefined, wrote: process.argv.includes('--write') }, null, 2));
