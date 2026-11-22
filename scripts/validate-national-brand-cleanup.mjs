import fs from 'node:fs';
import { directorySeed, isAuditedExcludedDomainPlacement } from '../data/directory.ts';
import { excludedWebsiteDomains, isExcludedWebsite } from '../data/excluded-businesses.ts';
import { isPublicDirectoryBusiness } from '../db/runtime.ts';

const assertions = [];
const check = (name, pass, detail) => {
  assertions.push({ name, pass, detail });
  if (!pass) throw new Error(`${name}: ${detail}`);
};

check(
  'excluded domain rules are unique',
  new Set(excludedWebsiteDomains).size === excludedWebsiteDomains.length,
  `${excludedWebsiteDomains.length} rules`,
);

const leaked = directorySeed.filter((business) => isExcludedWebsite(business.website));
check('generated directory contains no excluded websites', leaked.length === 0, `${leaked.length} leaked placements`);
check('no local-branch exceptions bypass national exclusions', !directorySeed.some(isAuditedExcludedDomainPlacement), 'zero placement exceptions');

for (const domain of ['bobtaylorscarpetonecrestview.com', 'bobtaylorscarpetoneopp.com', 'carpetone.com', 'carpetonedothan.com', 'carpetonepanamacity.com', 'ccadent.com', 'hollowaycarpetonedothan.com', 'carmedic.biz', 'destinflooring-america.com', 'destinflooringamericadestin.com', 'flooringamerica.com', 'lightspeedrestoration.com', 'restopros.co', 'rhodes-flooringamerica.com', 'tuffy.com', 'tuffygulfbreeze.com', 'tuffygunn.com', 'arrowexterminators.com', 'advantaclean.com', 'usainsulation.net', 'murphycompanyusa.com', 'nationalconcretepolishing.net', 'ifoam.com', 'ifoamalabama.com', 'greenhomesolutions.com', 'tiresplus.com', 'retailfixit.com', 'servpro.com', 'progressive.com', 'mobilebayohd.com', 'terminix.com', 'orkin.com', 'searshomeservices.com', 'pestdefense.com', 'servicemasteralabama.com', 'precisiondoormobile.com', 'oxifresh.com', 'merrymaids.com', 'precisiontune.com', 'windowdepotemeraldcoast.com', 'maidright.com', 'maids.com', 'restoration1ofgulfcoast.com']) {
  check(`required national exclusion: ${domain}`, isExcludedWebsite(`https://www.${domain}/example`), domain);
}

check(
  'claimed national row remains excluded from public surfaces',
  !isPublicDirectoryBusiness({ approved: 1, is_test: 0, website: 'https://retailfixit.com/' }),
  'approved/claimed status does not bypass the website policy',
);
check(
  'regional row remains eligible',
  isPublicDirectoryBusiness({ approved: 1, is_test: 0, website: 'https://example-regional-pro.test/', region: 'pensacola-fl', trade: 'plumbing' }),
  'non-excluded approved regional website passes',
);

check(
  'claimed Arrow Exterminators is excluded from public surfaces',
  !isPublicDirectoryBusiness({ approved: 1, is_test: 0, website: 'https://www.arrowexterminators.com/alabama/' }),
  'the public filter applies to approved legacy profiles',
);
check(
  'independent Panama City Arrow Pest Service remains eligible',
  isPublicDirectoryBusiness({ approved: 1, is_test: 0, website: 'https://arrowps.com/', region: 'panama-city-fl', trade: 'pest-control' }),
  'the Glover family business is distinct from Arrow Exterminators',
);

check(
  'approved local franchise profile remains excluded under the national brand',
  !isPublicDirectoryBusiness({ approved: 1, is_test: 0, website: 'https://usainsulation.net/atlanta' }),
  'public gate applies to the Atlanta franchise URL',
);
check(
  'independent Pensacola garage door company remains eligible',
  isPublicDirectoryBusiness({ approved: 1, is_test: 0, website: 'https://odoperator.com/', region: 'pensacola-fl', trade: 'garage-door-repair' }),
  'the local Overhead Door & Operator domain is distinct from national brand domains',
);

const report = {
  checkedAt: new Date().toISOString(),
  excludedDomainRules: excludedWebsiteDomains.length,
  generatedPlacements: directorySeed.length,
  generatedProfiles: new Set(directorySeed.map((business) => business.mainSlug)).size,
  assertions,
  status: 'pass',
};
if (process.env.VALIDATION_OUTPUT) fs.writeFileSync(process.env.VALIDATION_OUTPUT, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report));
