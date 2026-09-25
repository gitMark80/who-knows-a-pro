import { marineListings } from './marine';

export const regionBatchActive = {
  existing: true,
  batch1: true,
  batch2: false,
} as const;

const regionDefinitions = [
  { slug: 'pensacola-fl', name: 'Pensacola, FL', state: 'FL', batch: 'existing' },
  { slug: 'gulf-breeze-fl', name: 'Gulf Breeze, FL', state: 'FL', batch: 'existing' },
  { slug: 'navarre-fl', name: 'Navarre, FL', state: 'FL', batch: 'existing' },
  { slug: 'perdido-key-fl', name: 'Perdido Key, FL', state: 'FL', batch: 'existing' },
  { slug: 'orange-beach-al', name: 'Orange Beach, AL', state: 'AL', batch: 'existing' },
  { slug: 'mobile-al', name: 'Mobile, AL', state: 'AL', batch: 'existing' },
  { slug: 'tampa-fl', name: 'Tampa, FL', state: 'FL', batch: 'existing' },
  { slug: 'atlanta-ga', name: 'Atlanta, GA', state: 'GA', batch: 'existing' },

  { slug: 'destin-fl', name: 'Destin, FL', state: 'FL', batch: 'batch1' },
  { slug: 'fort-walton-beach-fl', name: 'Fort Walton Beach, FL', state: 'FL', batch: 'batch1' },
  { slug: 'panama-city-beach-fl', name: 'Panama City Beach, FL', state: 'FL', batch: 'batch1' },
  { slug: 'crestview-fl', name: 'Crestview, FL', state: 'FL', batch: 'batch1' },
  { slug: 'milton-fl', name: 'Milton, FL', state: 'FL', batch: 'batch1' },
  { slug: 'pace-fl', name: 'Pace, FL', state: 'FL', batch: 'batch1' },
  { slug: 'gulf-shores-al', name: 'Gulf Shores, AL', state: 'AL', batch: 'batch1' },
  { slug: 'foley-al', name: 'Foley, AL', state: 'AL', batch: 'batch1' },
  { slug: 'fairhope-al', name: 'Fairhope, AL', state: 'AL', batch: 'batch1' },
  { slug: 'daphne-al', name: 'Daphne, AL', state: 'AL', batch: 'batch1' },
  { slug: 'biloxi-ms', name: 'Biloxi, MS', state: 'MS', batch: 'batch1' },
  { slug: 'gulfport-ms', name: 'Gulfport, MS', state: 'MS', batch: 'batch1' },
  { slug: 'new-orleans-la', name: 'New Orleans, LA', state: 'LA', batch: 'batch1' },
  { slug: 'baton-rouge-la', name: 'Baton Rouge, LA', state: 'LA', batch: 'batch1' },
  { slug: 'tallahassee-fl', name: 'Tallahassee, FL', state: 'FL', batch: 'batch1' },
  { slug: 'jacksonville-fl', name: 'Jacksonville, FL', state: 'FL', batch: 'batch1' },
  { slug: 'orlando-fl', name: 'Orlando, FL', state: 'FL', batch: 'batch1' },
  { slug: 'st-petersburg-fl', name: 'St. Petersburg, FL', state: 'FL', batch: 'batch1' },
  { slug: 'clearwater-fl', name: 'Clearwater, FL', state: 'FL', batch: 'batch1' },
  { slug: 'sarasota-fl', name: 'Sarasota, FL', state: 'FL', batch: 'batch1' },
  { slug: 'fort-myers-fl', name: 'Fort Myers, FL', state: 'FL', batch: 'batch1' },
  { slug: 'naples-fl', name: 'Naples, FL', state: 'FL', batch: 'batch1' },
  { slug: 'miami-fl', name: 'Miami, FL', state: 'FL', batch: 'batch1' },
  { slug: 'fort-lauderdale-fl', name: 'Fort Lauderdale, FL', state: 'FL', batch: 'batch1' },
  { slug: 'west-palm-beach-fl', name: 'West Palm Beach, FL', state: 'FL', batch: 'batch1' },
  { slug: 'birmingham-al', name: 'Birmingham, AL', state: 'AL', batch: 'batch1' },
  { slug: 'montgomery-al', name: 'Montgomery, AL', state: 'AL', batch: 'batch1' },
  { slug: 'huntsville-al', name: 'Huntsville, AL', state: 'AL', batch: 'batch1' },

  { slug: 'new-york-ny', name: 'New York, NY', state: 'NY', batch: 'batch2' },
  { slug: 'los-angeles-ca', name: 'Los Angeles, CA', state: 'CA', batch: 'batch2' },
  { slug: 'chicago-il', name: 'Chicago, IL', state: 'IL', batch: 'batch2' },
  { slug: 'dallas-tx', name: 'Dallas, TX', state: 'TX', batch: 'batch2' },
  { slug: 'houston-tx', name: 'Houston, TX', state: 'TX', batch: 'batch2' },
  { slug: 'washington-dc', name: 'Washington, DC', state: 'DC', batch: 'batch2' },
  { slug: 'philadelphia-pa', name: 'Philadelphia, PA', state: 'PA', batch: 'batch2' },
  { slug: 'phoenix-az', name: 'Phoenix, AZ', state: 'AZ', batch: 'batch2' },
  { slug: 'boston-ma', name: 'Boston, MA', state: 'MA', batch: 'batch2' },
  { slug: 'san-francisco-ca', name: 'San Francisco, CA', state: 'CA', batch: 'batch2' },
  { slug: 'riverside-ca', name: 'Riverside, CA', state: 'CA', batch: 'batch2' },
  { slug: 'detroit-mi', name: 'Detroit, MI', state: 'MI', batch: 'batch2' },
  { slug: 'seattle-wa', name: 'Seattle, WA', state: 'WA', batch: 'batch2' },
  { slug: 'minneapolis-mn', name: 'Minneapolis, MN', state: 'MN', batch: 'batch2' },
  { slug: 'san-diego-ca', name: 'San Diego, CA', state: 'CA', batch: 'batch2' },
  { slug: 'denver-co', name: 'Denver, CO', state: 'CO', batch: 'batch2' },
  { slug: 'baltimore-md', name: 'Baltimore, MD', state: 'MD', batch: 'batch2' },
  { slug: 'st-louis-mo', name: 'St. Louis, MO', state: 'MO', batch: 'batch2' },
  { slug: 'charlotte-nc', name: 'Charlotte, NC', state: 'NC', batch: 'batch2' },
  { slug: 'san-antonio-tx', name: 'San Antonio, TX', state: 'TX', batch: 'batch2' },
  { slug: 'austin-tx', name: 'Austin, TX', state: 'TX', batch: 'batch2' },
  { slug: 'portland-or', name: 'Portland, OR', state: 'OR', batch: 'batch2' },
  { slug: 'sacramento-ca', name: 'Sacramento, CA', state: 'CA', batch: 'batch2' },
  { slug: 'las-vegas-nv', name: 'Las Vegas, NV', state: 'NV', batch: 'batch2' },
  { slug: 'pittsburgh-pa', name: 'Pittsburgh, PA', state: 'PA', batch: 'batch2' },
  { slug: 'cincinnati-oh', name: 'Cincinnati, OH', state: 'OH', batch: 'batch2' },
  { slug: 'kansas-city-mo', name: 'Kansas City, MO', state: 'MO', batch: 'batch2' },
  { slug: 'columbus-oh', name: 'Columbus, OH', state: 'OH', batch: 'batch2' },
  { slug: 'indianapolis-in', name: 'Indianapolis, IN', state: 'IN', batch: 'batch2' },
  { slug: 'cleveland-oh', name: 'Cleveland, OH', state: 'OH', batch: 'batch2' },
  { slug: 'nashville-tn', name: 'Nashville, TN', state: 'TN', batch: 'batch2' },
  { slug: 'virginia-beach-va', name: 'Virginia Beach, VA', state: 'VA', batch: 'batch2' },
  { slug: 'raleigh-nc', name: 'Raleigh, NC', state: 'NC', batch: 'batch2' },
  { slug: 'milwaukee-wi', name: 'Milwaukee, WI', state: 'WI', batch: 'batch2' },
  { slug: 'oklahoma-city-ok', name: 'Oklahoma City, OK', state: 'OK', batch: 'batch2' },
  { slug: 'memphis-tn', name: 'Memphis, TN', state: 'TN', batch: 'batch2' },
  { slug: 'louisville-ky', name: 'Louisville, KY', state: 'KY', batch: 'batch2' },
  { slug: 'richmond-va', name: 'Richmond, VA', state: 'VA', batch: 'batch2' },
  { slug: 'salt-lake-city-ut', name: 'Salt Lake City, UT', state: 'UT', batch: 'batch2' },
  { slug: 'providence-ri', name: 'Providence, RI', state: 'RI', batch: 'batch2' },
] as const;

