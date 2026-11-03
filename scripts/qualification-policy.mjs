import assert from 'node:assert/strict';

const commercialOnly = /\b(commercial[- ]only|commercial (?:facility|facilities|properties|systems|equipment)|no residential|residential service is not asserted|household[- ]appliance service is not asserted)\b/i;
const intermediary = /\b(referral (?:site|website|service)|lead seller|contractor[- ]matching|vendor network|managed (?:vendor|contractor|technician) network|sources? unrelated vendors)\b/i;
const vagueGeography = /\b(nationwide|all 50 states|throughout florida|the southeast)\b/i;

export function validateQualifyingCandidate(candidate, { catalog, finalUrl } = {}) {
  const label = candidate.name ?? candidate.website ?? 'candidate';
  assert.equal(candidate.providerRole, 'direct-provider', `Direct-provider evidence missing for ${label}`);
  assert(typeof candidate.providerEvidence === 'string' && candidate.providerEvidence.length >= 80, `Provider evidence missing for ${label}`);
  assert(['residential', 'consumer'].includes(candidate.customerScope), `Residential/consumer scope missing for ${label}`);
  assert(typeof candidate.customerEvidence === 'string' && candidate.customerEvidence.length >= 80, `Residential/consumer evidence missing for ${label}`);
  assert(candidate.customerSourceUrl?.startsWith('https://'), `Customer evidence URL missing for ${label}`);
  assert(typeof candidate.geographicEvidence === 'string' && candidate.geographicEvidence.length >= 80, `Specific geographic evidence missing for ${label}`);
  assert(candidate.geographicSourceUrl?.startsWith('https://'), `Geographic evidence URL missing for ${label}`);
  assert(typeof candidate.identityEvidence === 'string' && candidate.identityEvidence.length >= 80, `Official-website identity evidence missing for ${label}`);
  assert(candidate.officialWebsiteFinalUrl?.startsWith('https://'), `Official final URL missing for ${label}`);
  assert(typeof candidate.evidenceNote === 'string' && candidate.evidenceNote.length >= 100, `Joint placement evidence missing for ${label}`);

  const combined = [candidate.evidenceNote, candidate.customerEvidence, candidate.providerEvidence].join(' ');
  assert(!commercialOnly.test(combined), `Commercial-only evidence rejected for ${label}`);
  assert(!intermediary.test(combined), `Intermediary/network evidence rejected for ${label}`);
  if (vagueGeography.test(candidate.geographicEvidence)) {
    assert(/\b(city|county|metro|branch|street address|location|service area)\b/i.test(candidate.geographicEvidence), `Broad geography without a specific local connection rejected for ${label}`);
  }
  if (finalUrl) {
    const expected = new URL(candidate.officialWebsiteFinalUrl).hostname.replace(/^www\./, '').toLowerCase();
    const actual = new URL(finalUrl).hostname.replace(/^www\./, '').toLowerCase();
    assert(actual === expected || actual.endsWith(`.${expected}`) || expected.endsWith(`.${actual}`), `Official website redirects to a different identity for ${label}`);
  }
  if (catalog) {
    const regions = new Set(catalog.activeRegions.map((row) => row.slug));
    const trades = new Set(catalog.visibleTrades.map((row) => row.slug));
    for (const region of candidate.regions) assert(regions.has(region), `Inactive region ${region} for ${label}`);
    for (const trade of candidate.trades) assert(trades.has(trade), `Hidden or unknown category ${trade} for ${label}`);
  }
  return candidate;
}

export function normalizeDomain(value) {
  return new URL(value).hostname.toLowerCase().replace(/^www\./, '');
}
