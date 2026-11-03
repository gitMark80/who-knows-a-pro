import fs from 'node:fs';

const sourcePath = process.env.FILL_SOURCE ?? 'data/verified-coverage-2026-09-28.json';
const outputPath = process.env.FILL_AUDIT_OUTPUT ?? 'reports/historical-qualification-flags-2026-11-03.json';
const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
const patterns = {
  unsupported_residential_service: /no residential|residential service is not asserted|commercial[- ]only|commercial (?:facility|facilities|properties|systems|equipment)|household[- ]appliance service is not asserted/i,
  intermediary_or_managed_network: /managed (?:vendor|contractor|technician) network|managed local specialists|through a managed network|vendor network|national dispatch|facility management/i,
  unsupported_specific_geography: /nationwide|all 50 states|throughout the United States|throughout the country|throughout Florida|the Southeast/i,
};

const flaggedRows = [];
for (const [sourceIndex, row] of source.entries()) {
  const note = row.evidenceNote ?? '';
  const reasons = Object.entries(patterns).filter(([, pattern]) => pattern.test(note)).map(([reason]) => reason);
  if (!reasons.length) continue;
  flaggedRows.push({
    sourceIndex,
    name: row.name,
    website: row.website,
    sourceUrl: row.sourceUrl,
    sourceVerifiedAt: row.sourceVerifiedAt,
    reasons,
    placementCount: row.regions.length * row.trades.length,
    regions: row.regions,
    trades: row.trades,
    evidenceNote: note,
  });
}

const businesses = new Map();
for (const row of flaggedRows) {
  const key = `${row.name}|${new URL(row.website).hostname.replace(/^www\./, '').toLowerCase()}`;
  if (!businesses.has(key)) businesses.set(key, { name: row.name, website: row.website, reasons: new Set(), sourceRows: 0, placements: 0, sourceIndexes: [] });
  const business = businesses.get(key);
  business.sourceRows += 1;
  business.placements += row.placementCount;
  business.sourceIndexes.push(row.sourceIndex);
  row.reasons.forEach((reason) => business.reasons.add(reason));
}

const summary = [...businesses.values()].map((row) => ({ ...row, reasons: [...row.reasons] })).sort((a, b) => b.placements - a.placements || a.name.localeCompare(b.name));
const retailFixIt = summary.find((row) => /retailfixit\.com/i.test(row.website));
const report = {
  checkedAt: new Date().toISOString(),
  sourcePath,
  status: 'review_required_public_visibility_unchanged',
  methodology: 'Conservative text scan of saved evidence. A flag excludes a placement from qualifying coverage until residential service, direct-provider status, category match, specific local coverage, and official identity are jointly reverified. Flags do not delete or hide records.',
  flaggedSourceRows: flaggedRows.length,
  flaggedPlacements: flaggedRows.reduce((sum, row) => sum + row.placementCount, 0),
  flaggedBusinessIdentities: summary.length,
  retailFixIt,
  businesses: summary,
};
fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ outputPath, flaggedSourceRows: report.flaggedSourceRows, flaggedPlacements: report.flaggedPlacements, flaggedBusinessIdentities: report.flaggedBusinessIdentities, retailFixIt }, null, 2));