export type RegionSlug = (typeof regionDefinitions)[number]['slug'];
export type RegionBatch = keyof typeof regionBatchActive;
export type Region = (typeof regionDefinitions)[number] & { active: boolean };

export const regions: readonly Region[] = regionDefinitions.map((region) => ({
  ...region,
  active: regionBatchActive[region.batch],
}));

export const activeRegions = regions.filter((region) => region.active);

export const activeRegionGroups = Array.from(
  activeRegions.reduce((groups, region) => {
    const stateRegions = groups.get(region.state) ?? [];
    stateRegions.push(region);
    groups.set(region.state, stateRegions);
    return groups;
  }, new Map<string, Region[]>()),
  ([state, stateRegions]) => ({ state, regions: stateRegions }),
);

export const trades = [
  { slug: 'hvac', name: 'HVAC' },
  { slug: 'plumbing', name: 'Plumbing' },
  { slug: 'auto-mechanics', name: 'Auto mechanics' },
  { slug: 'roofing', name: 'Roofing' },
  { slug: 'electrical', name: 'Electrical' },
  { slug: 'lawn-care', name: 'Lawn care' },
  { slug: 'pest-control', name: 'Pest control' },
  { slug: 'house-cleaning', name: 'House cleaning' },
  { slug: 'landscaping', name: 'Landscaping' },
  { slug: 'tree-service', name: 'Tree service' },
  { slug: 'garage-door-repair', name: 'Garage door repair' },
  { slug: 'locksmith', name: 'Locksmith' },
  { slug: 'appliance-repair', name: 'Appliance repair' },
  { slug: 'movers', name: 'Movers' },
  { slug: 'handyman', name: 'Handyman' },
  { slug: 'painting', name: 'Painting' },
  { slug: 'pool-service', name: 'Pool service' },
  { slug: 'kitchen-bath-remodeling', name: 'Kitchen & bath remodeling' },
  { slug: 'flooring', name: 'Flooring' },
  { slug: 'towing', name: 'Towing' },
  { slug: 'auto-body-collision', name: 'Auto body & collision' },
  { slug: 'fence-builders', name: 'Fence builders' },
  { slug: 'junk-removal', name: 'Junk removal' },
  { slug: 'water-damage-mold-remediation', name: 'Water damage & mold remediation' },
  { slug: 'concrete', name: 'Concrete & driveways' },
  { slug: 'gutters', name: 'Gutters' },
  { slug: 'carpet-cleaning', name: 'Carpet cleaning' },
  { slug: 'pressure-washing', name: 'Pressure washing' },
  { slug: 'septic-services', name: 'Septic services' },
  { slug: 'pool-installation', name: 'Pool installation' },
  { slug: 'window-tinting', name: 'Window tinting' },
  { slug: 'generator-installation', name: 'Generator installation' },
  { slug: 'insulation', name: 'Insulation' },
  { slug: 'marine-services', name: 'Marine services' },
  { slug: 'screen-enclosures-pool-cages', name: 'Screen enclosures & pool cages' },
  { slug: 'hurricane-shutters-impact-windows', name: 'Hurricane shutters & impact windows' },
  { slug: 'trading-card-stores', name: 'Trading card stores' },
] as const;

export type TradeSlug = (typeof trades)[number]['slug'];

export const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const marineSeed = marineListings.map((item) => ({
  id: `marine-${item.id}`,
  name: item.name,
  slug: `${slug(item.name)}-${item.id}`,
  region: item.location.includes('Orange Beach') ? 'orange-beach-al' : 'pensacola-fl',
  trade: 'marine-services',
  location: item.location,
  summary: item.summary,
  website: item.website,
}));
