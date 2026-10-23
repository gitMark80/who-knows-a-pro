import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { randomToken, sha256, sqlBatch, sqlOne } from '@/db/runtime';
import { clientIp, HOUR, overLimit, sameOrigin } from '@/lib/security';

/** GET only shows a confirmation page so email link scanners cannot consume the single-use token. */
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token') || '';
  const destination = new URL('/admin/verify', request.url);
  if (token) destination.searchParams.set('token', token);
  return NextResponse.redirect(destination, 303);
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  if (!sameOrigin(request)) return NextResponse.redirect(new URL('/admin?error=invalid', request.url), 303);
  if (await overLimit({ bucket: 'admin-verify-ip-hour', id: clientIp(request), limit: 20, windowMs: HOUR })) {
    return NextResponse.redirect(new URL('/admin?error=expired', request.url), 303);
  }
  let token = '';
  try { token = String((await request.formData()).get('token') || ''); } catch {}
  if (!token || token.length > 200) return NextResponse.redirect(new URL('/admin?error=invalid', request.url), 303);
  const record = await sqlOne<{ token_hash: string; email: string }>(
    'SELECT token_hash,email FROM admin_login_tokens WHERE token_hash = ? AND used_at IS NULL AND expires_at > ? LIMIT 1',
    [await sha256(token), Date.now()],
  );
  if (!record) return NextResponse.redirect(new URL('/admin?error=expired', request.url), 303);
  const session = randomToken();
  const expiresAt = Date.now() + 7 * 86_400_000;
  await sqlBatch([
    { sql: 'UPDATE admin_login_tokens SET used_at = ? WHERE token_hash = ?', args: [Date.now(), record.token_hash] },
    { sql: 'INSERT INTO admin_sessions (token_hash,email,expires_at) VALUES (?,?,?)', args: [await sha256(session), record.email, expiresAt] },
  ]);
  (await cookies()).set('admin_session', session, { httpOnly: true, secure: url.protocol === 'https:', sameSite: 'lax', path: '/', expires: new Date(expiresAt) });
  return NextResponse.redirect(new URL('/admin', request.url), 303);
}
