import { NextResponse } from 'next/server';
import { regions, trades } from '@/data/catalog';
import { searchDirectory } from '@/db/runtime';
import { clientIp, HOUR, isAutomatedUserAgent, overLimit } from '@/lib/security';

const headers = { 'cache-control': 'private, no-store', 'x-robots-tag': 'noindex' };

/** Lets owners find their existing listing on /claim. Returns only public listing names and places. */
export async function GET(request: Request) {
  const query = (new URL(request.url).searchParams.get('q') || '').trim().slice(0, 80);
  if (query.length < 2 || isAutomatedUserAgent(request.headers.get('user-agent'))) return NextResponse.json({ results: [] }, { headers });
  if (await overLimit({ bucket: 'business-search-ip-hour', id: clientIp(request), limit: 120, windowMs: HOUR })) {
    return NextResponse.json({ results: [], error: 'Too many searches. Try again shortly.' }, { status: 429, headers });
  }
  const results = (await searchDirectory(query)).map((item) => ({
    slug: item.slug,
    name: item.name,
    claimed: item.claimed,
    places: item.regions.map((slug) => regions.find((region) => region.slug === slug)?.name || slug).slice(0, 3),
    categories: item.trades.map((slug) => trades.find((trade) => trade.slug === slug)?.name || slug).slice(0, 3),
  }));
  return NextResponse.json({ results }, { headers });
}
