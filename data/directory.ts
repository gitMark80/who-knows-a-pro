import { activeRegions, regions, slug, trades, type RegionSlug } from './catalog';
import { expandedProviders } from './expanded-directory';
import { newCategoryProviders } from './new-category-providers';
import verifiedActiveProvidersData from './verified-active-providers.json';
import { DIRECTORY_SOURCE, DIRECTORY_VERIFIED_AT } from './directory-config';

type TradeSlug = (typeof trades)[number]['slug'];
type Cluster = 'pensacola' | 'alabama' | 'tampa' | 'atlanta';
type Provider = { name: string; website: string; seedKey?: string };
type VerifiedProvider = Provider & { regions: readonly RegionSlug[]; trades: readonly TradeSlug[] };

const clusterRegions: Record<Cluster, readonly RegionSlug[]> = {
  pensacola: ['pensacola-fl', 'gulf-breeze-fl', 'navarre-fl', 'perdido-key-fl'],
  alabama: ['orange-beach-al', 'mobile-al'],
  tampa: ['tampa-fl'],
  atlanta: ['atlanta-ga'],
};

const baseProviders: Record<Cluster, Partial<Record<TradeSlug, readonly Provider[]>>> = {
  pensacola: {
    'marine-services': [
      { name: 'Revolutions Marine', website: 'https://revolutionsmarinegulfcoast.com/' },
      { name: 'Gambill Marine Services', website: 'https://www.gambillmarineservices.com/' },
      { name: 'Gulf Breeze Marine', website: 'https://gulfbreezemarine.com/' },
      { name: 'Breeze Mobile Marine', website: 'https://www.breezemobilemarine.com/' },
    ],
    'fence-builders': [
      { name: 'Pensacola Roofing & Fencing', website: 'https://www.pensacolaroofing.org/fencing' },
      { name: 'Gulf Built Fence & Solutions', website: 'https://www.gulfbuiltsolutions.com/' },
      { name: 'Pensacola Fence Builders', website: 'https://pensacolafencebuilders.com/' },
      { name: 'Fence and Outdoor Services', website: 'https://www.kdfenceservices.com/' },
    ],
    landscaping: [
      { name: 'Breeze Lawns', website: 'https://www.breezelawns.com/' },
      { name: "Stevison's Landscaping", website: 'https://www.stevisonslandscaping.com/' },
      { name: 'Coastal Lawn & Landscaping', website: 'https://www.coastallawnandlandscaping.com/' },
      { name: 'Down to Earth Lawn Services', website: 'https://dtelawnservices.com/' },
    ],
    'pool-installation': [
      { name: 'Gulf Coast Pool & Spa', website: 'https://www.gulfcoastpoolandspa.com/' },
      { name: "Vaughn's Pools", website: 'https://www.vaughnspools.com/' },
      { name: 'Johnson Pools', website: 'https://www.johnsonpoolsinc.com/' },
      { name: "Fagan's Custom Pools", website: 'https://www.faganscustompools.com/' },
    ],
    'pool-service': [
      { name: 'Gulf Coast Pool & Spa', website: 'https://www.gulfcoastpoolandspa.com/' },
      { name: 'Peacock Pool Service', website: 'https://www.peacockpoolservices.com/' },
      { name: 'Pool Scouts of Pensacola', website: 'https://poolscouts.com/pensacola/' },
      { name: 'Leisure Time Pool Care', website: 'https://www.leisuretimepoolcare.com/' },
    ],
    'window-tinting': [
      { name: 'Perform X Window Tinting', website: 'https://www.performxwindowtinting.com/' },
      { name: 'Trent Tints', website: 'https://trenttints.com/' },
      { name: 'Elite Window Tinting', website: 'https://tintnavarre.com/' },
      { name: 'Glass Wrap', website: 'https://www.glasswrap.com/automotive/' },
    ],
    hvac: [
      { name: 'Pensacola Heating & Air', website: 'https://pensacolaheatingandair.com/' },
      { name: 'Air & Energy of Northwest Florida', website: 'https://www.airandenergynwfl.com/' },
      { name: 'Perdido Heating & Air', website: 'https://www.perdidoheatingandair.com/' },
      { name: 'Panhandle Heating & Air', website: 'https://www.panhandleheatingandair.com/' },
    ],
    'auto-mechanics': [
      { name: 'Pensacola A/C & Auto Service Center', website: 'https://www.pensacolaautosc.com/' },
      { name: 'Garage 850', website: 'https://www.garage850.com/' },
      { name: 'Gulf Breeze Automotive', website: 'https://gulfbreezeautomotive.com/' },
      { name: 'Key Auto Hospital', website: 'https://keyautohospital.com/' },
    ],
    'kitchen-bath-remodeling': [
      { name: "Boone's Kitchen, Bath & Patio", website: 'https://www.booneskbp.com/' },
      { name: 'CKD Remodeling', website: 'https://www.ckdremodeling.com/' },
      { name: 'Makeover Kitchen & Bath', website: 'https://www.makeoverkitchenbath.com/' },
      { name: 'Breeze Maintenance & Construction', website: 'https://breezemaintenancellc.com/' },
    ],
    handyman: [
      { name: 'HandyChief', website: 'https://handychief.com/' },
      { name: 'Brooking Handyman', website: 'https://brookinghandyman.com/' },
      { name: 'HomeStack Services', website: 'https://www.homestackservices.com/' },
      { name: 'Sun Coast General Property Services', website: 'https://suncoastgeneralpropertyservice.com/' },
    ],
    'tree-service': [
      { name: 'Gulf Coast Tree & Land', website: 'https://www.gulfcoasttreeandland.com/' },
      { name: 'Navarre Tree Service', website: 'https://navarretreeservice.org/' },
      { name: "Dempsey's Tree & Land", website: 'https://www.dempseystreeandland.com/' },
      { name: 'Down N Out Services', website: 'https://www.downnoutservices.com/' },
    ],
    concrete: [
      { name: 'Gulf Breeze Concrete Services', website: 'https://www.gulfbreezeconcreteservices.com/' },
      { name: 'Concrete EFX', website: 'https://www.pfcwest.com/' },
      { name: 'Navarre Concrete Pro', website: 'https://navarreconcretepro.com/' },
      { name: 'Jones & Sons Concrete', website: 'https://www.westpensacolaconcretecontractor.com/' },
    ],
    insulation: [
      { name: 'Prestige Insulation Solutions', website: 'https://prestigeinsulationsolutions.com/' },
      { name: 'SealTight Foam', website: 'https://www.sealtightfoam.com/' },
      { name: 'Panhandle Heating & Air', website: 'https://www.panhandleheatingandair.com/' },
      { name: 'Climatech', website: 'https://climatechproair.com/' },
    ],
    'pest-control': [
      { name: 'Navarre Pest Control', website: 'https://www.navarrepestcontrol.com/' },
      { name: 'Breeze Pest Control', website: 'https://breezepestcontrol.co/' },
      { name: 'Procare Pest Control', website: 'https://procarepestcontrol.com/' },
      { name: 'Bug Out Service', website: 'https://www.bugoutwf.com/' },
    ],
  },
  alabama: {
    'marine-services': [
      { name: 'Jones Marine Service', website: 'https://www.jonesmarineservice.com/' },
      { name: 'Advanced Marine & Power', website: 'https://www.advancedmarineandpower.com/' },
      { name: 'Exodus Marine Services', website: 'https://www.exodusmarineservices.com/' },
      { name: 'Barber Marina', website: 'https://www.barbermarina.com/' },
    ],
    'fence-builders': [
      { name: 'Mobile Fence', website: 'https://www.mobilefenceco.com/' },
      { name: 'Mobile Fence Pros', website: 'https://mobilefencepros.com/' },
      { name: 'Mitchell Fence', website: 'https://www.mitchellfence.com/' },
      { name: 'Axiom South', website: 'https://axiom-south.com/' },
    ],
    landscaping: [
      { name: 'DC Lawn & Landscape', website: 'https://www.dc-lawn.com/' },
      { name: 'Exterior Design Landscaping', website: 'https://myexteriordesignlandscaping.com/' },
      { name: 'Krob Landscape', website: 'https://www.kroblandscape.com/' },
      { name: 'MCL Landscaping', website: 'https://www.mcllandscaping.com/' },
    ],
    'pool-installation': [
      { name: 'Gulf Coast Pool Guys', website: 'https://www.gulfcoastpoolguys.com/' },
      { name: 'Poolmaster Services', website: 'https://www.poolmasterservicesinc.com/' },
      { name: 'Pools and Paradise', website: 'https://poolsandparadise.net/' },
      { name: 'Cox Pools', website: 'https://www.coxpoolsse.com/' },
    ],
    'pool-service': [
      { name: 'Alabama Poolworks', website: 'https://www.alabamapoolworks.com/' },
      { name: "O'Neals Pool Service", website: 'https://www.onealspool.com/' },
      { name: 'Complete Pool Care', website: 'https://www.ourpoolsource.com/' },
      { name: 'ASP Mobile', website: 'https://www.asppoolco.com/mobile/' },
    ],
    'window-tinting': [
      { name: 'LUX Customs', website: 'https://luxcustomsob.com/' },
      { name: 'Ramsey Auto Pros', website: 'https://ramseyautopros.com/window-tinting/' },
      { name: 'TwinTinting', website: 'https://www.twintinting.com/' },
      { name: 'Gulf Coast Tinting', website: 'https://gctint.com/' },
    ],
    hvac: [
      { name: 'Williamson Air Conditioning', website: 'https://www.williamsonair.com/' },
      { name: 'Keith Air', website: 'https://www.keithair.com/' },
      { name: 'Air Plus', website: 'https://www.airplusalabama.com/' },
      { name: 'Magnolia Air Solutions', website: 'https://www.magnoliaairsolutions.com/' },
    ],
    'auto-mechanics': [
      { name: 'Platinum Oil & Tire Plus', website: 'https://platinumoilandtireplus.com/' },
      { name: 'Elite Mobile Mechanic', website: 'https://www.elitemobilems.com/' },
      { name: 'Orange Beach Auto & Marine', website: 'https://orangebeachautomarine.com/' },
      { name: 'F&D Autocare', website: 'https://www.fanddautocare.com/' },
    ],
    'kitchen-bath-remodeling': [
      { name: 'Coast Design Kitchen & Bath', website: 'https://kitchensbycoastdesign.com/' },
      { name: 'Kitchen & Bath Center', website: 'https://www.kitchenandbathcenter.net/' },
      { name: 'Gulf Coast Home Remodel & Repair', website: 'https://www.homeremodelingorangebeachal.com/' },
      { name: 'Integrity Remodeling & Construction', website: 'https://www.builditwithintegrity.com/' },
    ],
    handyman: [
      { name: 'Orange Beach Handyman', website: 'https://orangebeachhandyman.com/' },
      { name: 'S&L Contractors', website: 'https://www.slcontractorsofal.com/' },
      { name: 'Ace Handyman Services South Baldwin County', website: 'https://www.acehandymanservices.com/offices/south-baldwin-county/' },
      { name: 'Gulf Coast Installations', website: 'https://www.gulfcoast-installs.com/' },
    ],
    'tree-service': [
      { name: 'Mobile Tree Service', website: 'https://treeservicemobile.com/' },
      { name: 'Spanish Fort Trees', website: 'https://www.spanishforttrees.com/' },
      { name: 'Next Step Tree Service', website: 'https://nextsteptreeservice.com/' },
      { name: 'Battiste Tree Service', website: 'https://www.battistetree.com/' },
    ],
    concrete: [
      { name: 'Mobile Concrete Pros', website: 'https://www.concrete-mobileal.com/' },
      { name: 'Concrete Contractors of Mobile', website: 'https://concretecontractorsmobileal.com/' },
      { name: 'Easy Pour Concrete', website: 'https://easypourconcrete.com/' },
      { name: 'Mobile Concrete Contractors', website: 'https://mobileconcretecontractors.com/' },
    ],
    insulation: [
      { name: 'SealTight Foam', website: 'https://www.sealtightfoam.com/' },
      { name: 'Gulf Coast Spray Foam', website: 'https://gcinsulation.com/' },
      { name: 'Eco Three', website: 'https://www.eco-three.com/' },
      { name: 'Insul8', website: 'https://insul8al.com/' },
    ],
    'pest-control': [
      { name: 'Orkin Mobile', website: 'https://www.orkin.com/locations/branch-908' },
      { name: 'Advanced Pest Control of Alabama', website: 'https://pestcontrolalabama.com/' },
      { name: 'Prewett Pest Control', website: 'https://www.prewettpestcontrol.com/' },
      { name: "Beebe's Pest & Termite Control", website: 'https://www.beebespest.com/' },
    ],
  },
  tampa: {
    'marine-services': [
      { name: 'Boat Services', website: 'https://boatservices.us/' },
      { name: 'Perfection Marine Services', website: 'https://perfectionmarineservices.com/' },
      { name: 'Riverside Marine Tampa', website: 'https://www.riversidetampa.com/' },
      { name: 'Westshore Marine', website: 'https://www.westshore-marine.com/' },
    ],
    'fence-builders': [
      { name: 'Tampa Fence Contractors', website: 'https://tampafencecontractors.com/' },
      { name: 'Florida Fence of Tampa', website: 'https://www.floridafence.com/' },
      { name: 'Tampa Fence Professional', website: 'https://www.tampafenceprofessional.com/' },
      { name: 'FloriFence', website: 'https://florifence.com/' },
    ],
    landscaping: [
      { name: 'Tampa Turf Services', website: 'https://www.tampaturfservices.com/' },
      { name: 'Palm & Paver', website: 'https://www.palmandpaver.com/' },
      { name: 'By Design Landscape Tampa', website: 'https://bydesignlandscapetampa.com/' },
      { name: 'Soho Landscape', website: 'https://www.soholandscape.com/' },
    ],
    'pool-installation': [
      { name: 'Guimar Pools', website: 'https://www.guimarpools.com/' },
      { name: 'Patio Pools', website: 'https://patiopools.com/' },
      { name: 'Real Pools', website: 'https://www.realpools.com/' },
      { name: 'Gulfstream Pools & Spas', website: 'https://www.gulfstreampools.com/' },
    ],
    'pool-service': [
      { name: 'ASP Tampa', website: 'https://www.asppoolco.com/tampa/' },
      { name: 'AquaSentry Tampa', website: 'https://www.aquasentrytampa.com/' },
      { name: 'Positive Pool Service', website: 'https://www.positivepoolservices.com/' },
      { name: 'Tampa Pool Services', website: 'https://tampapoolservicesinc.com/' },
    ],
    'window-tinting': [
      { name: 'Official Window Tinting', website: 'https://www.officialwindowtinting.com/' },
      { name: "Leo's Touch", website: 'https://www.leostouchwindowtinting.com/' },
      { name: 'Sun Stop of Tampa', website: 'https://www.sunstopoftampa.com/' },
      { name: 'Orange Tint & More', website: 'https://www.orangetintandmore.com/' },
    ],
    hvac: [
      { name: 'Sunstate Mechanical', website: 'https://www.hvacrepairtampa.com/' },
      { name: 'Caldeco', website: 'https://caldeco.net/' },
      { name: 'FL HVAC Team', website: 'https://www.flhvacteam.com/' },
      { name: 'Britton Air', website: 'https://www.brittonair.com/' },
    ],
    'auto-mechanics': [
      { name: 'AutoWorks of Tampa', website: 'https://autoworksoftampa.com/' },
      { name: 'Brazzeal Automotive', website: 'https://www.brazzealauto.com/' },
      { name: "Paul's Auto & Collision", website: 'https://autorepairtampabay.com/' },
      { name: 'Auto Rx of Tampa', website: 'https://www.autorxoftampa.com/' },
    ],
    'kitchen-bath-remodeling': [
      { name: 'Kitchen & Bath Designers Tampa', website: 'https://kitchenbathtampa.com/' },
      { name: 'Bath & Kitchen Gallery', website: 'https://www.tampakitchenandbath.com/' },
      { name: 'PROCRAFT', website: 'https://www.procraftkitchenandbathroom.com/' },
      { name: 'CMK Construction', website: 'https://www.cmkconstructioninc.com/' },
    ],
    handyman: [
      { name: 'Fix Tampa', website: 'https://www.fixtampa.com/' },
      { name: 'Tampa Works Handyman', website: 'https://tampaworkshandyman.com/' },
      { name: 'Tampa Bay Handyman Services', website: 'https://tampabayhandymanservices.com/' },
      { name: 'The Handyman Company Tampa', website: 'https://the-handyman-company.com/locations/tampa' },
    ],
    'tree-service': [
      { name: 'Bayshore Tree Service', website: 'https://www.bayshoretree.com/' },
      { name: "Pete & Ron's Tree Service", website: 'https://www.prtree.com/' },
      { name: 'Mid-Florida Tree Service', website: 'https://www.midfloridatreeservice.com/' },
      { name: 'Panorama Tree Care', website: 'https://www.panoramatreeservice.com/' },
    ],
    concrete: [
      { name: 'Tampa Concrete Contractors', website: 'https://tampaconcretecontractors.com/' },
      { name: 'Tampa Concrete & Construction', website: 'https://www.tampaconcreteconstruction.com/' },
      { name: 'Perkins Concrete', website: 'https://www.perkinsconcrete.com/' },
      { name: 'Concrete Driveway Co. Tampa', website: 'https://www.concretedriveway.com/service-area/tampa-fl' },
    ],
    insulation: [
      { name: 'IBP Tampa', website: 'https://www.ibptampa.com/' },
      { name: 'CQ Insulation', website: 'https://www.cqinsulation.com/' },
      { name: 'VR Insulation', website: 'https://www.vrinsulation.us/' },
      { name: 'Tampa Blown-In Insulation', website: 'https://www.tampablownininsulation.com/' },
    ],
    'pest-control': [
      { name: 'Truly Nolen Tampa', website: 'https://locations.trulynolen.com/fl/tampa/tampa-094.html' },
      { name: 'Tampa Pest Control Co.', website: 'https://tampapestco.com/' },
      { name: 'Best Termite & Pest Control', website: 'https://www.bestpestmanagement.com/' },
      { name: 'Arrow Environmental Services', website: 'https://www.arrowservices.com/' },
    ],
  },
  atlanta: {
    'marine-services': [
      { name: 'Atlanta Marine', website: 'https://www.atlantamarine.com/boat-repair-atlanta-ga' },
      { name: 'Boating Atlanta', website: 'https://www.boatingatlanta.net/service-repair-boats-dealership--service' },
      { name: 'The Boat Shop', website: 'https://theboatshops.com/schedule-service/' },
      { name: 'Atomic Marine & Machine', website: 'https://www.atomicmarineandmachine.com/' },
    ],
    'fence-builders': [
      { name: 'Atlanta Fence Company', website: 'https://www.atlantafencecompany.com/' },
      { name: 'FenceWorks of Georgia', website: 'https://www.fenceworksofga.com/' },
      { name: 'Superior Fence & Rail of Atlanta', website: 'https://fencebuilderatlanta.com/' },
      { name: 'Alpha Fence & Contracting', website: 'https://alphafenceatl.com/' },
    ],
    landscaping: [
      { name: 'Atlanta Turf & Tree', website: 'https://atlturf.com/' },
      { name: 'Gardens to Love', website: 'https://www.gardenstolove.com/' },
      { name: 'Gibbs Landscape', website: 'https://gibbslandscape.com/' },
      { name: 'Naturescapes', website: 'https://nscapes.com/' },
    ],
    'pool-installation': [
      { name: 'Atlantis Pools', website: 'https://atlantispoolsga.com/' },
      { name: 'Premier Pool Enterprises', website: 'https://www.premierpoolenterprises.com/' },
      { name: 'Sunbelt Pools of Georgia', website: 'https://sunbeltpoolsofgeorgia.com/' },
      { name: 'Custom Pools of Atlanta', website: 'https://www.custompoolsofatlanta.com/' },
    ],
    'pool-service': [
      { name: 'Paces Pool Service', website: 'https://www.pacespoolservice.com/' },
      { name: 'Pinnacle Pools', website: 'https://www.pinnaclepoolservices.com/' },
      { name: 'ASP Atlanta', website: 'https://www.asppoolco.com/atlanta/' },
      { name: 'SwimTech', website: 'https://swimtech.com/' },
    ],
    'window-tinting': [
      { name: 'Tint Atlanta', website: 'https://tintatlanta.com/' },
      { name: 'UHS Window Tinting and Blinds', website: 'https://windowtintingatlanta.com/' },
      { name: 'Jenkins Pro Window Tinting', website: 'https://www.jenkinsprowindowtinting.com/' },
      { name: 'Southern Sun Control', website: 'https://www.southernsuncontrol.com/' },
    ],
    hvac: [
      { name: 'Anchor Heating & Air', website: 'https://anchorac.com/' },
      { name: 'The AIR Company of Georgia', website: 'https://www.theaircompanyga.com/' },
      { name: 'PV Heating, Cooling & Plumbing', website: 'https://www.pvhvac.com/' },
      { name: 'Cunningham Associates Heating & Air', website: 'https://www.cunninghamhvac.com/' },
    ],
    'auto-mechanics': [
      { name: 'Automotive Service & Repair', website: 'https://asratlanta.com/' },
      { name: 'Anthem Automotive', website: 'https://www.anthemauto.com/' },
      { name: 'Professional Auto Repair', website: 'https://www.atlautorepair.com/' },
      { name: 'Motor City South', website: 'https://www.motorcitysouth.com/' },
    ],
    'kitchen-bath-remodeling': [
      { name: 'Bath & Kitchen Galleria', website: 'https://bathandkitchengalleria.com/' },
      { name: 'Dwell Remodeling', website: 'https://www.dwellremodeling.com/' },
      { name: 'Nuova Cabinets', website: 'https://www.nuovacabinets.com/' },
      { name: 'CSI Kitchen & Bath Studio', website: 'https://www.csikitchenandbath.com/' },
    ],
    handyman: [
      { name: 'Atlanta Handyman Service', website: 'https://theatlhandyman.com/' },
      { name: 'Atlanta Best Handyman', website: 'https://www.atlantabesthandyman.com/' },
      { name: 'Atlanta Handyman', website: 'https://atlantashandyman.com/' },
      { name: 'Your Handyman Atlanta', website: 'https://yourhandymanatlanta.com/' },
    ],
    'tree-service': [
      { name: 'Tree Atlanta', website: 'https://www.treeatlanta.com/' },
      { name: 'Atlanta Tree Company', website: 'https://www.atlantatreecompany.com/' },
      { name: 'Atlanta Forest Tree Service & Landscapes', website: 'https://www.atlantaforest.com/' },
      { name: 'Atlanta Arbor', website: 'https://www.atlantaarbor.com/' },
    ],
    concrete: [
      { name: 'Atlanta Concrete Company', website: 'https://atlconcretecompany.com/' },
      { name: 'Atlanta Concrete Contractors', website: 'https://www.atlantaconcretecontractors.com/' },
      { name: 'Southern Concrete', website: 'https://www.southernconcretega.com/' },
      { name: 'Titan Construction Group', website: 'https://www.titanconstructiongroupllc.com/' },
    ],
    insulation: [
      { name: 'Atlanta Insulation & Contracting Services', website: 'https://atlantainsulation.com/' },
      { name: 'Atlanta Insulation Contractor', website: 'https://atlantainsulationcontractor.com/' },
      { name: 'GCS Spray Foam Insulation', website: 'https://www.gcssprayfoam.com/' },
      { name: 'Insulation Over Atlanta', website: 'https://insulationoveratlanta.com/' },
    ],
    'pest-control': [
      { name: 'Atlanta Pest Control', website: 'https://atlantapestco.com/' },
      { name: 'Trinity Pest Management', website: 'https://www.trinitypestmanagementinc.com/' },
      { name: 'Action Plus Termite & Pest Control', website: 'https://actionplusga.com/' },
      { name: 'Active Pest Control', website: 'https://atlantapest.net/' },
    ],
  },
};

