import { sqlAll } from '@/db/runtime';

export type ResultCounts = { views: number; website: number; phone: number; quotes: number };
export type BusinessResults = { current: ResultCounts; previous: ResultCounts };
export function resultMonths(now = Date.now()) {
  const date = new Date(now);
  return { now, start: Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1), previous: Date.UTC(date.getUTCFullYear(), date.getUTCMonth() - 1, 1) };
}
export function emptyResults(): BusinessResults {
  return { current: { views: 0, website: 0, phone: 0, quotes: 0 }, previous: { views: 0, website: 0, phone: 0, quotes: 0 } };
}
export async function businessResults(slug?: string, now = Date.now()) {
  const range = resultMonths(now);
  const filter = slug ? ' AND business_slug = ?' : '';
  const args = slug ? [range.previous, range.now, slug] : [range.previous, range.now];
  const rows = await sqlAll<{ business_slug: string; metric: keyof ResultCounts; period: string; count: number }>(`
    SELECT business_slug,metric,CASE WHEN happened_at >= ? THEN 'current' ELSE 'previous' END AS period,COUNT(*) AS count
    FROM (
      SELECT business_slug,'views' AS metric,viewed_at AS happened_at FROM profile_views
      UNION ALL SELECT business_slug,action AS metric,created_at AS happened_at FROM business_clicks
      UNION ALL SELECT routed_business_slug AS business_slug,'quotes' AS metric,created_at AS happened_at
        FROM leads WHERE routed = 1 AND routed_business_slug IS NOT NULL
    ) WHERE happened_at >= ? AND happened_at < ? ${filter}
    GROUP BY business_slug,metric,period`, [range.start, ...args]);
  const results = new Map<string, BusinessResults>();
  for (const row of rows) {
    const result = results.get(row.business_slug) || emptyResults();
    result[row.period === 'current' ? 'current' : 'previous'][row.metric] = Number(row.count);
    results.set(row.business_slug, result);
  }
  return results;
}
