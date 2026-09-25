import { activeRegions, type RegionSlug } from './catalog';

const neighborhoodGroups: readonly (readonly RegionSlug[])[] = [
  ['perdido-key-fl', 'pensacola-fl', 'gulf-breeze-fl', 'pace-fl', 'milton-fl', 'navarre-fl', 'fort-walton-beach-fl', 'destin-fl', 'crestview-fl', 'panama-city-beach-fl'],
  ['orange-beach-al', 'gulf-shores-al', 'foley-al', 'fairhope-al', 'daphne-al', 'mobile-al'],
  ['biloxi-ms', 'gulfport-ms'],
  ['new-orleans-la', 'baton-rouge-la'],
  ['tallahassee-fl', 'jacksonville-fl'],
  ['orlando-fl', 'tampa-fl', 'st-petersburg-fl', 'clearwater-fl'],
  ['sarasota-fl', 'fort-myers-fl', 'naples-fl'],
  ['miami-fl', 'fort-lauderdale-fl', 'west-palm-beach-fl'],
  ['birmingham-al', 'montgomery-al', 'huntsville-al'],
  ['atlanta-ga', 'birmingham-al', 'huntsville-al', 'montgomery-al', 'tallahassee-fl', 'jacksonville-fl'],
];

export function nearbyRegionSlugs(regionSlug: RegionSlug, limit = 6) {
  const region = activeRegions.find((item) => item.slug === regionSlug);
  if (!region) return [];
  const neighborhood = neighborhoodGroups.find((group) => group.includes(regionSlug)) ?? [];
  const currentIndex = neighborhood.indexOf(regionSlug);
  const nearestFirst = neighborhood
    .filter((slug) => slug !== regionSlug)
    .sort((left, right) => Math.abs(neighborhood.indexOf(left) - currentIndex) - Math.abs(neighborhood.indexOf(right) - currentIndex));
  const candidates = [
    ...nearestFirst,
    ...activeRegions.filter((item) => item.state === region.state).map((item) => item.slug),
  ];
  return [...new Set(candidates)].filter((slug) => slug !== regionSlug).slice(0, limit);
}
