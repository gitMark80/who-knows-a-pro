import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { randomToken, sha256, sqlBatch, sqlOne } from '@/db/runtime';

type ClaimVerification = {
  id: string;
  business_id: string;
  email: string;
  requested_plan: string | null;
  requested_region: string | null;
  requested_trade: string | null;
};

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const token = requestUrl.searchParams.get('token');
  if (!token) return NextResponse.redirect(new URL('/claim?error=invalid', request.url));

  const claim = await sqlOne<ClaimVerification>(
    `SELECT id,business_id,email,requested_plan,requested_region,requested_trade
     FROM claims
     WHERE token_hash = ? AND status IN ('email_sent','approved') AND expires_at > ?
     LIMIT 1`,
    [await sha256(token), Date.now()],
  );
  if (!claim) return NextResponse.redirect(new URL('/claim?error=expired', request.url));

  const session = randomToken();
  const sessionHash = await sha256(session);
  const expiresAt = Date.now() + 30 * 86_400_000;
  await sqlBatch([
    { sql: `UPDATE claims SET status = 'verified' WHERE id = ?`, args: [claim.id] },
    {
      sql: `UPDATE businesses SET owner_email = ?, approved = 1, updated_at = ? WHERE id = ?`,
      args: [claim.email, Date.now(), claim.business_id],
    },
    {
      sql: `INSERT INTO sessions (token_hash,business_id,email,expires_at) VALUES (?,?,?,?)`,
      args: [sessionHash, claim.business_id, claim.email, expiresAt],
    },
  ]);

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
  return NextResponse.redirect(destination);
}
