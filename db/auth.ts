import { cookies } from 'next/headers';
import { config, databaseConfigured, getBusiness, sha256, sqlOne, type Business } from '@/db/runtime';

export async function currentBusiness(): Promise<Business | null> {
  if (!databaseConfigured()) return null;
  const token = (await cookies()).get('pro_session')?.value;
  if (!token) return null;
  const session = await sqlOne<{ business_id: string }>(
    'SELECT business_id FROM sessions WHERE token_hash = ? AND expires_at > ?',
    [await sha256(token), Date.now()],
  );
  if (!session) return null;
  return getBusiness(session.business_id);
}

export async function currentAdminEmail(): Promise<string | null> {
  if (!databaseConfigured()) return null;
  const token = (await cookies()).get('admin_session')?.value;
  if (!token) return null;
  const session = await sqlOne<{ email: string }>(
    'SELECT email FROM admin_sessions WHERE token_hash = ? AND expires_at > ?',
    [await sha256(token), Date.now()],
  );
  if (!session) return null;
  const adminEmail = config('ADMIN_EMAIL').toLowerCase();
  return session.email.toLowerCase() === adminEmail ? session.email : null;
}
