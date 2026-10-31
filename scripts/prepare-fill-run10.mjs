import fs from 'node:fs';

const sourcePath = 'data/verified-coverage-2026-09-28.json';
const seedPath = '/tmp/run10-seed/seed.json';
const verifiedAt = '2026-10-30';

const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
const seed = JSON.parse(fs.readFileSync(seedPath, 'utf8'));

const normalizedDomain = (value) => {
  const parsed = new URL(value);
  return parsed.hostname.toLowerCase().replace(/^www\./, '');
};

const byDomain = new Map();
for (const record of source) {
  const domain = normalizedDomain(record.website);
  const entry = byDomain.get(domain) ?? {
    name: record.name,
    website: record.website,
    regions: new Set(),
  };
  for (const region of record.regions) entry.regions.add(region);
  byDomain.set(domain, entry);
}

const candidates = [];
const add = (domain, trades, sourceUrl, evidenceNote, regions, website) => {
  const identity = byDomain.get(domain);
  if (!identity) throw new Error(`Missing identity for ${domain}`);
  candidates.push({
    name: identity.name,
    website: website ?? identity.website,
    regions: regions ?? [...identity.regions],
    trades,
    sourceUrl,
    sourceVerifiedAt: verifiedAt,
    evidenceNote,
  });
};

