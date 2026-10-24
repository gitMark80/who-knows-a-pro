import { NextResponse } from 'next/server';
import { getBusinessProfile, sha256, sqlRun } from '@/db/runtime';
import { optedOut, recordEvent } from '@/lib/analytics';
import { clientIp, isAutomatedUserAgent, requestCountry, sameOrigin } from '@/lib/security';

export async function POST(request: Request) {
  // Owners see these numbers on their dashboard, so self-identified bots and off-site posts are not counted.
  if (!sameOrigin(request)) return NextResponse.json({ ok: false }, { status: 403 });
  const userAgent = (request.headers.get('user-agent') || '').slice(0, 300);
  if (isAutomatedUserAgent(userAgent) || optedOut(request)) return new Response(null, { status: 204 });
  try {
    const body = await request.text();
    if (body.length > 1_024) return NextResponse.json({ ok: false }, { status: 413 });
    const input = JSON.parse(body) as { slug?: string; wd?: boolean };
    const requested = (input.slug || '').trim().slice(0, 220);
    const result = requested ? await getBusinessProfile(requested) : null;
    if (!result || result.profile.is_test) return NextResponse.json({ ok: false }, { status: 404 });
    if (input.wd === true) return new Response(null, { status: 204 });
    const slug = result.profile.main_slug;
    const ip = clientIp(request);
    const hour = Math.floor(Date.now() / 3_600_000);
    const viewerHash = await sha256(`${slug}|${ip}|${userAgent}|${hour}`);
    const inserted = await sqlRun(
      `INSERT OR IGNORE INTO profile_views (id,business_slug,viewer_hash,viewed_at) VALUES (?,?,?,?)`,
      [`${slug}:${viewerHash}`, slug, viewerHash, Date.now()],
    );
    if (inserted.rowsAffected > 0) {
      await recordEvent('business_profile_viewed', {
        businessSlug: slug,
        region: result.profile.region,
        trade: result.profile.trade,
        country: requestCountry(request),
      });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Profile view tracking failed', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