function normalizedWebsite(value: string) {
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, '').toLowerCase();
    const path = url.pathname.replace(/\/+$/, '').toLowerCase();
    return `${host}${path}`;
  } catch {
    return value.trim().toLowerCase().replace(/\/+$/, '');
  }
}

function mergeProviders(base: readonly Provider[], additions: readonly Provider[]) {
  const seenNames = new Set<string>();
  const seenWebsites = new Set<string>();
  const additionsWithStableKeys = additions.map((provider) => ({
    ...provider,
    seedKey: `site-${slug(normalizedWebsite(provider.website))}`,
  }));

  return [...base, ...additionsWithStableKeys].filter((provider) => {
    const name = provider.name.trim().toLowerCase();
    const website = normalizedWebsite(provider.website);
    if (seenNames.has(name) || seenWebsites.has(website)) return false;
    seenNames.add(name);
    seenWebsites.add(website);
    return true;
  });
}

const researchedProviders: Record<
  Cluster,
  Partial<Record<TradeSlug, readonly Provider[]>>
> = expandedProviders;

const verifiedNewCategoryProviders: Record<
  Cluster,
  Partial<Record<TradeSlug, readonly Provider[]>>
> = newCategoryProviders;

function buildClusterProviders(cluster: Cluster) {
  const groups = {} as Record<TradeSlug, readonly Provider[]>;
  for (const trade of trades) {
    groups[trade.slug] = mergeProviders(
      baseProviders[cluster][trade.slug] ?? [],
      [
        ...(researchedProviders[cluster][trade.slug] ?? []),
        ...(verifiedNewCategoryProviders[cluster][trade.slug] ?? []),
      ],
    );
  }
  return groups;
}