add('hometowncontractorsinc.com', ['gutters'], 'https://www.hometowncontractorsinc.com/gutters/', 'Official gutter page offers seamless gutter replacement and installation; the official service-area page names all included communities across Northwest Florida and coastal Alabama. Existing identity retained.');
add('hometowncontractorsinc.com', ['hurricane-shutters-impact-windows'], 'https://hometowncontractorsinc.com/service-areas/', 'Official service-area page offers impact-rated replacement windows and hurricane shutters throughout the named service communities. Existing identity retained.');
add('hometowncontractorsinc.com', ['fence-builders'], 'https://hometowncontractorsinc.com/all-extras/', 'Official outdoor-living page offers new boundary, garden-enclosure, and perimeter fence construction throughout the company\'s verified Greater Gulf Coast service area. Existing identity retained.');
add('ljbconstruction.com', ['painting', 'hurricane-shutters-impact-windows'], 'https://ljbconstruction.com/', 'Official site and city service pages offer waterproofing/painting plus impact-rated window and door installation throughout the company\'s verified Florida service cities. Existing roofing identity retained.');
add('kingsroofingllc.com', ['gutters'], 'https://www.kingsroofingllc.com/need-gutters-on-a-home-in-florida/', 'Official page invites quotes for gutter installation and repair and repeats the company\'s Florida Gulf Coast service territory. Existing roofing identity retained.');
add('homesouthroofing.com', ['gutters'], 'https://www.homesouthroofing.com/services/gutters/', 'Official gutter-services page offers repair, maintenance, replacement, and new installation across Alabama and the Florida Panhandle. Existing roofing identity retained.');
add('southernpoolscapes.com', ['pool-service'], 'https://southernpoolscapes.com/about-us/', 'Official about page states that the company provides pool construction, maintenance, and service; the existing official locations record supplies the included service cities. Existing pool-builder identity retained.');
add('coxpools.com', ['pool-service'], 'https://coxpools.com/renovations/', 'Official site offers existing-pool renovation, resurfacing, equipment upgrades, repair, and in-house service across its verified Northwest Florida service area. Existing pool-builder identity retained.');
add('aquaoasispool.com', ['pool-service'], 'https://www.aquaoasispool.com/faq', 'Official FAQ offers renovations for existing pools; official service-area pages name the included Northwest Florida communities. Existing pool-construction identity retained.');
add('procleannotsomekid.com', ['flooring', 'kitchen-bath-remodeling', 'concrete'], 'https://www.procleannotsomekid.com/flooring-and-cabinet-showroom', 'Official showroom and concrete-polishing pages offer professional flooring installation, turnkey kitchen/bath renovation, and concrete refinishing/coating in the six listed Pensacola-area communities.', ['pensacola-fl', 'gulf-breeze-fl', 'navarre-fl', 'perdido-key-fl', 'milton-fl', 'pace-fl']);
add('drigulfcoast.com', ['flooring'], 'https://www.drigulfcoast.com/services', 'Official services page offers flooring restoration from the Eastern Shore to Pensacola; included communities are already verified service areas. Existing restoration identity retained.');
add('emeraldcoastfusion.com', ['flooring', 'painting'], 'https://www.emeraldcoastfusion.com/water-damage-restoration/', 'Official restoration page states that full build-back restores drywall, flooring, paint, and trim; official company page names the included Emerald Coast service cities. Canonical working official homepage used.', ['fort-walton-beach-fl', 'destin-fl', 'crestview-fl', 'navarre-fl', 'pensacola-fl', 'gulf-breeze-fl', 'milton-fl', 'pace-fl'], 'https://www.emeraldcoastfusion.com/');
add('servicerestorationpros.com', ['flooring', 'painting'], 'https://servicerestorationpros.com/reconstruction-services-panama-city-fl', 'Official reconstruction page offers flooring replacement and full repaint/trim build-back in Bay County and the 30A corridor. Existing restoration identity retained.');
add('iknercontractors.com', ['roofing', 'screen-enclosures-pool-cages', 'hvac', 'plumbing', 'kitchen-bath-remodeling', 'flooring'], 'https://www.iknercontractors.com/', 'Official full-service and home-building pages offer roofing, screen enclosures, HVAC, plumbing, kitchen/bath renovation, and flooring work across the company\'s Northwest Florida county service area. Existing identity retained.');
add('salshomerepair.com', ['roofing', 'plumbing', 'electrical', 'kitchen-bath-remodeling', 'painting', 'fence-builders', 'tree-service', 'landscaping'], 'https://salshomerepair.com/about', 'Official site identifies roofing, plumbing, electrical, remodeling, painting, fencing, tree removal, and landscaping as in-house services; city pages confirm the existing verified service communities.');
add('hansensupertechs.com', ['hvac', 'plumbing', 'electrical', 'insulation'], 'https://hansensupertechs.com/services/', 'Official services and service-area pages offer HVAC, plumbing, electrical, and attic-insulation installation across the included Mobile and Baldwin County communities. Existing generator identity retained.');
add('wahoohomeservices.net', ['fence-builders'], 'https://wahoohomeservices.net/fence-building', 'Official fence page offers new wood, vinyl, aluminum, chain-link, and pool-code fence installation across the named Pensacola-area service cities. Existing identity retained.');
add('kksolutionsinc.com', ['tree-service'], 'https://www.kksolutionsinc.com/forestry-tree-removal', 'Official forestry page offers tree removal and stump grinding and explicitly names all included Northwest Florida service cities. Existing fence identity retained.');
add('elitestoneservicesinc.com', ['concrete', 'flooring'], 'https://elitestoneservicesinc.com/concrete/', 'Official concrete page offers decorative concrete, epoxy/flake flooring, restoration and installation and explicitly names the included Gulf Coast service cities.', ['pensacola-fl', 'gulf-breeze-fl', 'navarre-fl', 'destin-fl', 'orange-beach-al', 'perdido-key-fl', 'mobile-al', 'panama-city-fl']);
add('gomrfencefl.com', ['screen-enclosures-pool-cages'], 'https://gomrfencefl.com/outdoor-living/screen-enclosures/', 'Official screen-enclosure and outdoor-living pages offer screen-room installation from the Panama City headquarters across Panama City, Bay County, Pensacola, and Leon County.', ['panama-city-fl', 'panama-city-beach-fl', 'pensacola-fl', 'tallahassee-fl']);
add('paceplumber.com', ['kitchen-bath-remodeling'], 'https://www.paceplumber.com/services/', 'Official services page says Pace Plumbing specializes in kitchen and bathroom remodeling and explicitly lists the included Northwest Florida cities.', ['pensacola-fl', 'gulf-breeze-fl', 'navarre-fl', 'perdido-key-fl', 'milton-fl', 'pace-fl', 'crestview-fl', 'destin-fl', 'fort-walton-beach-fl']);
add('alwaysontimeelectric.com', ['electrical'], 'https://www.alwaysontimeelectric.com/what-we-do', 'Official site offers guaranteed residential electrical service and repair throughout the company\'s verified Okaloosa and Santa Rosa service communities. Existing generator identity retained.');
add('gulffencecon.com', ['screen-enclosures-pool-cages'], 'https://www.gulffencecon.com/services/screening-and-enclosures/', 'Official service page offers screened porches and enclosures throughout the Florida Panhandle; included cities are explicitly named elsewhere on the official site. Existing fence identity retained.');
add('kengriffinlandscape.com', ['landscaping', 'fence-builders'], 'https://www.kengriffinlandscape.com/services.html', 'Official site offers full-service landscape design, installation, maintenance, and new fence construction and explicitly names the included service cities.', ['pensacola-fl', 'gulf-breeze-fl', 'navarre-fl', 'destin-fl', 'milton-fl', 'pace-fl']);
add('missionlawnandlandscapes.com', ['landscaping'], 'https://missionlawnandlandscapes.com/', 'Official site offers landscape design, installation, and maintenance in the existing verified Pensacola-area service communities. Existing irrigation/fence/concrete identity retained.');
add('rcs-electricalservices.com', ['electrical', 'generator-installation'], 'https://www.rcs-electricalservices.com/florida-electrical-services.html', 'Official statewide electrical and generator pages offer residential/commercial electrical work plus generator sales, installation, repair and service in every Florida county; included cities are limited to the active Florida catalog.', ['pensacola-fl', 'gulf-breeze-fl', 'navarre-fl', 'perdido-key-fl', 'tampa-fl', 'destin-fl', 'fort-walton-beach-fl', 'panama-city-beach-fl', 'crestview-fl', 'milton-fl', 'pace-fl', 'tallahassee-fl', 'jacksonville-fl', 'orlando-fl', 'st-petersburg-fl', 'clearwater-fl', 'sarasota-fl', 'fort-myers-fl', 'naples-fl', 'miami-fl', 'fort-lauderdale-fl', 'west-palm-beach-fl', 'grayton-beach-fl', 'panama-city-fl']);
add('mcculloughairconditioning.com', ['generator-installation'], 'https://www.mcculloughairconditioning.com/electrical/generators/', 'Official generator page offers home generator installation and service in Niceville and surrounding verified Emerald Coast service areas. Existing HVAC/plumbing/electrical identity retained.');
add('midcoastlawn.com', ['landscaping'], 'https://midcoastlawn.com/locations/', 'Official locations page offers full-service landscaping in Destin, Fort Walton Beach, Navarre and surrounding Emerald Coast communities. Existing irrigation identity retained.');
add('octopussolutionsllc.com', ['landscaping', 'tree-service', 'concrete', 'irrigation-sprinkler-repair'], 'https://www.octopussolutionsllc.com/areas-served', 'Official service-area and services pages explicitly offer landscaping, tree removal, concrete work, and irrigation across the ten named Gulf Coast communities.', ['pensacola-fl', 'pace-fl', 'milton-fl', 'navarre-fl', 'destin-fl', 'crestview-fl', 'gulf-shores-al', 'orange-beach-al', 'daphne-al', 'fairhope-al']);
add('setradesmen.net', ['plumbing'], 'https://setradesmen.net/locations/baldwin-county/', 'Official locations pages offer complete licensed plumbing throughout the explicitly named Northwest Florida and Baldwin County communities. Existing identity retained.', ['pensacola-fl', 'milton-fl', 'pace-fl', 'gulf-breeze-fl', 'navarre-fl', 'perdido-key-fl', 'foley-al', 'orange-beach-al', 'gulf-shores-al', 'daphne-al', 'fairhope-al']);
add('southlandpoolandlawn.com', ['landscaping'], 'https://southlandpoolandlawn.com/services/', 'Official services page identifies Southland as a full-service landscape company serving the included Emerald Coast communities. Existing pool-service identity retained.', ['destin-fl', 'fort-walton-beach-fl', 'crestview-fl', 'navarre-fl']);
add('wecareheatandair.com', ['hvac', 'plumbing', 'electrical', 'insulation'], 'https://wecareheatandair.com/florida/area-served/', 'Official Florida services and area-served pages offer HVAC, plumbing, electrical, and attic-insulation installation and explicitly name all included Panhandle cities.', ['pensacola-fl', 'gulf-breeze-fl', 'navarre-fl', 'milton-fl', 'pace-fl', 'crestview-fl', 'destin-fl', 'fort-walton-beach-fl', 'panama-city-fl', 'panama-city-beach-fl']);

