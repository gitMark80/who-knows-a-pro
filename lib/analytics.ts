import { cookies } from 'next/headers';
import { sqlRun } from '@/db/runtime';

/**
 * Funnel events. Server-confirmed events are written only after the action succeeds;
 * client events are page-level beacons that the /api/events route accepts from an allowlist.
 * No names, emails, phone numbers, IP addresses, or free text are stored.
 */
export const serverEvents = [
  'business_profile_viewed',
  'claim_submitted',
  'claim_verified',
  'quote_submitted',
  'checkout_initiated',
  'subscription_activated',
  'subscription_cancel_scheduled',
  'subscription_canceled',
  'form_blocked',
] as const;
export const clientEvents = ['pricing_viewed', 'claim_page_viewed', 'claim_started'] as const;
export type AnalyticsEvent = (typeof serverEvents)[number] | (typeof clientEvents)[number];

export type Attribution = { source: string | null; medium: string | null; campaign: string | null; referrerHost: string | null };

export const ATTRIBUTION_COOKIE = 'wkap_src';
const emptyAttribution: Attribution = { source: null, medium: null, campaign: null, referrerHost: null };

export function cleanToken(value: unknown, limit = 80) {
  if (typeof value !== 'string') return null;
  const cleaned = value.trim().toLowerCase().replace(/[^a-z0-9._~+-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, limit);
  return cleaned || null;
}

export function cleanPath(value: unknown) {
  if (typeof value !== 'string' || !value.startsWith('/')) return null;
  return value.split('?')[0].split('#')[0].slice(0, 200);
}

/** First-party attribution cookie written by the browser (UTM tags or external referrer host). */
export async function readAttribution(): Promise<Attribution> {
  try {
    const raw = (await cookies()).get(ATTRIBUTION_COOKIE)?.value;
    if (!raw) return emptyAttribution;
    const parsed = JSON.parse(decodeURIComponent(raw)) as Record<string, unknown>;
    return {
      source: cleanToken(parsed.s),
      medium: cleanToken(parsed.m),
      campaign: cleanToken(parsed.c),
      referrerHost: cleanToken(parsed.r, 120),
    };
  } catch {
    return emptyAttribution;
  }
}

export type EventInput = {
  path?: string | null;
  region?: string | null;
  trade?: string | null;
  businessSlug?: string | null;
  plan?: string | null;
  detail?: string | null;
  country?: string | null;
  automation?: boolean;
  attribution?: Partial<Attribution> | null;
};

/** Never throws: analytics must not break a claim, quote, checkout, or webhook. */
export async function recordEvent(event: AnalyticsEvent, input: EventInput = {}) {
  try {
    const attribution = input.attribution === undefined ? await readAttribution() : input.attribution || emptyAttribution;
    await sqlRun(
      `INSERT INTO analytics_events
        (id,event,created_at,path,region,trade,business_slug,plan,detail,source,medium,campaign,referrer_host,country,automation)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        crypto.randomUUID(), event, Date.now(), input.path ?? null, input.region ?? null, input.trade ?? null,
        input.businessSlug ?? null, input.plan ?? null, input.detail ? input.detail.slice(0, 80) : null,
        attribution.source ?? null, attribution.medium ?? null, attribution.campaign ?? null,
        attribution.referrerHost ?? null, input.country ?? null, input.automation ? 1 : 0,
      ],
    );
  } catch (error) {
    console.error(`Could not record analytics event ${event}`, error);
  }
}
