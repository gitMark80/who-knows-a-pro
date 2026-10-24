import { sqlAll } from '@/db/runtime';

/**
 * Numbers for /admin/stats. Everything is anonymous: visits and attribution come from
 * analytics_events (see lib/analytics.ts); profile views, website/phone clicks, quote requests,
 * and claims are read from their own tables, so they include history from before visit tracking.
 * Visits from automated browsers (navigator.webdriver) are excluded and reported separately.
 */

export const STAT_RANGES = { '1': 'Today', '7': '7 days', '30': '30 days', all: 'All time' } as const;
export type StatRange = keyof typeof STAT_RANGES;

export function parseRange(value: unknown): StatRange {
  return typeof value === 'string' && value in STAT_RANGES ? (value as StatRange) : '7';
}

/** Start of the range in ms. "Today" starts at midnight UTC, like the daily chart. */
export function rangeStart(range: StatRange, now = Date.now()) {
  if (range === 'all') return 0;
  const midnight = Date.UTC(new Date(now).getUTCFullYear(), new Date(now).getUTCMonth(), new Date(now).getUTCDate());
  return midnight - (Number(range) - 1) * 86_400_000;
}

const n = (value: unknown) => Number(value ?? 0) || 0;

export type Totals = {
  visits: number; returning: number; flagged: number; profileViews: number; websiteClicks: number; phoneClicks: number;
  quotes: number; claims: number; checkouts: number; activations: number;
};

export async function statTotals(since: number): Promise<Totals> {
  const [events, views, clicks, quotes, claims] = await Promise.all([
    sqlAll<{ visits: number; returning_visits: number; flagged: number; checkouts: number; activations: number }>(
      `SELECT SUM(event = 'site_visit' AND automation = 0) AS visits,
         SUM(event = 'site_visit' AND automation = 0 AND detail = 'returning') AS returning_visits,
         SUM(event = 'site_visit' AND automation = 1) AS flagged,
         SUM(event = 'checkout_initiated') AS checkouts,
         SUM(event = 'subscription_activated') AS activations
       FROM analytics_events WHERE created_at >= ?`, [since]),
    sqlAll<{ count: number }>('SELECT COUNT(*) AS count FROM profile_views WHERE viewed_at >= ?', [since]),
    sqlAll<{ website: number; phone: number }>(
      `SELECT SUM(action = 'website') AS website, SUM(action = 'phone') AS phone FROM business_clicks WHERE created_at >= ?`, [since]),
    sqlAll<{ count: number }>('SELECT COUNT(*) AS count FROM leads WHERE created_at >= ?', [since]),
    sqlAll<{ count: number }>('SELECT COUNT(*) AS count FROM claims WHERE created_at >= ?', [since]),
  ]);
  const e = events[0] || ({} as Record<string, number>);
  return {
    visits: n(e.visits), returning: n(e.returning_visits), flagged: n(e.flagged), checkouts: n(e.checkouts), activations: n(e.activations),
    profileViews: n(views[0]?.count), websiteClicks: n(clicks[0]?.website), phoneClicks: n(clicks[0]?.phone),
    quotes: n(quotes[0]?.count), claims: n(claims[0]?.count),
  };
}

export type DayRow = { day: string; visits: number; views: number; clicks: number; quotes: number };

/** The last `count` UTC days, oldest first, with zeros filled in. */
export async function statsByDay(count = 30, now = Date.now()): Promise<DayRow[]> {
  const since = rangeStart(String(count) as StatRange, now);
  const [visits, views, clicks, quotes] = await Promise.all([
    sqlAll<{ day: string; count: number }>(
      `SELECT date(created_at / 1000, 'unixepoch') AS day, COUNT(*) AS count FROM analytics_events
       WHERE event = 'site_visit' AND automation = 0 AND created_at >= ? GROUP BY 1`, [since]),
    sqlAll<{ day: string; count: number }>(
      `SELECT date(viewed_at / 1000, 'unixepoch') AS day, COUNT(*) AS count FROM profile_views WHERE viewed_at >= ? GROUP BY 1`, [since]),
    sqlAll<{ day: string; count: number }>(
      `SELECT date(created_at / 1000, 'unixepoch') AS day, COUNT(*) AS count FROM business_clicks WHERE created_at >= ? GROUP BY 1`, [since]),
    sqlAll<{ day: string; count: number }>(
      `SELECT date(created_at / 1000, 'unixepoch') AS day, COUNT(*) AS count FROM leads WHERE created_at >= ? GROUP BY 1`, [since]),
  ]);
  const map = (rows: { day: string; count: number }[]) => new Map(rows.map((row) => [String(row.day), n(row.count)]));
  const [v, p, c, q] = [map(visits), map(views), map(clicks), map(quotes)];
  return Array.from({ length: count }, (_, i) => {
    const day = new Date(since + i * 86_400_000).toISOString().slice(0, 10);
    return { day, visits: v.get(day) || 0, views: p.get(day) || 0, clicks: c.get(day) || 0, quotes: q.get(day) || 0 };
  });
}

