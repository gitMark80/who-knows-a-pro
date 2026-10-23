import { NextResponse } from 'next/server';
import { activeRegions, slug, trades } from '@/data/catalog';
import {
  config,
  findBusinessByWebsiteDomain,
  getBusiness,
  getBusinessProfile,
  randomToken,
  sha256,
  sqlOne,
  sqlRun,
  upsertBusinessRecord,
  type Business,
} from '@/db/runtime';
import { recordEvent } from '@/lib/analytics';
import { emailMatchesWebsite, isSharedHost, normalizeDomain, websiteDomain } from '@/lib/domains';
import { emailConfigured, escapeHtml, sendEmail } from '@/lib/email';
import {
  anyOverLimit,
  clientIp,
  DAY,
  HOUR,
  overLimit,
  requestCountry,
  sameOrigin,
  submittedTooFast,
  verifyTurnstile,
} from '@/lib/security';
import { requestOrigin } from '@/lib/site-url';

const receivedMessage = 'Your request was received.';
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  try {
    if (!sameOrigin(request)) return NextResponse.json({ error: 'Submit the claim from whoknowsapro.com.' }, { status: 403 });
    let input: Record<string, string>;
    try { input = await request.json() as Record<string, string>; } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }); }
    const ip = clientIp(request);
    const country = requestCountry(request);

    // Honeypot and instant submissions get a quiet, generic success so bots learn nothing.
    if (input.companyFax || submittedTooFast(input.formMs)) {
      await recordEvent('form_blocked', { detail: input.companyFax ? 'claim-honeypot' : 'claim-too-fast', country, automation: true, attribution: null });
      return NextResponse.json({ message: receivedMessage });
    }
    if (await anyOverLimit([
      { bucket: 'claim-ip-hour', id: ip, limit: 5, windowMs: HOUR },
      { bucket: 'claim-ip-day', id: ip, limit: 15, windowMs: DAY },
    ])) {
      await recordEvent('form_blocked', { detail: 'claim-rate-limit', country, attribution: null });
      return NextResponse.json({ error: 'Too many claim requests came from this connection. Please try again later or email hello@whoknowsapro.com.' }, { status: 429 });
    }
    if (!await verifyTurnstile(input.turnstileToken, ip, 'claim')) {
      await recordEvent('form_blocked', { detail: 'claim-turnstile', country, attribution: null });
      return NextResponse.json({ error: 'Please complete the security check and submit again.' }, { status: 400 });
    }

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

    if (!contactName || !email || !businessName || !emailPattern.test(email)) {
      return NextResponse.json({ error: 'Complete the required fields with a valid email address.' }, { status: 400 });
    }

    const testRequested = input.businessId === 'wkap-live-billing-test' || slug(businessName) === 'wkap-test-business';
    let business = testRequested ? await getBusiness('wkap-live-billing-test') : input.businessId ? await getBusiness(input.businessId) : null;
    if (testRequested && !business) {
      return NextResponse.json({ error: 'The private billing test has been removed or is unavailable.' }, { status: 404 });
    }
    if (business?.is_test && email !== 'hello@whoknowsapro.com') {
      return NextResponse.json({ error: 'This private test profile is reserved for the site owner.' }, { status: 403 });
    }

    let matchedExisting = false;
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
        return NextResponse.json({ error: 'Enter a valid business website, including https://.' }, { status: 400 });
      }
      const requestedDomain = normalizeDomain(parsedWebsite.hostname);

      // Duplicate prevention: a listing on the same website domain is the same business.
      if (!isSharedHost(requestedDomain)) {
        business = await findBusinessByWebsiteDomain(requestedDomain, region, trade);
        matchedExisting = Boolean(business);
      }

      if (!business) {
        const businessId = crypto.randomUUID();
        const requestedSlug = `${slug(businessName)}-${region}-${trade}`;
        const existingSlug = await getBusiness(requestedSlug);
        const businessSlug = existingSlug ? `${requestedSlug}-${businessId.slice(0, 6)}` : requestedSlug;
        const requestedMainSlug = slug(businessName);
        const existingProfile = await getBusinessProfile(requestedMainSlug);
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
          updated_at: Date.now(),
        } satisfies Business;
      }
    }

    // Per-recipient and per-listing limits stop the form being used to flood a business inbox.
    if (await anyOverLimit([
      { bucket: 'claim-email-day', id: email, limit: 4, windowMs: DAY },
      { bucket: 'claim-business-day', id: business.id, limit: 8, windowMs: DAY },
    ])) {
      return NextResponse.json({ error: 'Several claim requests were already sent for this business today. Check your inbox (and spam folder) for the latest link, or try again tomorrow.' }, { status: 429 });
    }

    await upsertBusinessRecord(business);
    const businessId = business.id;
    const businessSlug = business.main_slug || business.slug;
    const now = Date.now();
    const claimId = crypto.randomUUID();
    const currentOwner = (business.owner_email || '').toLowerCase();
    const isReturningOwner = Boolean(currentOwner) && currentOwner === email;
    const claimedByOtherOwner = Boolean(currentOwner) && currentOwner !== email;
    const autoVerifiable = isReturningOwner || (!claimedByOtherOwner && emailMatchesWebsite(email, business.website));
    const eventBase = { region: business.region, trade: business.trade, businessSlug, plan: requestedPlan, country };

    if (autoVerifiable) {
      if (!emailConfigured()) {
        return NextResponse.json({ error: 'Email verification is temporarily unavailable. Please try again shortly.' }, { status: 503 });
      }
      const token = randomToken();
      await sqlRun(
        `UPDATE claims SET status = 'superseded' WHERE business_id = ? AND email = ? AND status = 'email_sent'`,
        [businessId, email],
      );
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
      await sendEmail(email, isReturningOwner ? `Sign in to manage ${business.name}` : `Verify your ${business.name} profile`, verificationEmail(business.name, link, isReturningOwner));
      await recordEvent('claim_submitted', { ...eventBase, detail: isReturningOwner ? 'owner-sign-in' : 'auto-verify' });
      return NextResponse.json({
        message: `${matchedExisting ? `We found your existing listing for ${business.name}. ` : ''}Check ${email} for a secure link. It expires in 24 hours.`,
      });
    }

    const pending = await sqlOne<{ id: string }>(
      `SELECT id FROM claims WHERE business_id = ? AND email = ? AND status = 'manual_review' LIMIT 1`,
      [businessId, email],
    );
    if (!pending) {
      const reviewNote = claimedByOtherOwner ? `[Listing is already claimed by another email address.] ${note}`.trim() : note;
      await sqlRun(
        `INSERT INTO claims
          (id,business_id,email,contact_name,note,status,requested_plan,requested_region,requested_trade,created_at)
         VALUES (?,?,?,?,?,'manual_review',?,?,?,?)`,
        [claimId, businessId, email, contactName, reviewNote.slice(0, 1_500), requestedPlan, requestedRegion, requestedTrade, now],
      );
      const adminEmail = config('ADMIN_EMAIL');
      // Cap admin notifications so a bot wave cannot flood the inbox; the queue still shows every request.
      const adminMailCapped = await overLimit({ bucket: 'claim-admin-mail-day', id: 'global', limit: 25, windowMs: DAY });
      if (adminEmail && emailConfigured() && !adminMailCapped) {
        try {
          await sendEmail(
            adminEmail,
            `Claim review: ${business.name}`,
            `<h1>Business claim needs review</h1><p>This is an admin notification from Who Knows a Pro. ${claimedByOtherOwner ? '<strong>This listing is already claimed by a different email address.</strong> Approving will transfer ownership and sign the current owner out.' : 'The submitted email domain did not qualify for automatic verification.'} Review ownership before approving access.</p><p>${escapeHtml(contactName)} (${escapeHtml(email)}) requested access to <strong>${escapeHtml(business.name)}</strong> (${escapeHtml(business.website)}).</p><p>${escapeHtml(note || 'No note supplied.')}</p><p><a href="${requestOrigin(request)}/admin">Review request</a></p>`,
          );
        } catch (error) {
          console.error('Could not send claim review notification', error);
        }
      }
      await recordEvent('claim_submitted', { ...eventBase, detail: claimedByOtherOwner ? 'manual-already-claimed' : 'manual-review' });
    }
    return NextResponse.json({
      message: claimedByOtherOwner
        ? 'This listing is already managed by another verified owner. We will review your request and contact you by email.'
        : 'Your request needs a quick ownership review because the email address does not match the business website. We will email you when it is approved, usually within one business day.',
    });
  } catch (error) {
    console.error('Claim submission failed', error);
    return NextResponse.json({ error: 'We could not submit the claim right now.' }, { status: 500 });
  }
}

function verificationEmail(name: string, link: string, returningOwner: boolean) {
  const heading = returningOwner ? 'Sign in to your business dashboard' : 'Verify your free business claim';
  const intro = returningOwner
    ? `A sign-in link was requested for <strong>${escapeHtml(name)}</strong> on Who Knows a Pro.`
    : `You requested to claim or manage <strong>${escapeHtml(name)}</strong> on Who Knows a Pro. Only continue if you are authorized to represent this business.`;
  return `<h1>${heading}</h1><p>${intro}</p><p>Open the secure link below, then confirm on the page that opens to reach your business dashboard.</p><p><a href="${escapeHtml(link)}" style="display:inline-block;background:#ec7d2c;color:#172b49;padding:12px 18px;border-radius:8px;text-decoration:none;font-weight:bold">Open secure link</a></p><p>This single-use link expires in 24 hours. Keep it private and do not forward it.</p><p>Claiming is free. This does not purchase a plan or charge a card; paid upgrades are optional.</p><p>If you did not request this, ignore this email or contact us.</p>`;
}