const providers: Record<Cluster, Record<TradeSlug, readonly Provider[]>> = {
  pensacola: buildClusterProviders('pensacola'),
  alabama: buildClusterProviders('alabama'),
  tampa: buildClusterProviders('tampa'),
  atlanta: buildClusterProviders('atlanta'),
};

const regionNames = new Map(regions.map((region) => [region.slug, region.name]));

function websiteDomain(value: string) {
  try { return new URL(value).hostname.replace(/^www\./, '').toLowerCase(); }
  catch { return normalizedWebsite(value).split('/')[0]; }
}

const identityDomains = new Map<string, Set<string>>();
for (const groups of Object.values(providers)) for (const businesses of Object.values(groups)) for (const business of businesses) {
  const name = slug(business.name);
  const domains = identityDomains.get(name) ?? new Set<string>();
  domains.add(websiteDomain(business.website));
  identityDomains.set(name, domains);
}
for (const business of verifiedActiveProvidersData as readonly VerifiedProvider[]) {
  const name = slug(business.name);
  const domains = identityDomains.get(name) ?? new Set<string>();
  domains.add(websiteDomain(business.website));
  identityDomains.set(name, domains);
}

function canonicalBusinessSlug(name: string, website: string) {
  const nameSlug = slug(name);
  return (identityDomains.get(nameSlug)?.size ?? 0) > 1
    ? `${nameSlug}-${slug(websiteDomain(website))}`
    : nameSlug;
}

