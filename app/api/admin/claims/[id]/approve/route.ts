import { NextResponse } from 'next/server';
import { currentAdminEmail } from '@/db/auth';
import { randomToken, sha256, sqlOne, sqlRun } from '@/db/runtime';
import { escapeHtml, sendEmail } from '@/lib/email';
import { requestOrigin } from '@/lib/site-url';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await currentAdminEmail()) return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  const { id } = await params;
  const claim = await sqlOne<{ id: string; email: string; business_name: string }>(
    `SELECT claims.id,claims.email,businesses.name AS business_name
     FROM claims JOIN businesses ON claims.business_id = businesses.id
     WHERE claims.id = ? AND claims.status = 'manual_review' LIMIT 1`,
    [id],
  );
  if (!claim) return NextResponse.redirect(new URL('/admin', request.url), 303);
  const token = randomToken();
  await sqlRun(
    `UPDATE claims SET status = 'approved', token_hash = ?, expires_at = ? WHERE id = ?`,
    [await sha256(token), Date.now() + 86_400_000, id],
  );
  const link = `${requestOrigin(request)}/api/verify-claim?token=${encodeURIComponent(token)}`;
  await sendEmail(claim.email, `Your ${claim.business_name} claim was approved`, `<h1>Your business claim is approved</h1><p>Your ownership request for <strong>${escapeHtml(claim.business_name)}</strong> on Who Knows a Pro was approved. Use the secure link below to finish signing in and manage this listing.</p><p><a href="${link}">Open your business dashboard</a></p><p>This single-use link expires in 24 hours. Keep it private. Your free claim does not purchase a subscription; paid upgrades are optional.</p><p>If you did not request this claim, contact us instead of using the link.</p>`);
  return NextResponse.redirect(new URL('/admin', request.url), 303);
}
