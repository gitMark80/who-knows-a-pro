import { NextResponse } from 'next/server';
import { activeRegions, slug, trades } from '@/data/catalog';
import {
  config,
  getBusiness,
  getBusinessProfile,
  randomToken,
  sha256,
  sqlOne,
  sqlRun,
  upsertBusinessRecord,
  type Business,
} from '@/db/runtime';
import { emailConfigured, escapeHtml, sendEmail } from '@/lib/email';
import { requestOrigin } from '@/lib/site-url';

const commonDomains = new Set(['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'aol.com', 'proton.me', 'protonmail.com']);
const normalizeDomain = (value: string) => value.toLowerCase().replace(/^www\./, '');

function websiteDomain(value: string) {
  if (!value) return '';
  try {
    const parsed = new URL(value);
    return ['http:', 'https:'].includes(parsed.protocol) ? normalizeDomain(parsed.hostname) : '';
  } catch {
    return '';
  }
}

export async function POST(request: Request) {
  try {
    const input = await request.json() as Record<string, string>;
    if (input.companyFax) return NextResponse.json({ message: 'Your request was received.' });

    const contactName = (input.contactName || '').trim().slice(0, 120);
    const email = (input.email || '').trim().toLowerCase().slice(0, 254);
    const businessName = (input.businessName || '').trim().slice(0, 180);
    const website = (input.website || '').trim().slice(0, 500);
    const note = (input.note || '').trim().slice(0, 1_500);
    const location = (input.location || '').trim().slice(0, 300);
    const region = (input.region || '').trim();
    const trade = (input.trade || '').trim();
    const requestedPlan = input.requestedPlan === 'featured' || input.requestedPlan === 'enhanced' ? input.requestedPlan : null;
    const requestedRegion = activeRegions.some((item) => item.slug === input.requestedRegion) ? input.requestedRegion : null;
    const requestedTrade = trades.some((item) => item.slug === input.requestedTrade) ? input.requestedTrade : null;

    if (!contactName || !email || !businessName || !email.includes('@')) {
      return NextResponse.json({ error: 'Complete the required fields.' }, { status: 400 });
    }

    let business = input.businessId ? await getBusiness(input.businessId) : null;
    const now = Date.now();
    const businessId = business?.id || crypto.randomUUID();
    const recent = await sqlOne<{ id: string }>(
      'SELECT id FROM claims WHERE email = ? AND business_id = ? AND created_at > ? LIMIT 1',
      [email, businessId, now - 86_400_000],
    );
    if (recent) return NextResponse.json({ error: 'A claim for this business was already submitted with that email today.' }, { status: 429 });

    if (!business) {
      if (!website || !location) {
        return NextResponse.json({ error: 'Add the website and service area so we can verify the request.' }, { status: 400 });
      }
      if (!activeRegions.some((item) => item.slug === region) || !trades.some((item) => item.slug === trade)) {
        return NextResponse.json({ error: 'Choose a valid region and category.' }, { status: 400 });
      }
      let parsedWebsite: URL;
      try {
        parsedWebsite = new URL(website);
        if (!['http:', 'https:'].includes(parsedWebsite.protocol)) throw new Error('Unsupported protocol');
      } catch {
        return NextResponse.json({ error: 'Enter a valid business website.' }, { status: 400 });
      }

      const requestedSlug = `${slug(businessName)}-${region}-${trade}`;
      const existingSlug = await getBusiness(requestedSlug);
      const businessSlug = existingSlug ? `${requestedSlug}-${businessId.slice(0, 6)}` : requestedSlug;
      const requestedMainSlug = slug(businessName);
      const existingProfile = await getBusinessProfile(requestedMainSlug);
      const requestedDomain = normalizeDomain(parsedWebsite.hostname);
      const existingDomain = existingProfile ? websiteDomain(existingProfile.profile.website) : '';
      const mainSlug = existingProfile && existingDomain !== requestedDomain
        ? `${requestedMainSlug}-${slug(requestedDomain)}`
        : requestedMainSlug;

      business = {
        id: businessId,
        name: businessName,
        slug: businessSlug,
        main_slug: mainSlug,
        region,
        trade,
        location,
        summary: '',
        website,
        source_url: website,
        source_verified_at: null,
        public_email: null,
        email_source_url: null,
        email_verified_at: null,
        phone: null,
        address: null,
        service_area: location,
        hours: null,
        specialties: null,
        year_founded: null,
        license_number: null,
        logo_url: null,
        photo_urls: '[]',
        owner_email: null,
        tier: 'free',
        stripe_customer_id: null,
        stripe_subscription_id: null,
        approved: 0,
        updated_at: now,
      } satisfies Business;
    }

    await upsertBusinessRecord(business);
    const businessWebsiteDomain = websiteDomain(business.website);
    const emailDomain = normalizeDomain(email.split('@')[1] || '');
    const domainsMatch = Boolean(businessWebsiteDomain) && (
      emailDomain === businessWebsiteDomain
      || businessWebsiteDomain.endsWith(`.${emailDomain}`)
      || emailDomain.endsWith(`.${businessWebsiteDomain}`)
    );
    const claimId = crypto.randomUUID();

    if (domainsMatch && !commonDomains.has(emailDomain)) {
      if (!emailConfigured()) {
        return NextResponse.json({ error: 'Email verification is still being connected. Please try again after setup is complete.' }, { status: 503 });
      }
      const token = randomToken();
      await sqlRun(
        `INSERT INTO claims
          (id,business_id,email,contact_name,note,status,token_hash,expires_at,requested_plan,requested_region,requested_trade,created_at)
         VALUES (?,?,?,?,?,'email_sent',?,?,?,?,?,?)`,
        [
          claimId, businessId, email, contactName, note, await sha256(token), now + 86_400_000,
          requestedPlan, requestedRegion, requestedTrade, now,
        ],
      );
      const link = `${requestOrigin(request)}/api/verify-claim?token=${encodeURIComponent(token)}`;
      await sendEmail(email, `Verify your ${business.name} profile`, verificationEmail(business.name, link));
      return NextResponse.json({ message: `Check ${email} for a verification link. The link expires in 24 hours.` });
    }

    await sqlRun(
      `INSERT INTO claims
        (id,business_id,email,contact_name,note,status,requested_plan,requested_region,requested_trade,created_at)
       VALUES (?,?,?,?,?,'manual_review',?,?,?,?)`,
      [claimId, businessId, email, contactName, note, requestedPlan, requestedRegion, requestedTrade, now],
    );
    const adminEmail = config('ADMIN_EMAIL');
    if (adminEmail && emailConfigured()) {
      try {
        await sendEmail(
          adminEmail,
          `Claim review: ${business.name}`,
          `<p>${escapeHtml(contactName)} (${escapeHtml(email)}) requested access to <strong>${escapeHtml(business.name)}</strong>.</p><p>${escapeHtml(note || 'No note supplied.')}</p><p><a href="${requestOrigin(request)}/admin">Review request</a></p>`,
        );
      } catch (error) {
        console.error('Could not send claim review notification', error);
      }
    }
    return NextResponse.json({ message: 'Your request needs an ownership review because the email address does not match the business website. We will email you when it is approved.' });
  } catch (error) {
    console.error('Claim submission failed', error);
    return NextResponse.json({ error: 'We could not submit the claim right now.' }, { status: 500 });
  }
}

function verificationEmail(name: string, link: string) {
  return `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto"><h1>Verify your business profile</h1><p>Use the button below to confirm that you represent <strong>${escapeHtml(name)}</strong>.</p><p><a href="${link}" style="display:inline-block;background:#ec7d2c;color:white;padding:12px 18px;border-radius:8px;text-decoration:none;font-weight:bold">Verify business</a></p><p>This link expires in 24 hours.</p></div>`;
}
