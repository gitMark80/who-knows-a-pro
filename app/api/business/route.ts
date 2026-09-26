import { NextResponse } from 'next/server';
import { currentBusiness } from '@/db/auth';
import { sqlRun } from '@/db/runtime';

const optional = (value: string | undefined, limit: number) => {
  const cleaned = (value || '').trim();
  return cleaned ? cleaned.slice(0, limit) : null;
};

export async function PATCH(request: Request) {
  const business = await currentBusiness();
  if (!business) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  const input = await request.json() as Record<string, string>;
  const name = business.is_test ? 'WKAP Test Business' : (input.name || '').trim().slice(0, 180);
  const phone = optional(input.phone, 80);
  const website = (input.website || '').trim().slice(0, 500);
  const location = (input.location || '').trim().slice(0, 300);
  const summary = (input.summary || '').trim().slice(0, 900);
  const address = optional(input.address, 300);
  const serviceArea = optional(input.serviceArea, 500);
  const hours = optional(input.hours, 1_000);
  const specialties = optional(input.specialties, 800);
  const licenseNumber = optional(input.licenseNumber, 120);
  const yearText = (input.yearFounded || '').trim();
  const yearFounded = yearText ? Number.parseInt(yearText, 10) : null;

  if (!name || !website || !location) {
    return NextResponse.json({ error: 'Add the business name, website, and directory city.' }, { status: 400 });
  }
  try {
    const parsed = new URL(website);
    if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Unsupported URL');
  } catch {
    return NextResponse.json({ error: 'Enter a valid http or https website address.' }, { status: 400 });
  }
  if (yearFounded !== null && (!/^\d{4}$/.test(yearText) || yearFounded < 1600 || yearFounded > new Date().getFullYear())) {
    return NextResponse.json({ error: 'Enter a valid four-digit founding year.' }, { status: 400 });
  }

  await sqlRun(
    `UPDATE businesses SET
      name = ?, phone = ?, website = ?, location = ?, summary = ?, address = ?, service_area = ?,
      hours = ?, specialties = ?, year_founded = ?, license_number = ?, updated_at = ?
     WHERE id = ?`,
    [
      name, phone, website, location, summary, address, serviceArea, hours, specialties,
      yearFounded, licenseNumber, Date.now(), business.id,
    ],
  );
  return NextResponse.json({ ok: true });
}