const clusterDirectorySeed = (Object.entries(providers) as [Cluster, Record<TradeSlug, readonly Provider[]>][])
  .flatMap(([cluster, tradeGroups]) => clusterRegions[cluster].flatMap((region) =>
    (Object.entries(tradeGroups) as [TradeSlug, readonly Provider[]][]).flatMap(([trade, businesses]) =>
      businesses.map((business, index) => ({
        id: `seed-v1-${region}-${trade}-${business.seedKey ?? index + 1}`,
        name: business.name,
        slug: `${slug(business.name)}-${region}-${trade}`,
        mainSlug: canonicalBusinessSlug(business.name, business.website),
        region,
        trade,
        location: regionNames.get(region) ?? region,
        summary: '',
        website: business.website,
        sourceUrl: business.website,
        sourceVerifiedAt: DIRECTORY_VERIFIED_AT,
        source: DIRECTORY_SOURCE,
        publicEmail: null as string | null,
      })),
    ),
  ));

const activeRegionSlugs = new Set<string>(activeRegions.map((region) => region.slug));
const tradeSlugs = new Set<string>(trades.map((trade) => trade.slug));
const seenPairWebsites = new Set(clusterDirectorySeed.map((business) => `${business.region}|${business.trade}|${normalizedWebsite(business.website)}`));
const seenBusinessSlugs = new Set(clusterDirectorySeed.map((business) => business.slug));

