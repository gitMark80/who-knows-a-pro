// Runs the real runtime against a disposable local SQLite database; no service keys.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const Module = require('node:module');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const resolve = Module._resolveFilename;
Module._resolveFilename = function (name, ...args) {
  return resolve.call(this, name.startsWith('@/') ? path.join(root, name.slice(2)) : name, ...args);
};
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, resolveJsonModule: true },
}).outputText, filename);
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'wkap-private-test-'));
process.env.TURSO_DATABASE_URL = `file:${temp}/fixture.db`;
delete process.env.TURSO_AUTH_TOKEN;
process.env.SITE_URL = 'https://whoknowsapro.com';
process.env.STRIPE_LIVE_MODE = 'true';
const runtimePath = path.join(root, 'db/runtime.ts');
(async () => {
  let r = require(runtimePath);
  await r.ensureDatabase();
  const fixture = await r.getBusiness('wkap-live-billing-test');
  assert.equal(fixture.name, 'WKAP Test Business');
  assert.equal(fixture.is_test, 1);
  const before = await r.listDirectoryPairCounts();
  await r.sqlRun("UPDATE businesses SET approved=1,owner_email='hello@whoknowsapro.com',tier='enhanced' WHERE id=?", [fixture.id]);
  assert.equal((await r.getBusinessProfile('wkap-test-business')).profile.owner_email, 'hello@whoknowsapro.com');
  assert.equal((await r.listBusinesses('pensacola-fl', 'lawn-care')).some(x=>x.id===fixture.id), false);
  assert.equal((await r.listBusinesses()).some(x=>x.id===fixture.id), false);
  assert.equal((await r.listBusinessSlugs()).some(x=>x.slug==='wkap-test-business'), false);
  assert.deepEqual(await r.listDirectoryPairCounts(), before);
  const revenue = require(path.join(root,'db/revenue.ts'));
  await r.sqlRun("INSERT INTO featured_slots (id,region,trade,business_id,business_slug,status,updated_at) VALUES ('test-slot','pensacola-fl','lawn-care',?,'wkap-test-business','active',?)", [fixture.id, Date.now()]);
  assert.equal(await revenue.getFeaturedBusiness('pensacola-fl','lawn-care'), null);
  await r.sqlRun('DELETE FROM businesses WHERE id=?',[fixture.id]);
  r.database().close();
  delete require.cache[require.resolve(runtimePath)];
  r = require(runtimePath);
  await r.ensureDatabase();
  assert.equal(await r.getBusiness(fixture.id),null, 'deleted fixture must not be reseeded');
  r.database().close();
  console.log('PASS: claimed paid fixture remains private; sitemap/counts unchanged; deletion survives cold start.');
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(()=>fs.rmSync(temp,{recursive:true,force:true}));