add('carrollcoastalcontracting.com', ['irrigation-sprinkler-repair'], 'https://www.carrollcoastalcontracting.com/services/landscaping-services', 'Official landscaping page includes professional sprinkler-system installation and repair; official services page explicitly names every included Gulf Coast service community. Existing identity retained.');
add('baytownlawn.com', ['landscaping'], 'https://baytownlawn.com/', 'Official site offers landscape consulting, design, installation, and maintenance and explicitly names the five included Pensacola Bay-area communities.', ['pensacola-fl', 'gulf-breeze-fl', 'navarre-fl', 'pace-fl', 'milton-fl']);
add('ravenenviro.com', ['flooring'], 'https://www.ravenenviro.com/services/kitchen-remodeling/', 'Official standalone kitchen and bathroom remodeling pages include flooring and finishes and the official service-area page covers the included Florida Panhandle communities. Existing identity retained.', ['panama-city-fl', 'panama-city-beach-fl', 'destin-fl', 'fort-walton-beach-fl', 'crestview-fl', 'pensacola-fl', 'milton-fl', 'tallahassee-fl', 'grayton-beach-fl', 'gulf-breeze-fl', 'pace-fl', 'navarre-fl']);
add('xtremefl.com', ['kitchen-bath-remodeling'], 'https://www.xtremefl.com/remodeling', 'Official remodeling page offers remodeling services in Pensacola and Panama City; existing licensed construction identity retained.', ['pensacola-fl', 'panama-city-fl']);
add('paceplumber.com', ['plumbing'], 'https://www.paceplumber.com/services/', 'Official services page offers plumbing throughout the explicitly listed Escambia, Santa Rosa, and Okaloosa County communities.', ['pensacola-fl', 'gulf-breeze-fl', 'navarre-fl', 'perdido-key-fl', 'milton-fl', 'pace-fl', 'crestview-fl', 'destin-fl', 'fort-walton-beach-fl']);
add('veteranhandymanofthegulfcoast.com', ['kitchen-bath-remodeling', 'fence-builders', 'hurricane-shutters-impact-windows'], 'https://veteranhandymanofthegulfcoast.com/', 'Official site offers full renovations, bathroom/kitchen remodeling, fence repair, and hurricane-shutter installation across the five explicitly named active Gulf Coast cities. Existing identity retained.', ['pensacola-fl', 'gulf-breeze-fl', 'navarre-fl', 'pace-fl', 'milton-fl']);
add('30afixology.com', ['painting', 'fence-builders'], 'https://30afixology.com/services/interior-exterior-painting/', 'Official site offers interior/exterior painting plus deck, dock, and fence repair throughout Scenic 30A, explicitly including Grayton Beach. Existing identity retained.', ['grayton-beach-fl']);
add('the30ahandyman.com', ['plumbing', 'fence-builders'], 'https://www.the30ahandyman.com/services', 'Official services page offers toilet and water-fixture plumbing repair plus fence repair throughout 30A, explicitly including Grayton Beach. Existing identity retained.', ['grayton-beach-fl']);
add('lakemartinhomepros.com', ['kitchen-bath-remodeling'], 'https://www.lakemartinhomepros.com/areas/auburn-opelika/', 'Official Auburn service-area page offers kitchen and bath updates and room remodeling. Existing identity retained.', ['auburn-al']);
add('martinmaintenancellc.com', ['electrical', 'plumbing', 'kitchen-bath-remodeling', 'flooring', 'painting', 'hurricane-shutters-impact-windows'], 'https://martinmaintenancellc.com/', 'Official full-service remodeling site offers electrical, plumbing, complete kitchen/bath remodeling, flooring/tile, painting, and impact windows in its explicitly named Destin and Grayton Beach work area.', ['destin-fl', 'grayton-beach-fl']);
add('atozshuttersandrailing.com', ['screen-enclosures-pool-cages'], 'https://www.atozshuttersandrailing.com/hurricane-shutters/', 'Official product page offers custom roller screen panels for patios, porches, and outdoor areas; existing verified Gulf Coast service-area identity retained.');

