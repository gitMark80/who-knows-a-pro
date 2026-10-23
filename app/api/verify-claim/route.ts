import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { randomToken, sha256, sqlBatch, sqlOne } from '@/db/runtime';
import { recordEvent } from '@/lib/analytics';
import { clientIp, HOUR, overLimit, requestCountry, sameOrigin } from '@/lib/security';

type ClaimVerification = {
  id: string;
  business_id: string;
  email: string;
  status: string;
  requested_plan: string | null;
  requested_region: string | null;
  requested_trade: string | null;
  owner_email: string | null;
  region: string | null;
  trade: string | null;
  main_slug: string | null;
  slug: string | null;
};

/**
 * Email security scanners (Outlook Safe Links, Proofpoint, Mimecast) open links before the
 * recipient does. A GET therefore only shows a confirmation page; the token is consumed by
 * the POST that a person submits from that page. Links in emails already sent keep working.
 */
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token') || '';
  const destination = new URL('/claim/verify', request.url);
  if (token) destination.searchParams.set('token', token);
  return NextResponse.redirect(destination, 303);
}

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  if (!sameOrigin(request)) return NextResponse.redirect(new URL('/claim?error=invalid', request.url), 303);
  if (await overLimit({ bucket: 'verify-ip-hour', id: clientIp(request), limit: 30, windowMs: HOUR })) {
    return NextResponse.redirect(new URL('/claim?error=expired', request.url), 303);
  }
  let token = '';
  try { token = String((await request.formData()).get('token') || ''); } catch {}
  if (!token || token.length > 200) return NextResponse.redirect(new URL('/claim?error=invalid', request.url), 303);

  const claim = await sqlOne<ClaimVerification>(
    `SELECT claims.id,claims.business_id,claims.email,claims.status,claims.requested_plan,claims.requested_region,
            claims.requested_trade,businesses.owner_email,businesses.region,businesses.trade,businesses.main_slug,businesses.slug
     FROM claims LEFT JOIN businesses ON businesses.id = claims.business_id
     WHERE claims.token_hash = ? AND claims.status IN ('email_sent','approved') AND claims.expires_at > ?
     LIMIT 1`,
    [await sha256(token), Date.now()],
  );
  if (!claim) return NextResponse.redirect(new URL('/claim?error=expired', request.url), 303);

  // A domain-verified claim may not silently take over a listing someone else already owns.
  // Ownership transfers happen only through an admin-approved claim.
  const owner = (claim.owner_email || '').toLowerCase();
  if (claim.status === 'email_sent' && owner && owner !== claim.email.toLowerCase()) {
    return NextResponse.redirect(new URL('/claim?error=claimed', request.url), 303);
  }

  const session = randomToken();
  const sessionHash = await sha256(session);
  const expiresAt = Date.now() + 30 * 86_400_000;
  const now = Date.now();
  await sqlBatch([
    { sql: `UPDATE claims SET status = 'verified', token_hash = NULL WHERE id = ?`, args: [claim.id] },
    {
      sql: `UPDATE businesses SET owner_email = ?, approved = 1, updated_at = ? WHERE id = ?`,
      args: [claim.email, now, claim.business_id],
    },
    // An approved transfer signs out any previous owner.
    { sql: `DELETE FROM sessions WHERE business_id = ? AND LOWER(email) <> LOWER(?)`, args: [claim.business_id, claim.email] },
    {
      sql: `INSERT INTO sessions (token_hash,business_id,email,expires_at) VALUES (?,?,?,?)`,
      args: [sessionHash, claim.business_id, claim.email, expiresAt],
    },
  ]);

  if (owner !== claim.email.toLowerCase()) {
    await recordEvent('claim_verified', {
      region: claim.region,
      trade: claim.trade,
      businessSlug: claim.main_slug || claim.slug,
      plan: claim.requested_plan,
      detail: claim.status === 'approved' ? 'admin-approved' : 'email-domain',
      country: requestCountry(request),
    });
  }

  (await cookies()).set('pro_session', session, {
    httpOnly: true,
    secure: requestUrl.protocol === 'https:',
    sameSite: 'lax',
    path: '/',
    expires: new Date(expiresAt),
  });

  const destination = new URL('/dashboard', request.url);
  destination.searchParams.set('claimed', '1');
  if (claim.requested_plan === 'featured' || claim.requested_plan === 'enhanced') destination.searchParams.set('plan', claim.requested_plan);
  if (claim.requested_region) destination.searchParams.set('region', claim.requested_region);
  if (claim.requested_trade) destination.searchParams.set('trade', claim.requested_trade);
  return NextResponse.redirect(destination, 303);
}
