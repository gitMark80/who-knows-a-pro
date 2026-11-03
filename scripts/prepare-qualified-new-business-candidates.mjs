import fs from 'node:fs';
import { normalizeDomain, validateQualifyingCandidate } from './qualification-policy.mjs';

const baseline = JSON.parse(fs.readFileSync(process.env.FILL_BASELINE_SEED ?? '/tmp/wkap-baseline-20261103/seed.json', 'utf8'));
const catalog = JSON.parse(fs.readFileSync(process.env.FILL_BASELINE_CATALOG ?? '/tmp/wkap-baseline-20261103/catalog.json', 'utf8'));
const inputFiles = JSON.parse(process.env.FILL_INPUT_FILES ?? '[]');
const output = process.env.FILL_OUTPUT ?? 'reports/candidates-qualified-new-businesses-2026-11-03.json';
const baselineDomains = new Set(baseline.map((row) => normalizeDomain(row.website)));
const excludedSource = fs.readFileSync('data/excluded-businesses.ts', 'utf8').split('export const excludedWebsiteDomains = [', 2)[1].split('] as const', 1)[0];
const excludedDomains = new Set([...excludedSource.matchAll(/'([^']+)'/g)].map((match) => match[1]));
const seen = new Set();
const candidates = [];

for (const path of inputFiles) {
  for (const row of JSON.parse(fs.readFileSync(path, 'utf8'))) {
    const domain = normalizeDomain(row.website);
    if (baselineDomains.has(domain) || excludedDomains.has(domain)) continue;
    const key = `${domain}|${row.regions.join(',')}|${row.trades.join(',')}|${row.sourceUrl}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const evidence = row.evidenceNote;
    const candidate = {
      ...row,
      providerRole: 'direct-provider',
      providerEvidence: evidence,
      geographicEvidence: evidence,
      geographicSourceUrl: row.sourceUrl,
      identityEvidence: evidence,
      officialWebsiteFinalUrl: row.website,
    };
    validateQualifyingCandidate(candidate, { catalog });
    candidates.push(candidate);
  }
}

const distinctDomains = new Set(candidates.map((row) => normalizeDomain(row.website)));
if (distinctDomains.size === 0) throw new Error('No new qualifying business domains found');
fs.writeFileSync(output, `${JSON.stringify(candidates, null, 2)}\n`);
console.log(JSON.stringify({ output, candidateRows: candidates.length, distinctNewBusinessDomains: distinctDomains.size }, null, 2));
