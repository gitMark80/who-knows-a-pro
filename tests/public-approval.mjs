import assert from 'node:assert/strict';
import { directorySeed, isAuditedExcludedDomainPlacement } from '../data/directory.ts';
import { excludedWebsiteDomains, isExcludedWebsite } from '../data/excluded-businesses.ts';
import {
  isPublicDirectoryBusiness, getBusiness, getBusinessProfile, listBusinesses,
  listBusinessSlugs, listIndexableBusinessSlugs, listDirectoryPairCounts,
  searchDirectory, sqlOne, sqlRun,
} from '../db/runtime.ts';

// Always use a private in-memory database. Never contact production or send leads.
process.env.TURSO_DATABASE_URL = 'file::memory:';
delete process.env.TURSO_AUTH_TOKEN;
process.env.SITE_URL = 'http://localhost';
assert.ok(directorySeed.length > 0);
assert.ok(directorySeed.every(seed => !isExcludedWebsite(seed.website)), 'no national seed placements');
assert.ok(directorySeed.every(seed => !isAuditedExcludedDomainPlacement(seed)), 'no exception bypass');
const regional = { region: 'pensacola-fl', trade: 'plumbing', website: 'https://regional.example.test/', approved: 1, is_test: 0 };
assert.equal(isPublicDirectoryBusiness(regional), true);
for (const approved of [0, -1, null, undefined]) {
  assert.equal(isPublicDirectoryBusiness({ ...regional, approved }), false, 'explicit approval required');
}
assert.equal(isPublicDirectoryBusiness({ ...regional, is_test: 1 }), false);
for (const domain of excludedWebsiteDomains) {
  for (const website of [`https://${domain}/`, `https://www.${domain}/local-branch`, `https://branch.${domain}/`]) {
    assert.equal(isPublicDirectoryBusiness({ ...regional, website }), false, `national excluded: ${website}`);
  }
}
assert.equal(isExcludedWebsite('https://notterminix.com/'), false, 'domain boundaries are exact');
assert.equal(isExcludedWebsite('https://terminix.com.regional.example.test/'), false);
assert.equal(isPublicDirectoryBusiness({ ...regional, region: 'crestview-fl', trade: 'pest-control', website: 'https://www.orkin.com/locations/florida-fl/pensacola-pest-control' }), false, 'former audited branch stays excluded');
assert.equal(isPublicDirectoryBusiness({ ...regional, region: 'destin-fl', trade: 'appliance-repair', website: 'https://www.searshomeservices.com/repair' }), false, 'former Sears exception stays excluded');

// Canonical-slug overrides load even when unapproved. They must not bypass the
// final public-list filter or the same predicate used by lead routing.
const seed = directorySeed[0];
const base = await getBusiness(seed.id);
assert.ok(base);
await sqlRun(`INSERT INTO businesses
  (id,name,slug,main_slug,region,trade,location,website,approved,is_test,owner_email,updated_at)
  VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
  ['approval-fixture', 'Unapproved local override', 'approval-fixture', base.main_slug,
    seed.region, seed.trade, base.location, seed.website, 0, 0, 'owner@example.test', Date.now()]);
const hidden = await getBusiness(seed.id);
assert.equal(hidden.approved, 0);
assert.equal(isPublicDirectoryBusiness(hidden), false, 'unapproved featured business cannot pass lead eligibility');
assert.ok(!(await listBusinesses(seed.region, seed.trade, Infinity)).some(row => row.main_slug === base.main_slug), 'unapproved override stays off directory');
await sqlRun('UPDATE businesses SET approved = 1 WHERE id = ?', ['approval-fixture']);
assert.ok((await listBusinesses(seed.region, seed.trade, Infinity)).some(row => row.main_slug === base.main_slug), 'approved local override remains visible');
await sqlRun('UPDATE businesses SET is_test = 1 WHERE id = ?', ['approval-fixture']);
assert.ok(!(await listBusinesses(seed.region, seed.trade, Infinity)).some(row => row.main_slug === base.main_slug), 'test override stays hidden');

// Legacy approved/claimed nationals remain stored and owner-accessible, but not
// discoverable publicly. This also exercises aliases, not just the old bypasses.
const beforeCounts = await listDirectoryPairCounts();
const domains = ['orkin.com', 'terminix.com', 'searshomeservices.com', 'pestdefense.com', 'servicemasteralabama.com', 'precisiondoormobile.com', 'oxifresh.com', 'merrymaids.com', 'precisiontune.com'];
for (const [i, domain] of domains.entries()) {
  const id = `national-regression-${i}`;
  await sqlRun(`INSERT INTO businesses
    (id,name,slug,main_slug,region,trade,location,summary,website,approved,is_test,owner_email,tier,stripe_customer_id,stripe_subscription_id,updated_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [id, `Nationalregression ${domain}`, id, id, 'crestview-fl', 'pest-control', 'Crestview', 'Owner supplied detail', `https://${domain}/`, 1, 0, 'owner@example.test', 'featured', 'cus_preserved_fixture', 'sub_preserved_fixture', Date.now()]);
  const stored = await getBusiness(id);
  assert.equal(stored.approved, 1, 'approval state not rewritten');
  assert.equal(stored.owner_email, 'owner@example.test', 'claim retained');
  assert.equal(stored.stripe_customer_id, 'cus_preserved_fixture', 'billing references retained');
  assert.equal(stored.stripe_subscription_id, 'sub_preserved_fixture');
  assert.equal(stored.tier, 'featured');
  assert.equal(isPublicDirectoryBusiness(stored), false, 'claimed/featured does not bypass policy');
  assert.equal(await getBusinessProfile(id), null, 'public profile hidden');
  assert.ok(await getBusinessProfile(id, { includeExcluded: true }), 'owner/internal profile remains accessible');
}
assert.equal((await searchDirectory('Nationalregression', 100)).length, 0, 'nationals absent from search');
assert.ok(!(await listBusinesses('crestview-fl', 'pest-control', Infinity)).some(row => row.id.startsWith('national-regression-')));
assert.ok(!(await listBusinessSlugs()).some(row => row.slug.startsWith('national-regression-')), 'nationals absent from slug inventory');
assert.ok(!(await listIndexableBusinessSlugs()).some(row => row.slug.startsWith('national-regression-')), 'nationals absent from sitemap');
assert.deepEqual(await listDirectoryPairCounts(), beforeCounts, 'hidden nationals do not inflate public counts');
assert.equal((await sqlOne("SELECT COUNT(*) AS total FROM businesses WHERE id LIKE 'national-regression-%'")).total, domains.length, 'all source DB records preserved');
console.log(`PASS: approval/test gates; ${excludedWebsiteDomains.length} national domain rules; local overrides; public search/profile/sitemap/count exclusions; legacy claim and billing preservation`);
