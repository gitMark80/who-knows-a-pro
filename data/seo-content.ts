import type { Region, TradeSlug } from './catalog';

type CategoryContent = {
  providers: string;
  scope: string;
  compare: string;
  costFactors: string;
  timelineFactors: string;
  related: readonly TradeSlug[];
};

export type DirectoryFaq = { question: string; answer: string };

export const categoryContent = {
  hvac: { providers: 'HVAC companies', scope: 'heating and cooling service, repair, or installation', compare: 'service availability, equipment experience, and written estimates', costFactors: 'the system type, equipment, access, diagnosis, and project scope', timelineFactors: 'the diagnosis, parts or equipment availability, permitting, and project scope', related: ['plumbing', 'electrical', 'insulation', 'generator-installation', 'appliance-repair'] },
  plumbing: { providers: 'plumbing businesses', scope: 'plumbing repair, maintenance, or installation', compare: 'the requested work, service area, availability, and written estimates', costFactors: 'the fixture or system involved, access, materials, urgency, and project scope', timelineFactors: 'diagnosis, access, parts, permitting, and the extent of the work', related: ['septic-services', 'water-damage-mold-remediation', 'kitchen-bath-remodeling', 'appliance-repair', 'hvac'] },
  'auto-mechanics': { providers: 'auto repair businesses', scope: 'vehicle diagnosis, maintenance, or repair', compare: 'vehicle experience, diagnostics, parts, warranties, and scheduling', costFactors: 'the vehicle, diagnosis, parts, labor, and repair scope', timelineFactors: 'diagnosis, parts availability, repair complexity, and shop scheduling', related: ['towing', 'auto-body-collision', 'window-tinting', 'locksmith'] },
  roofing: { providers: 'roofing businesses', scope: 'roof inspection, repair, or replacement', compare: 'roofing systems, written scopes, warranties, and scheduling', costFactors: 'roof size, materials, access, tear-off needs, and repair scope', timelineFactors: 'weather, materials, permitting, access, and project scope', related: ['gutters', 'water-damage-mold-remediation', 'hurricane-shutters-impact-windows', 'painting', 'insulation'] },
  electrical: { providers: 'electrical businesses', scope: 'electrical repair, upgrade, or installation', compare: 'the requested work, licensing, scheduling, and written estimates', costFactors: 'the electrical system, access, materials, permitting, and project scope', timelineFactors: 'diagnosis, inspections, permitting, materials, and the extent of the work', related: ['generator-installation', 'hvac', 'appliance-repair', 'handyman', 'kitchen-bath-remodeling'] },
  'lawn-care': { providers: 'lawn care businesses', scope: 'routine lawn care or seasonal yard work', compare: 'service frequency, included tasks, service area, and scheduling', costFactors: 'property size, service frequency, condition, access, and requested tasks', timelineFactors: 'property size, weather, service frequency, and the work requested', related: ['landscaping', 'tree-service', 'pressure-washing', 'pest-control', 'concrete'] },
  'pest-control': { providers: 'pest control businesses', scope: 'pest inspection, treatment, or prevention', compare: 'inspection methods, treatment plans, follow-up, and service terms', costFactors: 'the pest, property size, treatment method, severity, and follow-up needs', timelineFactors: 'inspection findings, treatment method, follow-up needs, and property access', related: ['lawn-care', 'house-cleaning', 'water-damage-mold-remediation', 'insulation', 'septic-services'] },
  'house-cleaning': { providers: 'house cleaning businesses', scope: 'recurring, deep, or move-related cleaning', compare: 'included tasks, products, scheduling, and service boundaries', costFactors: 'home size, condition, visit frequency, requested tasks, and add-ons', timelineFactors: 'home size, condition, crew size, access, and requested tasks', related: ['carpet-cleaning', 'pressure-washing', 'junk-removal', 'movers', 'pest-control'] },
  landscaping: { providers: 'landscaping businesses', scope: 'landscape design, installation, or maintenance', compare: 'project scope, plant or material choices, maintenance, and scheduling', costFactors: 'site size, design, materials, access, drainage, and ongoing care', timelineFactors: 'design, materials, weather, access, and project scope', related: ['lawn-care', 'tree-service', 'fence-builders', 'concrete', 'pressure-washing'] },
  'tree-service': { providers: 'tree service businesses', scope: 'tree trimming, assessment, or removal', compare: 'the work plan, equipment, cleanup, insurance, and scheduling', costFactors: 'tree size, condition, access, equipment, disposal, and project risk', timelineFactors: 'site access, equipment, weather, permits, and the number of trees', related: ['landscaping', 'lawn-care', 'junk-removal', 'fence-builders', 'pressure-washing'] },
  'garage-door-repair': { providers: 'garage door businesses', scope: 'garage door repair, maintenance, or installation', compare: 'door and opener experience, parts, warranties, and scheduling', costFactors: 'the door or opener, diagnosis, parts, access, and repair scope', timelineFactors: 'diagnosis, parts availability, door type, and repair complexity', related: ['locksmith', 'handyman', 'electrical', 'appliance-repair'] },
  locksmith: { providers: 'locksmith businesses', scope: 'lock, key, or access-control service', compare: 'service area, identification requirements, availability, and estimates', costFactors: 'the lock or system, service timing, access, parts, and job scope', timelineFactors: 'the lock type, access, parts, travel, and requested work', related: ['garage-door-repair', 'handyman', 'electrical', 'auto-mechanics'] },
  'appliance-repair': { providers: 'appliance repair businesses', scope: 'home appliance diagnosis or repair', compare: 'appliance experience, diagnostic terms, parts, and warranties', costFactors: 'the appliance, diagnosis, parts, access, and repair scope', timelineFactors: 'diagnosis, parts availability, appliance access, and repair complexity', related: ['electrical', 'plumbing', 'hvac', 'handyman', 'garage-door-repair'] },
  movers: { providers: 'moving businesses', scope: 'local, long-distance, or specialty moving help', compare: 'the inventory, service boundaries, insurance options, and written estimates', costFactors: 'distance, inventory, access, crew needs, packing, and scheduling', timelineFactors: 'distance, inventory, access, packing, crew size, and scheduling', related: ['junk-removal', 'house-cleaning', 'handyman', 'carpet-cleaning'] },
  handyman: { providers: 'handyman businesses', scope: 'home repair, installation, or maintenance tasks', compare: 'the task list, experience, materials, scheduling, and estimates', costFactors: 'the number of tasks, materials, access, complexity, and project scope', timelineFactors: 'the task list, materials, access, complexity, and scheduling', related: ['painting', 'kitchen-bath-remodeling', 'flooring', 'appliance-repair', 'electrical'] },
  painting: { providers: 'painting businesses', scope: 'interior or exterior painting', compare: 'surface preparation, products, written scope, and cleanup', costFactors: 'surface area, condition, preparation, coatings, access, and project scope', timelineFactors: 'preparation, drying conditions, weather, access, and project size', related: ['pressure-washing', 'roofing', 'gutters', 'handyman', 'kitchen-bath-remodeling'] },
  'pool-service': { providers: 'pool service businesses', scope: 'pool cleaning, maintenance, or repair', compare: 'included visits, testing, equipment service, and service terms', costFactors: 'pool size, condition, service frequency, equipment, and repair needs', timelineFactors: 'pool condition, diagnosis, parts, weather, and requested work', related: ['pool-installation', 'screen-enclosures-pool-cages', 'landscaping', 'pressure-washing', 'electrical'] },
  'kitchen-bath-remodeling': { providers: 'kitchen and bath remodeling businesses', scope: 'kitchen or bathroom planning and remodeling', compare: 'design scope, materials, trades, permits, and written schedules', costFactors: 'layout, materials, fixtures, structural work, permits, and project scope', timelineFactors: 'design decisions, materials, permits, inspections, and project complexity', related: ['flooring', 'plumbing', 'electrical', 'painting', 'handyman'] },
  flooring: { providers: 'flooring businesses', scope: 'flooring selection, repair, or installation', compare: 'materials, preparation, installation methods, and warranties', costFactors: 'material, square footage, subfloor condition, removal, access, and pattern', timelineFactors: 'material availability, subfloor preparation, removal, curing, and project size', related: ['kitchen-bath-remodeling', 'painting', 'carpet-cleaning', 'handyman', 'concrete'] },
  towing: { providers: 'towing businesses', scope: 'vehicle towing or roadside assistance', compare: 'service area, availability, vehicle limits, and quoted terms', costFactors: 'distance, vehicle type, location, access, timing, and requested service', timelineFactors: 'dispatch availability, traffic, distance, site access, and vehicle condition', related: ['auto-mechanics', 'auto-body-collision', 'locksmith', 'window-tinting'] },
  'auto-body-collision': { providers: 'auto body businesses', scope: 'collision repair, body work, or refinishing', compare: 'repair plans, parts, paint processes, warranties, and scheduling', costFactors: 'damage, parts, materials, vehicle systems, labor, and repair scope', timelineFactors: 'damage assessment, insurance steps, parts, refinishing, and repair complexity', related: ['auto-mechanics', 'towing', 'window-tinting', 'painting'] },
  'fence-builders': { providers: 'fence businesses', scope: 'fence repair or installation', compare: 'materials, property layout, permits, warranties, and written scope', costFactors: 'fence length, materials, terrain, access, removal, and gates', timelineFactors: 'site layout, materials, permitting, weather, and project size', related: ['landscaping', 'concrete', 'tree-service', 'handyman', 'pressure-washing'] },
  'junk-removal': { providers: 'junk removal businesses', scope: 'household, property, or project debris removal', compare: 'accepted items, loading, disposal terms, service area, and scheduling', costFactors: 'volume, weight, item type, access, labor, and disposal requirements', timelineFactors: 'item volume, access, crew size, disposal requirements, and scheduling', related: ['movers', 'house-cleaning', 'tree-service', 'pressure-washing', 'handyman'] },
  'water-damage-mold-remediation': { providers: 'restoration businesses', scope: 'water damage response or mold remediation', compare: 'inspection, containment, drying, documentation, and follow-up', costFactors: 'affected area, materials, moisture conditions, access, testing, and restoration scope', timelineFactors: 'moisture, affected materials, drying, testing, repairs, and project scope', related: ['plumbing', 'roofing', 'house-cleaning', 'carpet-cleaning', 'insulation'] },
  concrete: { providers: 'concrete and driveway businesses', scope: 'concrete repair, driveway, or flatwork projects', compare: 'site preparation, mix and finish, drainage, reinforcement, and written scope', costFactors: 'area, thickness, reinforcement, demolition, access, drainage, and finish', timelineFactors: 'site preparation, weather, forming, placement, curing, and project size', related: ['landscaping', 'fence-builders', 'flooring', 'pressure-washing', 'gutters'] },
  gutters: { providers: 'gutter businesses', scope: 'gutter cleaning, repair, or installation', compare: 'materials, drainage plan, guards, warranties, and written scope', costFactors: 'roofline, stories, materials, access, condition, and drainage needs', timelineFactors: 'measurement, materials, access, weather, and project scope', related: ['roofing', 'pressure-washing', 'water-damage-mold-remediation', 'painting', 'tree-service'] },
  'carpet-cleaning': { providers: 'carpet cleaning businesses', scope: 'carpet, rug, or upholstery cleaning', compare: 'cleaning methods, included areas, drying guidance, and service terms', costFactors: 'area, material, condition, stains, furniture, and requested treatments', timelineFactors: 'area, cleaning method, condition, access, and drying conditions', related: ['house-cleaning', 'water-damage-mold-remediation', 'flooring', 'movers'] },
  'pressure-washing': { providers: 'pressure washing businesses', scope: 'exterior surface cleaning', compare: 'surface methods, cleaning solutions, property protection, and written scope', costFactors: 'surface area, material, condition, access, height, and requested treatment', timelineFactors: 'surface area, condition, access, weather, and drying needs', related: ['painting', 'gutters', 'house-cleaning', 'concrete', 'pool-service'] },
  'septic-services': { providers: 'septic service businesses', scope: 'septic inspection, pumping, repair, or installation', compare: 'system experience, inspection findings, disposal, permits, and estimates', costFactors: 'system type, access, tank condition, excavation, permits, and service scope', timelineFactors: 'inspection findings, access, excavation, permitting, parts, and project scope', related: ['plumbing', 'water-damage-mold-remediation', 'landscaping', 'concrete'] },
  'pool-installation': { providers: 'pool installation businesses', scope: 'new pool design and construction', compare: 'design, materials, equipment, permitting, schedule, and warranties', costFactors: 'pool type, size, site conditions, access, equipment, finishes, and permitting', timelineFactors: 'design, permitting, site work, materials, inspections, weather, and project scope', related: ['pool-service', 'screen-enclosures-pool-cages', 'landscaping', 'concrete', 'electrical'] },
  'window-tinting': { providers: 'window tinting businesses', scope: 'automotive, residential, or commercial window tinting', compare: 'film options, application experience, warranties, and scheduling', costFactors: 'window count and size, film, access, preparation, and application scope', timelineFactors: 'window count, preparation, film availability, application, and curing guidance', related: ['auto-body-collision', 'auto-mechanics', 'hurricane-shutters-impact-windows', 'painting'] },
  'generator-installation': { providers: 'generator businesses', scope: 'standby or portable generator planning and installation', compare: 'sizing, fuel, electrical work, permits, maintenance, and warranties', costFactors: 'capacity, equipment, fuel connection, electrical work, site conditions, and permitting', timelineFactors: 'sizing, equipment availability, site work, utilities, permits, and inspections', related: ['electrical', 'hvac', 'plumbing', 'hurricane-shutters-impact-windows'] },
  insulation: { providers: 'insulation businesses', scope: 'insulation evaluation, removal, or installation', compare: 'materials, target areas, air sealing, preparation, and written scope', costFactors: 'area, material, existing conditions, access, removal, and project scope', timelineFactors: 'inspection, access, removal, material, preparation, and project size', related: ['hvac', 'roofing', 'water-damage-mold-remediation', 'pest-control', 'generator-installation'] },
  'marine-services': { providers: 'marine service businesses', scope: 'boat maintenance, repair, or marine support', compare: 'vessel and system experience, parts, service location, and scheduling', costFactors: 'vessel, system, diagnosis, parts, access, haul-out needs, and repair scope', timelineFactors: 'diagnosis, parts, service location, weather, and repair complexity', related: ['auto-mechanics', 'towing', 'window-tinting', 'electrical', 'generator-installation'] },
  'screen-enclosures-pool-cages': { providers: 'screen enclosure businesses', scope: 'screen enclosure or pool cage repair and installation', compare: 'materials, wind requirements, permits, warranties, and written scope', costFactors: 'size, framing, screen material, access, repairs, and permitting', timelineFactors: 'measurement, materials, permitting, weather, access, and project size', related: ['pool-service', 'pool-installation', 'hurricane-shutters-impact-windows', 'pressure-washing', 'painting'] },
  'hurricane-shutters-impact-windows': { providers: 'storm protection businesses', scope: 'hurricane shutter or impact window planning and installation', compare: 'product approvals, measurements, installation, permits, and warranties', costFactors: 'opening count and size, product, access, installation, and permitting', timelineFactors: 'measurement, product availability, permitting, installation, and inspections', related: ['roofing', 'generator-installation', 'screen-enclosures-pool-cages', 'window-tinting', 'painting'] },
  'trading-card-stores': { providers: 'trading card stores', scope: 'buying, selling, trading, or finding card products', compare: 'inventory, buying or trade policies, events, grading support, and store hours', costFactors: 'the product, condition, scarcity, grading, market demand, and store policy', timelineFactors: 'inventory, authentication or grading, shipping, and store processing', related: ['auto-mechanics', 'auto-body-collision', 'window-tinting', 'marine-services'] },
} as const satisfies Record<TradeSlug, CategoryContent>;

