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

const auditedExceptions = directorySeed.filter((business) => isExcludedWebsite(business.website));
const leaked = auditedExceptions.filter((business) => !isAuditedExcludedDomainPlacement(business));
check('generated directory has no unaudited excluded websites', leaked.length === 0, `${leaked.length} leaked placements`);
check('excluded-domain placements are explicitly audited', auditedExceptions.length === 18, `${auditedExceptions.length} placement-scoped exceptions`);

for (const domain of ['retailfixit.com', 'servpro.com', 'progressive.com', 'mobilebayohd.com', 'terminix.com']) {
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
fs.writeFileSync(process.env.VALIDATION_OUTPUT, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report));
