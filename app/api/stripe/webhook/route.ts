import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { config, sqlOne, sqlRun } from '@/db/runtime';
import {
  getSubscriptionById,
  recomputeBusinessTier,
  releaseFeaturedReservationByCheckout,
  syncFeaturedSlot,
  upsertSubscription,
} from '@/db/revenue';
import { recordEvent } from '@/lib/analytics';
import { stripe } from '@/lib/stripe';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const webhookSecret = config('STRIPE_WEBHOOK_SECRET');
  const signature = request.headers.get('stripe-signature');
  if (!webhookSecret || !signature) return NextResponse.json({ error: 'Stripe webhook is not configured.' }, { status: 503 });

  const payload = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error('Invalid Stripe webhook signature', error);
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
  }

  const handled = await sqlOne<{ id: string }>('SELECT id FROM webhooks WHERE id = ? LIMIT 1', [event.id]);
  if (handled) return NextResponse.json({ received: true, duplicate: true });

  try {
    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      const session = event.data.object;
      const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;
      if (subscriptionId) {
        const subscription = await stripe().subscriptions.retrieve(subscriptionId);
        await syncSubscription(subscription, session.id);
      }
    } else if (event.type === 'checkout.session.expired') {
      await releaseFeaturedReservationByCheckout(event.data.object.id);
    } else if (
      event.type === 'customer.subscription.updated'
      || event.type === 'customer.subscription.deleted'
      || event.type === 'customer.subscription.paused'
      || event.type === 'customer.subscription.resumed'
    ) {
      // Events can arrive out of order; prefer Stripe's current state over the event snapshot.
      await syncSubscription(await currentSubscription(event.data.object));
    } else if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object;
      const subscriptionId = typeof invoice.parent?.subscription_details?.subscription === 'string'
        ? invoice.parent.subscription_details.subscription
        : invoice.parent?.subscription_details?.subscription?.id;
      if (subscriptionId) {
        const subscription = await stripe().subscriptions.retrieve(subscriptionId);
        await syncSubscription(subscription);
      }
    }
    await sqlRun('INSERT INTO webhooks (id,created_at) VALUES (?,?)', [event.id, Date.now()]);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`Stripe webhook ${event.id} failed`, error);
    return NextResponse.json({ error: 'Webhook processing failed.' }, { status: 500 });
  }
}

async function currentSubscription(snapshot: Stripe.Subscription) {
  try {
    return await stripe().subscriptions.retrieve(snapshot.id);
  } catch (error) {
    console.warn(`Could not refresh Stripe subscription ${snapshot.id}; using the event payload`, error instanceof Error ? error.message : error);
    return snapshot;
  }
}

async function syncSubscription(subscription: Stripe.Subscription, checkoutSessionId?: string) {
  const businessId = subscription.metadata.business_id;
  const businessSlug = subscription.metadata.business_slug;
  const plan = subscription.metadata.plan;
  if (!businessId || !businessSlug || (plan !== 'enhanced' && plan !== 'featured')) {
    console.warn(`Stripe subscription ${subscription.id} has no Who Knows a Pro metadata; skipped.`);
    return;
  }

  const previous = await getSubscriptionById(subscription.id);
  const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id;
  const currentPeriodEnd = subscription.items.data.reduce<number | null>((latest, item) => {
    if (!item.current_period_end) return latest;
    const value = item.current_period_end * 1_000;
    return latest === null ? value : Math.max(latest, value);
  }, null);
  const featuredRegion = subscription.metadata.featured_region || null;
  const featuredTrade = subscription.metadata.featured_trade || null;
  await upsertSubscription({
    id: subscription.id,
    businessId,
    businessSlug,
    customerId,
    plan,
    status: subscription.status,
    featuredRegion,
    featuredTrade,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    currentPeriodEnd,
  });
  await sqlRun(
    `UPDATE businesses SET stripe_customer_id = ?, stripe_subscription_id = ?, updated_at = ?
     WHERE COALESCE(main_slug,slug) = ?`,
    [customerId, subscription.id, Date.now(), businessSlug],
  );

  if (plan === 'featured') {
    await syncFeaturedSlot({
      subscriptionId: subscription.id,
      status: subscription.status,
      businessId,
      businessSlug,
      region: featuredRegion,
      trade: featuredTrade,
      checkoutSessionId,
    });
  }
  await recomputeBusinessTier(businessSlug);

  // Server-confirmed billing events, recorded on state transitions so retries do not double count.
  const isActive = subscription.status === 'active' || subscription.status === 'trialing';
  const wasActive = previous?.status === 'active' || previous?.status === 'trialing';
  const attribution = {
    source: subscription.metadata.utm_source || null,
    medium: subscription.metadata.utm_medium || null,
    campaign: subscription.metadata.utm_campaign || null,
    referrerHost: subscription.metadata.referrer_host || null,
  };
  const eventBase = { businessSlug, plan, region: featuredRegion, trade: featuredTrade, attribution };
  if (isActive && !wasActive && previous?.status !== 'past_due' && previous?.status !== 'unpaid') {
    await recordEvent('subscription_activated', eventBase);
  }
  if (subscription.cancel_at_period_end && !previous?.cancel_at_period_end && subscription.status !== 'canceled') {
    await recordEvent('subscription_cancel_scheduled', eventBase);
  }
  if (subscription.status === 'canceled' && previous?.status !== 'canceled') {
    await recordEvent('subscription_canceled', eventBase);
  }
}
