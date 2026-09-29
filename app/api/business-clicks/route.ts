import { NextResponse } from 'next/server';
import { config, getBusinessProfile, sha256, sqlRun } from '@/db/runtime';

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  const expectedOrigin = `${new URL(request.url).protocol}//${request.headers.get('host') || new URL(request.url).host}`;
  if (!origin || origin !== expectedOrigin || request.headers.get('sec-fetch-site') === 'cross-site') {
    return NextResponse.json({ ok: false }, { status: 403 });
  }
  const agent = (request.headers.get('user-agent') || '').slice(0, 300);
  if (!agent || /bot|crawler|spider|headless|preview|facebookexternalhit/i.test(agent)) return new Response(null, { status: 204 });
  try {
    const body = await request.text();
    if (body.length > 1024) return NextResponse.json({ ok: false }, { status: 413 });
    let input: Record<string, unknown>;
    try { input = JSON.parse(body); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
    if (!input || typeof input.slug !== 'string' || input.slug.length > 220 || !['website', 'phone'].includes(String(input.action)) || !['listing', 'profile'].includes(String(input.source))) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    const result = await getBusinessProfile(input.slug);
    if (!result || result.profile.is_test || result.profile.approved !== 1 || !(input.action === 'website' ? result.profile.website : result.profile.phone)) {
      return NextResponse.json({ ok: false }, { status: 404 });
    }
    const slug = result.profile.main_slug;
    const ip = (request.headers.get('x-vercel-forwarded-for') || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '').split(',')[0].trim();
    if (!ip) return new Response(null, { status: 204 });
    const now = Date.now();
    // One action per business/browser/connection per ten-minute bucket, across both surfaces.
    // The keyed digest expires in usefulness with its bucket; raw IP addresses are not stored.
    const digest = await sha256(`${config('TURSO_AUTH_TOKEN')}|${slug}|${input.action}|${ip}|${agent}|${Math.floor(now / 600000)}`);
    await sqlRun('INSERT OR IGNORE INTO business_clicks (id,business_slug,action,source,created_at) VALUES (?,?,?,?,?)',
      [digest, slug, String(input.action), String(input.source), now]);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Business click tracking failed', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