/** Friendly source names: UTM source if set, otherwise the referring site, otherwise Direct. */
export function sourceName(source: string | null, referrer: string | null) {
  if (source) return source;
  const host = (referrer || '').replace(/^www\./, '');
  if (!host) return 'direct';
  const known: [RegExp, string][] = [
    [/(^|\.)google\./, 'google'], [/(^|\.)bing\.com$/, 'bing'], [/duckduckgo|yahoo|ecosia|brave\.com|search/, 'other search'],
    [/(^|\.)(facebook\.com|fb\.com|fb\.me)$|^l\.facebook|^m\.facebook/, 'facebook'], [/(^|\.)instagram\.com$/, 'instagram'],
    [/(^|\.)(youtube\.com|youtu\.be)$/, 'youtube'], [/(^|\.)pinterest\./, 'pinterest'], [/(^|\.)nextdoor\.com$/, 'nextdoor'],
    [/(^|\.)yelp\.com$/, 'yelp'], [/(^|\.)reddit\.com$/, 'reddit'], [/(^|\.)(t\.co|x\.com|twitter\.com)$/, 'x'],
    [/(^|\.)linkedin\.com$|^lnkd\.in$/, 'linkedin'], [/chatgpt\.com|openai\.com/, 'chatgpt'], [/perplexity\.ai/, 'perplexity'],
    [/(^|\.)claude\.ai$/, 'claude'], [/(^|\.)gemini\.google|copilot\.microsoft/, 'ai assistant'],
  ];
  for (const [pattern, name] of known) if (pattern.test(host)) return name;
  return host;
}

export type SourceRow = { source: string; visits: number; returning: number; views: number; quotes: number; claims: number; checkouts: number; activations: number };

export async function statsBySource(since: number): Promise<SourceRow[]> {
  const rows = await sqlAll<{ source: string | null; referrer: string | null; event: string; returning_visits: number; count: number }>(
    `SELECT source, referrer_host AS referrer, event, SUM(detail = 'returning') AS returning_visits, COUNT(*) AS count
     FROM analytics_events
     WHERE created_at >= ? AND automation = 0
       AND event IN ('site_visit','business_profile_viewed','quote_submitted','claim_submitted','checkout_initiated','subscription_activated')
     GROUP BY source, referrer_host, event`, [since]);
  const out = new Map<string, SourceRow>();
  for (const row of rows) {
    const name = sourceName(row.source, row.referrer);
    const item = out.get(name) || { source: name, visits: 0, returning: 0, views: 0, quotes: 0, claims: 0, checkouts: 0, activations: 0 };
    const count = n(row.count);
    if (row.event === 'site_visit') { item.visits += count; item.returning += n(row.returning_visits); }
    else if (row.event === 'business_profile_viewed') item.views += count;
    else if (row.event === 'quote_submitted') item.quotes += count;
    else if (row.event === 'claim_submitted') item.claims += count;
    else if (row.event === 'checkout_initiated') item.checkouts += count;
    else if (row.event === 'subscription_activated') item.activations += count;
    out.set(name, item);
  }
  return [...out.values()].sort((a, b) => b.visits - a.visits || b.views - a.views || b.quotes - a.quotes).slice(0, 20);
}

export type PlaceRow = { key: string; visits: number; views: number; quotes: number };

/** Visits, profile views, and quote requests by city (region) or by category (trade). */
export async function statsByPlace(column: 'region' | 'trade', since: number): Promise<PlaceRow[]> {
  const [events, quotes] = await Promise.all([
    sqlAll<{ key: string; visits: number; views: number }>(
      `SELECT ${column} AS key, SUM(event = 'site_visit') AS visits, SUM(event = 'business_profile_viewed') AS views
       FROM analytics_events WHERE created_at >= ? AND automation = 0 AND ${column} IS NOT NULL
         AND event IN ('site_visit','business_profile_viewed') GROUP BY 1`, [since]),
    sqlAll<{ key: string; count: number }>(`SELECT ${column} AS key, COUNT(*) AS count FROM leads WHERE created_at >= ? GROUP BY 1`, [since]),
  ]);
  const out = new Map<string, PlaceRow>();
  for (const row of events) out.set(String(row.key), { key: String(row.key), visits: n(row.visits), views: n(row.views), quotes: 0 });
  for (const row of quotes) {
    const item = out.get(String(row.key)) || { key: String(row.key), visits: 0, views: 0, quotes: 0 };
    item.quotes = n(row.count);
    out.set(item.key, item);
  }
  return [...out.values()].sort((a, b) => b.visits + b.views + b.quotes * 5 - (a.visits + a.views + a.quotes * 5)).slice(0, 15);
}