const stateNames: Record<string, string> = {
  AL: 'Alabama', FL: 'Florida', GA: 'Georgia', LA: 'Louisiana', MS: 'Mississippi',
};

const cityOnly = (region: Region) => region.name.replace(/,\s*[A-Z]{2}$/, '');

const regionIntroVariant: Partial<Record<Region['slug'], number>> = {
  'perdido-key-fl': 0, 'pensacola-fl': 1, 'gulf-breeze-fl': 2, 'pace-fl': 3,
  'milton-fl': 0, 'navarre-fl': 1, 'fort-walton-beach-fl': 2, 'destin-fl': 3,
  'crestview-fl': 0, 'panama-city-beach-fl': 1,
  'orange-beach-al': 0, 'gulf-shores-al': 1, 'foley-al': 2, 'fairhope-al': 3,
  'daphne-al': 0, 'mobile-al': 1, 'biloxi-ms': 2, 'gulfport-ms': 3,
  'new-orleans-la': 0, 'baton-rouge-la': 1, 'tallahassee-fl': 2, 'jacksonville-fl': 3,
  'orlando-fl': 0, 'tampa-fl': 1, 'st-petersburg-fl': 2, 'clearwater-fl': 3,
  'sarasota-fl': 0, 'fort-myers-fl': 1, 'naples-fl': 2,
  'miami-fl': 0, 'fort-lauderdale-fl': 1, 'west-palm-beach-fl': 2,
  'birmingham-al': 0, 'montgomery-al': 1, 'huntsville-al': 2, 'atlanta-ga': 3,
};

