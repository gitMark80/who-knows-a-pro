import { NextResponse } from 'next/server';
import { config, randomToken, sha256, sqlOne, sqlRun } from '@/db/runtime';
import { emailConfigured, sendEmail } from '@/lib/email';
import { requestOrigin } from '@/lib/site-url';

const genericMessage = 'If that address is authorized, a sign-in link is on the way.';

export async function POST(request: Request) {
  const input = await request.json() as { email?: string; company?: string };
  if (input.company) return NextResponse.json({ message: genericMessage });
  const email = (input.email || '').trim().toLowerCase();
  const adminEmail = config('ADMIN_EMAIL').toLowerCase();
  if (!email || email !== adminEmail) return NextResponse.json({ message: genericMessage });
  if (!emailConfigured()) return NextResponse.json({ error: 'Admin email sign-in is not configured yet.' }, { status: 503 });

  const recent = await sqlOne<{ count: number }>(
    'SELECT COUNT(*) AS count FROM admin_login_tokens WHERE email = ? AND created_at >= ?',
    [email, Date.now() - 60 * 60_000],
  );
  if (Number(recent?.count ?? 0) >= 5) return NextResponse.json({ error: 'Too many sign-in links were requested. Try again later.' }, { status: 429 });

  const token = randomToken();
  const expiresAt = Date.now() + 15 * 60_000;
  await sqlRun(
    'INSERT INTO admin_login_tokens (token_hash,email,expires_at,created_at) VALUES (?,?,?,?)',
    [await sha256(token), email, expiresAt, Date.now()],
  );
  const link = `${requestOrigin(request)}/api/admin/verify?token=${encodeURIComponent(token)}`;
  await sendEmail(email, 'Your Who Knows a Pro admin sign-in link', `<h1>Admin sign in</h1><p><a href="${link}">Open the lead dashboard</a></p><p>This single-use link expires in 15 minutes.</p>`);
  return NextResponse.json({ message: genericMessage });
}
