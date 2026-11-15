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

for (const domain of ['retailfixit.com', 'servpro.com', 'progressive.com', 'mobilebayohd.com', 'terminix.com', 'orkin.com', 'searshomeservices.com', 'pestdefense.com', 'servicemasteralabama.com', 'precisiondoormobile.com', 'oxifresh.com', 'merrymaids.com', 'precisiontune.com']) {
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