const verifiedDirectorySeed = (verifiedActiveProvidersData as readonly VerifiedProvider[])
  .flatMap((business) => business.regions.flatMap((region) => business.trades.map((trade) => {
    if (!activeRegionSlugs.has(region) || !tradeSlugs.has(trade)) return null;
    const businessSlug = `${slug(business.name)}-${region}-${trade}`;
    return {
      id: `verified-v1-${region}-${trade}-${slug(normalizedWebsite(business.website))}`,
      name: business.name,
      slug: businessSlug,
      mainSlug: canonicalBusinessSlug(business.name, business.website),
      region,
      trade,
      location: regionNames.get(region) ?? region,
      summary: '',
      website: business.website,
      sourceUrl: business.website,
      sourceVerifiedAt: DIRECTORY_VERIFIED_AT,
      source: DIRECTORY_SOURCE,
      publicEmail: null as string | null,
    };
  })))
  .filter((business): business is NonNullable<typeof business> => business !== null)
  .filter((business) => {
    const pairWebsite = `${business.region}|${business.trade}|${normalizedWebsite(business.website)}`;
    if (seenPairWebsites.has(pairWebsite) || seenBusinessSlugs.has(business.slug)) return false;
    seenPairWebsites.add(pairWebsite);
    seenBusinessSlugs.add(business.slug);
    return true;
  });

export const directorySeed = [...clusterDirectorySeed, ...verifiedDirectorySeed];

export const directoryStats = {
  cities: activeRegions.length,
  categories: trades.length,
  pages: activeRegions.length * trades.length,
  listings: directorySeed.length,
};
