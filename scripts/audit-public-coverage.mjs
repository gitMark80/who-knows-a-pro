import { pathToFileURL } from 'node:url';
import fs from 'node:fs';

const { directorySeed } = await import(pathToFileURL(`${process.cwd()}/data/directory.ts`));
const { activeRegions, visibleTrades } = await import(pathToFileURL(`${process.cwd()}/data/catalog.ts`));

const pages = [];
for (const region of activeRegions) {
  for (const trade of visibleTrades) {
    const rows = directorySeed.filter((business) => business.region === region.slug && business.trade === trade.slug);
    const profiles = new Set(rows.map((business) => business.mainSlug));
    pages.push({
      region: region.slug,
      trade: trade.slug,
      count: profiles.size,
      deficit: Math.max(0, 20 - profiles.size),
    });
  }
}

const domains = new Map();
for (const business of directorySeed) {
  const domain = new URL(business.website).hostname.replace(/^www\./, '').toLowerCase();
  const row = domains.get(domain) ?? { domain, placements: 0, profiles: new Set(), names: new Set() };
  row.placements += 1;
  row.profiles.add(business.mainSlug);
  row.names.add(business.name);
  domains.set(domain, row);
}

const report = {
  placements: directorySeed.length,
  profiles: new Set(directorySeed.map((business) => business.mainSlug)).size,
  domains: [...domains.values()].map((row) => ({
    domain: row.domain,
    placements: row.placements,
    profiles: row.profiles.size,
    names: [...row.names],
  })),
  pages,
  totalPages: pages.length,
  pagesAt20: pages.filter((page) => page.count >= 20).length,
  pagesBelow20: pages.filter((page) => page.count < 20).length,
  emptyPages: pages.filter((page) => page.count === 0).length,
  deficit: pages.reduce((sum, page) => sum + page.deficit, 0),
};
if (process.env.COVERAGE_OUTPUT) fs.writeFileSync(process.env.COVERAGE_OUTPUT, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ ...report, domains: report.domains.length, pages: report.pages.length }));