export function categoryIntro(trade: TradeSlug, region: Region, count: number) {
  const content = categoryContent[trade];
  const city = cityOnly(region);
  const listingText = `${count} ${count === 1 ? 'listed business' : 'listed businesses'}`;
  const variants = [
    `Compare ${listingText} for ${content.scope} in ${region.name}. Review the details each business has provided, then use its official website or phone number to confirm availability. When comparing ${content.providers}, consider ${content.compare}.`,
    `This directory currently includes ${listingText} serving ${region.name}. Use the profiles below to compare available contact details, service areas, hours, and owner-provided specialties. For ${content.scope}, ask each business about ${content.compare}.`,
    `Looking for ${content.scope} in ${city}? Start with the ${listingText} below and contact businesses directly about your project. Profiles show only the information available in the directory, making it easier to compare ${content.compare}.`,
    `${region.name} shoppers can use this page to review ${listingText} for ${content.scope}. Check the available profile details and official website before choosing a provider. Useful comparison points include ${content.compare}.`,
  ];
  const categoryOffset = [...trade].reduce((total, character) => total + character.charCodeAt(0), 0);
  return variants[((regionIntroVariant[region.slug] ?? 0) + categoryOffset) % variants.length];
}

export function categoryFaqs(trade: TradeSlug, region: Region): DirectoryFaq[] {
  const content = categoryContent[trade];
  const city = cityOnly(region);
  const stateName = stateNames[region.state] || region.state;
  const licenseAnswer = region.state === 'FL'
    ? `Requirements depend on the work being performed. Ask the business which license, registration, or professional credential applies, then verify any Florida license at https://www.myfloridalicense.com/. Check the appropriate state or local agency when a service is regulated elsewhere.`
    : `Requirements depend on the work being performed. Ask the business which license, registration, or professional credential applies, then confirm it with the ${stateName} contractor licensing board or the appropriate state or local agency.`;

  return [
    {
      question: `What should I ask ${content.providers} in ${city} before choosing one?`,
      answer: `Describe the work clearly and ask about ${content.compare}. Request the important terms in writing, confirm who will perform the work, and verify insurance or credentials when they apply.`,
    },
    {
      question: `How can I verify licensing or credentials for ${content.scope} in ${region.name}?`,
      answer: licenseAnswer,
    },
    {
      question: `What can affect the cost of ${content.scope} in ${city}?`,
      answer: `Pricing can vary with ${content.costFactors}. Ask each business for a written estimate based on the same project details so you can compare the scope as well as the price.`,
    },
    {
      question: `How long can ${content.scope} take?`,
      answer: `Timing depends on ${content.timelineFactors}. Ask the business for a project-specific schedule and confirm what could change the start or completion date.`,
    },
  ];
}

export function relatedTradeSlugs(trade: TradeSlug) {
  return categoryContent[trade].related;
}
