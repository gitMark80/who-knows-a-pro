import { NextResponse } from 'next/server';
import { activeRegions, trades } from '@/data/catalog';
import { config, getBusiness, sqlOne, sqlRun } from '@/db/runtime';
import { getActiveFeaturedSlot } from '@/db/revenue';
import { emailConfigured, escapeHtml, sendEmail } from '@/lib/email';
import { PUBLIC_SITE_URL } from '@/lib/site-url';

const contactMethods = new Set(['email', 'phone', 'either']);

export async function POST(request: Request) {
  try {
    const input = await request.json() as Record<string, string>;
    if (input.companyWebsite) return NextResponse.json({ message: confirmation(false) });

    const name = (input.name || '').trim().slice(0, 120);
    const email = (input.email || '').trim().toLowerCase().slice(0, 254);
    const phone = (input.phone || '').trim().slice(0, 80);
    const zip = (input.zip || '').trim().slice(0, 12);
    const jobDescription = (input.jobDescription || '').trim().slice(0, 1_500);
    const preferredContactMethod = (input.preferredContactMethod || '').trim();
    const region = (input.region || '').trim();
    const trade = (input.trade || '').trim();

    if (!name || !email.includes('@') || !phone || !zip || !jobDescription || !contactMethods.has(preferredContactMethod)) {
      return NextResponse.json({ error: 'Complete each required field.' }, { status: 400 });
    }
    if (!activeRegions.some((item) => item.slug === region) || !trades.some((item) => item.slug === trade)) {
      return NextResponse.json({ error: 'This directory page is not available.' }, { status: 400 });
    }

    const ipAddress = requestIp(request);
    const since = Date.now() - 60 * 60_000;
    const recent = await sqlOne<{ count: number }>(
      'SELECT COUNT(*) AS count FROM leads WHERE ip_address = ? AND created_at >= ?',
      [ipAddress, since],
    );
    const hourlyLimit = Math.max(1, Number.parseInt(config('LEAD_RATE_LIMIT_PER_HOUR') || '5', 10) || 5);
    if (Number(recent?.count ?? 0) >= hourlyLimit) {
      return NextResponse.json({ error: 'Too many quote requests were submitted from this connection. Please try again later.' }, { status: 429 });
    }

    const slot = await getActiveFeaturedSlot(region, trade);
    const featuredBusiness = slot ? await getBusiness(slot.business_id) : null;
    const routed = Boolean(slot && featuredBusiness?.owner_email);
    const createdAt = Date.now();
    const leadId = crypto.randomUUID();
    const siteUrl = (config('SITE_URL') || PUBLIC_SITE_URL).replace(/\/$/, '');
    const pageUrl = `${siteUrl}/${region}/${trade}`;
    await sqlRun(
      `INSERT INTO leads
        (id,name,email,phone,zip,job_description,preferred_contact_method,region,trade,page_url,ip_address,
         routed,routed_business_id,routed_business_slug,routed_at,owner_notification_status,business_notification_status,created_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        leadId, name, email, phone, zip, jobDescription, preferredContactMethod, region, trade, pageUrl,
        ipAddress, routed ? 1 : 0, routed ? featuredBusiness?.id ?? null : null,
        routed ? featuredBusiness?.main_slug || featuredBusiness?.slug || null : null,
        routed ? createdAt : null, 'pending', routed ? 'pending' : 'not_applicable', createdAt,
      ],
    );

    const regionName = activeRegions.find((item) => item.slug === region)?.name || region;
    const tradeName = trades.find((item) => item.slug === trade)?.name || trade;
    const ownerEmail = config('LEAD_NOTIFICATION_EMAIL') || config('ADMIN_EMAIL');
    const emailTasks: Array<Promise<void>> = [];
    if (emailConfigured() && ownerEmail) {
      emailTasks.push(
        sendEmail(ownerEmail, `New quote request: ${tradeName} in ${regionName}`, leadEmail({ name, email, phone, zip, jobDescription, preferredContactMethod, regionName, tradeName, pageUrl, routedTo: featuredBusiness?.name || null }))
          .then(() => sqlRun(`UPDATE leads SET owner_notification_status = 'sent' WHERE id = ?`, [leadId]).then(() => undefined))
          .catch(async (error) => {
            console.error('Lead owner notification failed', error);
            await sqlRun(`UPDATE leads SET owner_notification_status = 'failed' WHERE id = ?`, [leadId]);
          }),
      );
    } else {
      await sqlRun(`UPDATE leads SET owner_notification_status = 'not_configured' WHERE id = ?`, [leadId]);
    }

    if (routed && featuredBusiness?.owner_email && emailConfigured()) {
      emailTasks.push(
        sendEmail(featuredBusiness.owner_email, `New ${tradeName} lead from Who Knows a Pro`, businessLeadEmail({ name, email, phone, zip, jobDescription, preferredContactMethod, regionName, tradeName }))
          .then(() => sqlRun(`UPDATE leads SET business_notification_status = 'sent' WHERE id = ?`, [leadId]).then(() => undefined))
          .catch(async (error) => {
            console.error('Featured-business lead notification failed', error);
            await sqlRun(`UPDATE leads SET business_notification_status = 'failed' WHERE id = ?`, [leadId]);
          }),
      );
    }
    await Promise.all(emailTasks);
    return NextResponse.json({ message: confirmation(routed), routed });
  } catch (error) {
    console.error('Lead submission failed', error);
    return NextResponse.json({ error: 'We could not save your request. Please try again.' }, { status: 500 });
  }
}

function requestIp(request: Request) {
  const value = request.headers.get('x-vercel-forwarded-for')
    || request.headers.get('x-forwarded-for')
    || request.headers.get('x-real-ip')
    || 'unknown';
  return value.split(',')[0].trim().slice(0, 80);
}

function confirmation(routed: boolean) {
  return routed
    ? 'Your request was sent to the featured business immediately. They can contact you using your preferred method; allow one to two business days, although a response is not guaranteed.'
    : 'Your request is saved in the Who Knows a Pro admin queue because this page does not currently have a featured business. We will review it before any referral; response times vary.';
}

type LeadEmailInput = {
  name: string;
  email: string;
  phone: string;
  zip: string;
  jobDescription: string;
  preferredContactMethod: string;
  regionName: string;
  tradeName: string;
};

function leadDetails(input: LeadEmailInput) {
  return `<ul><li><strong>Name:</strong> ${escapeHtml(input.name)}</li><li><strong>Email:</strong> ${escapeHtml(input.email)}</li><li><strong>Phone:</strong> ${escapeHtml(input.phone)}</li><li><strong>ZIP:</strong> ${escapeHtml(input.zip)}</li><li><strong>Preferred contact:</strong> ${escapeHtml(input.preferredContactMethod)}</li></ul><p><strong>Job:</strong><br>${escapeHtml(input.jobDescription).replace(/\n/g, '<br>')}</p>`;
}

function leadEmail(input: LeadEmailInput & { pageUrl: string; routedTo: string | null }) {
  return `<h1>New quote request</h1><p><strong>${escapeHtml(input.tradeName)}</strong> in <strong>${escapeHtml(input.regionName)}</strong></p>${leadDetails(input)}<p><strong>Routing:</strong> ${input.routedTo ? `Sent to ${escapeHtml(input.routedTo)}` : 'Unsold — held in the admin queue'}</p><p><a href="${input.pageUrl}">View the directory page</a></p>`;
}

function businessLeadEmail(input: LeadEmailInput) {
  return `<h1>New lead from Who Knows a Pro</h1><p>This customer requested quotes for <strong>${escapeHtml(input.tradeName)}</strong> in <strong>${escapeHtml(input.regionName)}</strong>.</p>${leadDetails(input)}<p>Please contact the customer directly. Do not share or resell this lead.</p>`;
}
