import fs from 'node:fs';

const baseline = JSON.parse(fs.readFileSync(process.env.BASELINE_COVERAGE, 'utf8'));
const current = JSON.parse(fs.readFileSync(process.env.CURRENT_COVERAGE, 'utf8'));
const baselineSource = fs.readFileSync(process.env.BASELINE_EXCLUSIONS, 'utf8');
const currentSource = fs.readFileSync(process.env.CURRENT_EXCLUSIONS, 'utf8');
const extractDomains = (source) => [...source.matchAll(/^\s*'([^']+)',/gm)].map((match) => match[1]);
const baselineExclusions = new Set(extractDomains(baselineSource));
const currentExclusions = new Set(extractDomains(currentSource));
const newlyExcludedDomains = [...currentExclusions].filter((domain) => !baselineExclusions.has(domain)).sort();

const currentDomains = new Map(current.domains.map((row) => [row.domain, row]));
const removedDomains = baseline.domains
  .filter((row) => !currentDomains.has(row.domain))
  .sort((a, b) => b.placements - a.placements || a.domain.localeCompare(b.domain));
const currentPages = new Map(current.pages.map((page) => [`${page.region}|${page.trade}`, page]));
const pageChanges = baseline.pages
  .map((page) => {
    const after = currentPages.get(`${page.region}|${page.trade}`);
    return {
      region: page.region,
      trade: page.trade,
      before: page.count,
      after: after.count,
      removed: page.count - after.count,
      deficitAfter: after.deficit,
    };
  })
  .filter((page) => page.removed > 0)
  .sort((a, b) => b.removed - a.removed || a.region.localeCompare(b.region) || a.trade.localeCompare(b.trade));

const report = {
  checkedAt: new Date().toISOString(),
  baselineCommit: process.env.BASELINE_COMMIT,
  policy: 'Public directory includes local and regional brands only. National consumer brands, franchises, dispatch/facility networks, insurers/membership programs, and national project-service networks are excluded by normalized website domain.',
  retention: 'Historical source data, owner records, and billing records are retained. Runtime public filters also hide claimed national-brand rows from category pages, public profiles, counts, sitemaps, featured cards, and lead routing.',
  baseline: {
    placements: baseline.placements,
    profiles: baseline.profiles,
    pagesAt20: baseline.pagesAt20,
    pagesBelow20: baseline.pagesBelow20,
    emptyPages: baseline.emptyPages,
    displayedDeficit: baseline.deficit,
  },
  after: {
    placements: current.placements,
    profiles: current.profiles,
    pagesAt20: current.pagesAt20,
    pagesBelow20: current.pagesBelow20,
    emptyPages: current.emptyPages,
    displayedDeficit: current.deficit,
  },
  impact: {
    newlyExcludedDomainRules: newlyExcludedDomains.length,
    removedDisplayedDomains: removedDomains.length,
    removedDisplayedProfiles: baseline.profiles - current.profiles,
    removedDisplayedPlacements: baseline.placements - current.placements,
    affectedPages: pageChanges.length,
  },
  newlyExcludedDomains,
  removedDomains,
  pageChanges,
};

fs.writeFileSync(process.env.JSON_OUTPUT, `${JSON.stringify(report, null, 2)}\n`);
const lines = [
  '# National-brand directory cleanup — 2026-11-05',
  '',
  `Baseline: \`${report.baselineCommit}\``,
  '',
  '## Outcome',
  '',
  `- Added ${report.impact.newlyExcludedDomainRules} national-brand/network domain rules.`,
  `- Removed ${report.impact.removedDisplayedProfiles} national-brand profiles and ${report.impact.removedDisplayedPlacements} placements from generated public directory data.`,
  `- Affected ${report.impact.affectedPages} of 1,200 public city/category pages.`,
  `- Displayed coverage changed from ${report.baseline.pagesAt20} pages at 20+ to ${report.after.pagesAt20}; the displayed deficit changed from ${report.baseline.displayedDeficit} to ${report.after.displayedDeficit}.`,
  `- Empty public pages after cleanup: ${report.after.emptyPages}.`,
  '',
  'Historical source rows were not deleted. Owner and billing records remain intact. Runtime filters prevent excluded brands—including claimed rows—from appearing on public directory surfaces or receiving public lead routing.',
  '',
  '## Removed domains',
  '',
  '| Domain | Profiles | Placements | Names |',
  '|---|---:|---:|---|',
  ...removedDomains.map((row) => `| ${row.domain} | ${row.profiles} | ${row.placements} | ${row.names.join('; ').replaceAll('|', '\\|')} |`),
  '',
  '## Most affected pages',
  '',
  '| City slug | Category slug | Before | After | Removed | Deficit after |',
  '|---|---|---:|---:|---:|---:|',
  ...pageChanges.slice(0, 100).map((row) => `| ${row.region} | ${row.trade} | ${row.before} | ${row.after} | ${row.removed} | ${row.deficitAfter} |`),
  '',
];
fs.writeFileSync(process.env.MD_OUTPUT, `${lines.join('\n')}\n`);
console.log(JSON.stringify(report.impact));
