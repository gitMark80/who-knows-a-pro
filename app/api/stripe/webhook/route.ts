import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { config, sqlOne, sqlRun } from '@/db/runtime';
import {
  activateFeaturedSlot,
  deactivateFeaturedSlot,
  recomputeBusinessTier,
  releaseFeaturedReservationByCheckout,
  upsertSubscription,
} from '@/db/revenue';
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
    } else if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      await syncSubscription(event.data.object);
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

async function syncSubscription(subscription: Stripe.Subscription, checkoutSessionId?: string) {
  const businessId = subscription.metadata.business_id;
  const businessSlug = subscription.metadata.business_slug;
  const plan = subscription.metadata.plan;
  if (!businessId || !businessSlug || (plan !== 'enhanced' && plan !== 'featured')) return;

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

  const active = subscription.status === 'active' || subscription.status === 'trialing';
  if (plan === 'featured') {
    if (active && checkoutSessionId && featuredRegion && featuredTrade) {
      await activateFeaturedSlot({
        checkoutSessionId,
        subscriptionId: subscription.id,
        businessId,
        businessSlug,
        region: featuredRegion,
        trade: featuredTrade,
      });
    } else if (!active) {
      await deactivateFeaturedSlot(subscription.id);
    }
  }
  await recomputeBusinessTier(businessSlug);
}
