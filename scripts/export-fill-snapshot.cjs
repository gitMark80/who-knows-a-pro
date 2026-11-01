/* eslint-disable @typescript-eslint/no-require-imports -- This standalone CommonJS helper loads generated CJS snapshots. */
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');

const output = path.resolve(process.argv[2]);
const dependencyRoot = process.env.FILL_DEPENDENCY_ROOT || process.cwd();
const dependencyRequire = createRequire(path.join(dependencyRoot, 'package.json'));
const esbuild = dependencyRequire('esbuild');
fs.mkdirSync(output, { recursive: true });
for (const entry of ['catalog', 'directory']) {
  esbuild.buildSync({ entryPoints: [`data/${entry}.ts`], bundle: true, platform: 'node', format: 'cjs', outfile: `${output}/${entry}.cjs`, logLevel: 'silent' });
}
const { directorySeed } = require(`${output}/directory.cjs`);
const { activeRegions, visibleTrades } = require(`${output}/catalog.cjs`);
fs.writeFileSync(`${output}/seed.json`, JSON.stringify(directorySeed, null, 2) + '\n');
fs.writeFileSync(`${output}/catalog.json`, JSON.stringify({ activeRegions, visibleTrades }, null, 2) + '\n');
console.log(JSON.stringify({ output, listings: directorySeed.length, cities: activeRegions.length, categories: visibleTrades.length }));
