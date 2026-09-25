import { NextResponse } from 'next/server';
import { activeRegions, trades } from '@/data/catalog';
import { currentAdminEmail } from '@/db/auth';
import { listLeads } from '@/db/revenue';

export async function GET(request: Request) {
  if (!await currentAdminEmail()) return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  const { searchParams } = new URL(request.url);
  const region = activeRegions.some((item) => item.slug === searchParams.get('region')) ? searchParams.get('region') || undefined : undefined;
  const trade = trades.some((item) => item.slug === searchParams.get('trade')) ? searchParams.get('trade') || undefined : undefined;
  const leads = await listLeads({ region, trade, limit: 5_000 });
  const header = ['created_at', 'name', 'email', 'phone', 'zip', 'preferred_contact_method', 'job_description', 'city', 'category', 'page_url', 'routed', 'routed_business_slug', 'routed_at', 'owner_notification_status', 'business_notification_status', 'ip_address'];
  const rows = leads.map((lead) => [
    new Date(lead.created_at).toISOString(), lead.name, lead.email, lead.phone, lead.zip,
    lead.preferred_contact_method, lead.job_description, lead.region, lead.trade, lead.page_url,
    lead.routed ? 'yes' : 'no', lead.routed_business_slug || '', lead.routed_at ? new Date(lead.routed_at).toISOString() : '',
    lead.owner_notification_status, lead.business_notification_status, lead.ip_address,
  ]);
  const csv = [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n');
  return new NextResponse(csv, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="who-knows-a-pro-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      'cache-control': 'no-store',
    },
  });
}

function csvCell(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}
