import { NextResponse } from 'next/server';
import { activeRegions, trades } from '@/data/catalog';
import { clientEvents, cleanPath, cleanToken, recordEvent } from '@/lib/analytics';
import { clientIp, HOUR, isAutomatedUserAgent, overLimit, requestCountry, sameOrigin } from '@/lib/security';

const allowed = new Set<string>(clientEvents);

/** Page-level funnel beacons. Server-confirmed conversions are recorded by their own routes. */
export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ ok: false }, { status: 403 });
  if (isAutomatedUserAgent(request.headers.get('user-agent'))) return new Response(null, { status: 204 });
  const body = await request.text();
  if (body.length > 1_024) return NextResponse.json({ ok: false }, { status: 413 });
  let input: Record<string, unknown>;
  try { input = JSON.parse(body) as Record<string, unknown>; } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
  const event = String(input.event || '');
  if (!allowed.has(event)) return NextResponse.json({ ok: false }, { status: 400 });
  if (await overLimit({ bucket: 'events-ip-hour', id: clientIp(request), limit: 120, windowMs: HOUR })) {
    return new Response(null, { status: 204 });
  }
  const region = activeRegions.some((item) => item.slug === input.region) ? String(input.region) : null;
  const trade = trades.some((item) => item.slug === input.trade) ? String(input.trade) : null;
  const plan = input.plan === 'enhanced' || input.plan === 'featured' ? input.plan : null;
  await recordEvent(event as (typeof clientEvents)[number], {
    path: cleanPath(input.path),
    region,
    trade,
    plan,
    businessSlug: cleanToken(input.business, 220),
    country: requestCountry(request),
    automation: input.wd === true,
  });
  return NextResponse.json({ ok: true });
}