const garageDoorCities = ['destin-fl', 'fort-walton-beach-fl', 'crestview-fl', 'navarre-fl', 'milton-fl', 'gulf-breeze-fl', 'pace-fl', 'pensacola-fl', 'panama-city-fl', 'panama-city-beach-fl', 'grayton-beach-fl'];
for (const region of garageDoorCities) {
  const city = region.replace(/-(fl|al|ms|ga)$/, '');
  add('locksmithchick.com', ['garage-door-repair'], `https://locksmithchick.com/emergency-garage-door-repair/${city}/`, `Official city page offers 24/7 emergency garage-door repair and explicitly names ${region} as the service area. Existing locksmith identity retained.`, [region]);
}

const existing = new Set(seed.map((listing) => `${normalizedDomain(listing.website)}|${listing.region}|${listing.trade}`));
const seen = new Set(existing);
const additions = [];
for (const candidate of candidates) {
  for (const region of candidate.regions) {
    for (const trade of candidate.trades) {
      const key = `${normalizedDomain(candidate.website)}|${region}|${trade}`;
      if (seen.has(key)) continue;
      seen.add(key);
      additions.push({ domain: normalizedDomain(candidate.website), region, trade, name: candidate.name });
    }
  }
}

const byCity = Object.fromEntries(Object.entries(Object.groupBy(additions, (item) => item.region)).map(([key, value]) => [key, value.length]).sort());
const byTrade = Object.fromEntries(Object.entries(Object.groupBy(additions, (item) => item.trade)).map(([key, value]) => [key, value.length]).sort());
console.log(JSON.stringify({ candidateRecords: candidates.length, newPlacements: additions.length, byCity, byTrade }, null, 2));

if (process.argv.includes('--write')) {
  const existingRecords = new Set(source.map((record) => JSON.stringify(record)));
  const toAppend = candidates.filter((candidate) => !existingRecords.has(JSON.stringify(candidate)));
  if (toAppend.length === 0) process.exit(0);
  const currentText = fs.readFileSync(sourcePath, 'utf8');
  const closingBracket = currentText.trimEnd().lastIndexOf(']');
  if (closingBracket < 0) throw new Error(`Could not locate closing array bracket in ${sourcePath}`);
  const rendered = toAppend
    .map((candidate) => JSON.stringify(candidate, null, 2).split('\n').map((line) => `  ${line}`).join('\n'))
    .join(',\n');
  fs.writeFileSync(sourcePath, `${currentText.trimEnd().slice(0, closingBracket).trimEnd()},\n${rendered}\n]\n`);
}
