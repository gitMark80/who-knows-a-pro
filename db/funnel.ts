import { sqlAll } from '@/db/runtime';

export const funnelSteps = [
  ['pricing_viewed', 'Pricing page viewed'],
  ['claim_page_viewed', 'Claim page viewed'],
  ['claim_started', 'Claim form started'],
  ['claim_submitted', 'Claim submitted (server)'],
  ['claim_verified', 'Claim verified (server)'],
  ['checkout_initiated', 'Checkout initiated (server)'],
  ['subscription_activated', 'Subscription activated (Stripe)'],
  ['subscription_cancel_scheduled', 'Cancellation scheduled (Stripe)'],
  ['subscription_canceled', 'Subscription ended (Stripe)'],
  ['business_profile_viewed', 'Business profile viewed'],
  ['quote_submitted', 'Quote request submitted (server)'],
] as const;

const days = (count: number) => Date.now() - count * 86_400_000;

export async function eventTotals() {
  const rows = await sqlAll<{ event: string; d7: number; d30: number; flagged7: number }>(
    `SELECT event,
       SUM(CASE WHEN created_at >= ? THEN 1 ELSE 0 END) AS d7,
       COUNT(*) AS d30,
       SUM(CASE WHEN created_at >= ? AND automation = 1 THEN 1 ELSE 0 END) AS flagged7
     FROM analytics_events WHERE created_at >= ? GROUP BY event`,
    [days(7), days(7), days(30)],
  );
  return new Map(rows.map((row) => [row.event, { d7: Number(row.d7), d30: Number(row.d30), flagged7: Number(row.flagged7) }]));
}

export async function sourceBreakdown() {
  return sqlAll<{ source: string; claims: number; verified: number; checkouts: number; activations: number; quotes: number }>(
    `SELECT COALESCE(source, CASE WHEN referrer_host IS NOT NULL THEN 'ref:' || referrer_host END, '(direct / unknown)') AS source,
       SUM(event = 'claim_submitted') AS claims,
       SUM(event = 'claim_verified') AS verified,
       SUM(event = 'checkout_initiated') AS checkouts,
       SUM(event = 'subscription_activated') AS activations,
       SUM(event = 'quote_submitted') AS quotes
     FROM analytics_events
     WHERE created_at >= ? AND event IN ('claim_submitted','claim_verified','checkout_initiated','subscription_activated','quote_submitted')
     GROUP BY 1 ORDER BY claims + verified + checkouts + activations + quotes DESC LIMIT 15`,
    [days(30)],
  );
}

/** Where claim-page traffic comes from. Useful for telling real owners from automated visits. */
export async function claimTrafficByCountry() {
  return sqlAll<{ country: string; views: number; starts: number; flagged: number }>(
    `SELECT COALESCE(country, '??') AS country,
       SUM(event = 'claim_page_viewed') AS views,
       SUM(event = 'claim_started') AS starts,
       SUM(automation = 1) AS flagged
     FROM analytics_events
     WHERE created_at >= ? AND event IN ('claim_page_viewed','claim_started')
     GROUP BY 1 ORDER BY views DESC LIMIT 12`,
    [days(7)],
  );
}

export async function blockedSubmissions() {
  return sqlAll<{ detail: string; count: number }>(
    `SELECT COALESCE(detail, 'unknown') AS detail, COUNT(*) AS count
     FROM analytics_events WHERE event = 'form_blocked' AND created_at >= ?
     GROUP BY 1 ORDER BY count DESC`,
    [days(7)],
  );
}

/** Claim records by day and outcome, from the claims table itself (works for history before tracking existed). */
export async function claimsByDay() {
  return sqlAll<{ day: string; total: number; auto: number; manual: number; verified: number }>(
    `SELECT date(created_at / 1000, 'unixepoch') AS day,
       COUNT(*) AS total,
       SUM(status IN ('email_sent','superseded')) AS auto,
       SUM(status IN ('manual_review','approved')) AS manual,
       SUM(status = 'verified') AS verified
     FROM claims WHERE created_at >= ?
     GROUP BY 1 ORDER BY 1 DESC`,
    [days(21)],
  );
}
