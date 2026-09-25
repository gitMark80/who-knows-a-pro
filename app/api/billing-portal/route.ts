import { NextResponse } from 'next/server';
import { currentBusiness } from '@/db/auth';
import { getActiveSubscriptionForBusiness } from '@/db/revenue';
import { requestOrigin } from '@/lib/site-url';
import { stripe } from '@/lib/stripe';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const business = await currentBusiness();
  if (!business) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
  const subscription = await getActiveSubscriptionForBusiness(business.main_slug || business.slug);
  const customerId = business.stripe_customer_id || subscription?.stripe_customer_id;
  if (!customerId) return NextResponse.json({ error: 'No billing account was found.' }, { status: 400 });

  try {
    const session = await stripe().billingPortal.sessions.create({
      customer: customerId,
      return_url: `${requestOrigin(request)}/dashboard`,
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe billing portal failed', error);
    return NextResponse.json({ error: 'Billing management is not available yet.' }, { status: 503 });
  }
}
