import Stripe from 'stripe';
import { config } from '@/db/runtime';

let stripeClient: Stripe | null = null;

export function stripe() {
  if (stripeClient) return stripeClient;
  const secretKey = config('STRIPE_SECRET_KEY');
  if (!secretKey) throw new Error('STRIPE_SECRET_KEY is not configured');
  if (!secretKey.startsWith('sk_test_') && config('STRIPE_LIVE_MODE') !== 'true') {
    throw new Error('Live Stripe keys are disabled until STRIPE_LIVE_MODE=true is explicitly set');
  }
  stripeClient = new Stripe(secretKey, { appInfo: { name: 'Who Knows a Pro' } });
  return stripeClient;
}

export function priceForPlan(plan: 'enhanced' | 'featured') {
  const price = config(plan === 'enhanced' ? 'STRIPE_PRICE_ID_ENHANCED' : 'STRIPE_PRICE_ID_FEATURED');
  if (!price) throw new Error(`Stripe ${plan} price is not configured`);
  return price;
}

export function stripeTaxEnabled() {
  return config('STRIPE_TAX_ENABLED').toLowerCase() === 'true';
}
