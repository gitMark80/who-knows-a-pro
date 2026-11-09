import assert from 'node:assert/strict';
import { directorySeed, isAuditedExcludedDomainPlacement } from '../data/directory.ts';
import { isPublicDirectoryBusiness, getBusiness, listBusinesses, sqlRun } from '../db/runtime.ts';

// Always use a private in-memory database. Never contact production or send leads.
process.env.TURSO_DATABASE_URL = 'file::memory:';
delete process.env.TURSO_AUTH_TOKEN;
process.env.SITE_URL = 'http://localhost';
const audited = directorySeed.filter(isAuditedExcludedDomainPlacement);
assert.ok(audited.length > 0, 'exercise real audited exceptions');
for (const seed of audited) {
  const row = { ...seed, approved: 1, is_test: 0 };
  assert.equal(isPublicDirectoryBusiness(row), true);
  for (const approved of [0, -1, null, undefined]) {
    assert.equal(isPublicDirectoryBusiness({ ...row, approved }), false, `approval required for ${seed.id}`);
  }
  assert.equal(isPublicDirectoryBusiness({ ...row, is_test: 1 }), false);
}
const regional = { region: 'pensacola-fl', trade: 'plumbing', website: 'https://regional.example.test/', approved: 1, is_test: 0 };
assert.equal(isPublicDirectoryBusiness(regional), true);
assert.equal(isPublicDirectoryBusiness({ ...regional, approved: 0 }), false);
assert.equal(isPublicDirectoryBusiness({ ...regional, website: 'https://www.terminix.com/unapproved-path/' }), false);

// Canonical-slug overrides load even when unapproved. They must not bypass the
// final public-list filter or the same predicate used by lead routing.
const seed = audited[0];
const base = await getBusiness(seed.id);
assert.ok(base);
await sqlRun(`INSERT INTO businesses
  (id,name,slug,main_slug,region,trade,location,website,approved,is_test,owner_email,updated_at)
  VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
  ['approval-fixture', 'Unapproved audited override', 'approval-fixture', base.main_slug,
    seed.region, seed.trade, base.location, seed.website, 0, 0, 'owner@example.test', Date.now()]);
const hidden = await getBusiness(seed.id);
assert.equal(hidden.approved, 0);
assert.equal(isPublicDirectoryBusiness(hidden), false, 'unapproved featured business cannot pass lead eligibility');
assert.ok(!(await listBusinesses(seed.region, seed.trade, Infinity)).some(row => row.main_slug === base.main_slug), 'unapproved override stays off directory');
await sqlRun('UPDATE businesses SET approved = 1 WHERE id = ?', ['approval-fixture']);
assert.ok((await listBusinesses(seed.region, seed.trade, Infinity)).some(row => row.main_slug === base.main_slug), 'approved audited override remains visible');
await sqlRun('UPDATE businesses SET is_test = 1 WHERE id = ?', ['approval-fixture']);
assert.ok(!(await listBusinesses(seed.region, seed.trade, Infinity)).some(row => row.main_slug === base.main_slug), 'test override stays hidden');
console.log(`PASS: approval required for ${audited.length} audited placements; directory overrides and lead eligibility checked`);
