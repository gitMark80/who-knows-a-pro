import { NextResponse } from 'next/server';
import { activeRegions, trades } from '@/data/catalog';
import { currentBusiness } from '@/db/auth';
import { getBusinessProfile } from '@/db/runtime';
import {
  attachCheckoutToFeaturedSlot,
  getActiveSubscriptionForBusiness,
  releaseFeaturedReservation,
  reserveFeaturedSlot,
} from '@/db/revenue';
import { requestOrigin } from '@/lib/site-url';
import { priceForPlan, stripe, stripeTaxEnabled } from '@/lib/stripe';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const business = await currentBusiness();
  if (!business?.owner_email) return NextResponse.json({ error: 'Claim your business before checkout.' }, { status: 401 });

  const input = await request.json() as { plan?: string; tier?: string; region?: string; trade?: string };
  const rawPlan = input.plan || input.tier;
  const plan = rawPlan === 'sponsored' ? 'featured' : rawPlan;
  if (plan !== 'enhanced' && plan !== 'featured') {
    return NextResponse.json({ error: 'Choose a valid plan.' }, { status: 400 });
  }

  const businessSlug = business.main_slug || business.slug;
  const existingSubscription = await getActiveSubscriptionForBusiness(businessSlug);
  if (existingSubscription) {
    return NextResponse.json({ error: 'This business already has an active subscription. Use Manage billing before choosing another plan.' }, { status: 409 });
  }

  let reservationId: string | null = null;
  let featuredRegion: string | null = null;
  let featuredTrade: string | null = null;
  if (plan === 'featured') {
    featuredRegion = (input.region || '').trim();
    featuredTrade = (input.trade || '').trim();
    if (!activeRegions.some((item) => item.slug === featuredRegion) || !trades.some((item) => item.slug === featuredTrade)) {
      return NextResponse.json({ error: 'Choose a valid city and category for the Featured spot.' }, { status: 400 });
    }
    const profile = await getBusinessProfile(businessSlug);
    const qualifies = profile?.profile.placements.some((placement) => placement.region === featuredRegion && placement.trade === featuredTrade);
    if (!qualifies) {
      return NextResponse.json({ error: 'Featured placement is available only on a page where this business is listed.' }, { status: 400 });
    }
    const reservation = await reserveFeaturedSlot({
      region: featuredRegion,
      trade: featuredTrade,
      businessId: business.id,
      businessSlug,
    });
    if (!reservation) {
      return NextResponse.json({
        error: 'That Featured spot is already taken or reserved. Enhanced is still available.',
        alternativePlan: 'enhanced',
      }, { status: 409 });
    }
    reservationId = reservation.id;
  }

  try {
    const origin = requestOrigin(request);
    const client = stripe();
    const session = await client.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceForPlan(plan), quantity: 1 }],
      success_url: `${origin}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard?checkout=cancelled`,
      client_reference_id: business.id,
      customer: business.stripe_customer_id || undefined,
      customer_email: business.stripe_customer_id ? undefined : business.owner_email,
      allow_promotion_codes: true,
      automatic_tax: { enabled: stripeTaxEnabled() },
      metadata: {
        business_id: business.id,
        business_slug: businessSlug,
        plan,
        featured_region: featuredRegion || '',
        featured_trade: featuredTrade || '',
      },
      subscription_data: {
        metadata: {
          business_id: business.id,
          business_slug: businessSlug,
          plan,
          featured_region: featuredRegion || '',
          featured_trade: featuredTrade || '',
        },
      },
    });
    if (!session.url) throw new Error('Stripe did not return a Checkout URL');
    if (reservationId) await attachCheckoutToFeaturedSlot(reservationId, session.id);
    return NextResponse.json({ url: session.url });
  } catch (error) {
    if (reservationId) await releaseFeaturedReservation(reservationId);
    console.error('Stripe Checkout creation failed', error);
    return NextResponse.json({ error: 'Checkout is not available yet. Verify the Stripe test connection and try again.' }, { status: 503 });
  }
}
