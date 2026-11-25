import fs from 'node:fs';
import assert from 'node:assert/strict';
import { normalizeDomain, validateQualifyingCandidate } from './qualification-policy.mjs';

const baselinePath = process.env.FILL_BASELINE_SEED;
const catalogPath = process.env.FILL_BASELINE_CATALOG;
assert(baselinePath && catalogPath, 'Specify the run-start seed and catalog');
const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const inputFiles = JSON.parse(process.env.FILL_INPUT_FILES ?? '[]');
assert(inputFiles.length > 0, 'Specify candidate inputs with FILL_INPUT_FILES');
const output = process.env.FILL_OUTPUT;
assert(output, 'Specify a fresh qualified output with FILL_OUTPUT');
const pendingOutput = process.env.FILL_PENDING_OUTPUT ?? output.replace(/(?:\.json)?$/, '.pending.json');
assert.notEqual(output, pendingOutput, 'Qualified and pending outputs must be separate');
const baselineDomains = new Set(baseline.map((row) => normalizeDomain(row.website)));
const excludedSource = fs.readFileSync('data/excluded-businesses.ts', 'utf8').split('export const excludedWebsiteDomains = [', 2)[1].split('] as const', 1)[0];
const excludedDomains = [...excludedSource.matchAll(/^\s*'([^']+)',/gm)].map((match) => match[1]);
const candidates = [];
const pending = [];
const seen = new Set();
const isExcluded = (domain) => excludedDomains.some((listed) => domain === listed || domain.endsWith(`.${listed}`));

for (const path of inputFiles) {
  for (const row of JSON.parse(fs.readFileSync(path, 'utf8'))) {
    try {
      const domain = normalizeDomain(row.website);
      const finalDomain = normalizeDomain(row.officialWebsiteFinalUrl);
      if (baselineDomains.has(domain) || baselineDomains.has(finalDomain)) continue;
      assert(!isExcluded(domain) && !isExcluded(finalDomain), 'Excluded national brand or network domain');
      assert(['local', 'regional'].includes(row.brandScope) && row.brandEvidence?.trim(), 'Local or regional brand evidence missing');
      validateQualifyingCandidate(row, { catalog, finalUrl: row.website });
      const key = `${finalDomain}|${row.regions.join(',')}|${row.trades.join(',')}`;
      if (seen.has(key)) continue;
      seen.add(key);
      candidates.push(row);
    } catch (error) {
      pending.push({ ...row, reason: error.message });
    }
  }
}

const distinctDomains = new Set(candidates.map((row) => normalizeDomain(row.officialWebsiteFinalUrl)));
fs.writeFileSync(output, `${JSON.stringify(candidates, null, 2)}\n`);
fs.writeFileSync(pendingOutput, `${JSON.stringify(pending, null, 2)}\n`);
console.log(JSON.stringify({ output, pendingOutput, pendingRows: pending.length, candidateRows: candidates.length, distinctNewBusinessDomains: distinctDomains.size }, null, 2));
