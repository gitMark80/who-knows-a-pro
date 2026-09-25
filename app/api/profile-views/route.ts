import { NextResponse } from 'next/server';
import { getBusinessProfile, sha256, sqlRun } from '@/db/runtime';

export async function POST(request: Request) {
  try {
    const input = await request.json() as { slug?: string };
    const slug = (input.slug || '').trim().slice(0, 220);
    if (!slug || !await getBusinessProfile(slug)) return NextResponse.json({ ok: false }, { status: 404 });
    const ip = (request.headers.get('x-vercel-forwarded-for') || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown').split(',')[0].trim();
    const userAgent = (request.headers.get('user-agent') || 'unknown').slice(0, 300);
    const hour = Math.floor(Date.now() / 3_600_000);
    const viewerHash = await sha256(`${slug}|${ip}|${userAgent}|${hour}`);
    await sqlRun(
      `INSERT OR IGNORE INTO profile_views (id,business_slug,viewer_hash,viewed_at) VALUES (?,?,?,?)`,
      [`${slug}:${viewerHash}`, slug, viewerHash, Date.now()],
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Profile view tracking failed', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
