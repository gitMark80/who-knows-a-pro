import { getBusiness, sqlAll, sqlBatch, sqlOne, sqlRun, type Business } from '@/db/runtime';

export type FeaturedSlot = {
  id: string;
  region: string;
  trade: string;
  business_id: string;
  business_slug: string;
  stripe_checkout_session_id: string | null;
  stripe_subscription_id: string | null;
  status: string;
  reserved_until: number | null;
  activated_at: number | null;
  updated_at: number;
};

export type LeadRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  zip: string;
  job_description: string;
  preferred_contact_method: string;
  region: string;
  trade: string;
  page_url: string;
  ip_address: string;
  routed: number;
  routed_business_id: string | null;
  routed_business_slug: string | null;
  routed_at: number | null;
  owner_notification_status: string;
  business_notification_status: string;
  created_at: number;
};

export type SubscriptionRecord = {
  id: string;
  business_id: string;
  business_slug: string;
  stripe_customer_id: string;
  plan: 'enhanced' | 'featured';
  status: string;
  featured_region: string | null;
  featured_trade: string | null;
  cancel_at_period_end: number;
  current_period_end: number | null;
  created_at: number;
  updated_at: number;
};

const activeStatuses = ['active', 'trialing'];

export async function getActiveFeaturedSlot(region: string, trade: string): Promise<FeaturedSlot | null> {
  return sqlOne<FeaturedSlot>(
    `SELECT * FROM featured_slots
     WHERE region = ? AND trade = ? AND status = 'active'
     LIMIT 1`,
    [region, trade],
  );
}

export async function getFeaturedBusiness(region: string, trade: string): Promise<{ slot: FeaturedSlot; business: Business } | null> {
  const slot = await getActiveFeaturedSlot(region, trade);
  if (!slot) return null;
  const business = await getBusiness(slot.business_id);
  if (!business) return null;
  return { slot, business: { ...business, tier: 'featured' } };
}

export async function pageHasUnavailableFeaturedSlot(region: string, trade: string) {
  const now = Date.now();
  const slot = await sqlOne<FeaturedSlot>(
    `SELECT * FROM featured_slots
     WHERE region = ? AND trade = ?
       AND (status = 'active' OR (status = 'pending' AND reserved_until > ?))
     LIMIT 1`,
    [region, trade, now],
  );
  return Boolean(slot);
}

export async function reserveFeaturedSlot(input: { region: string; trade: string; businessId: string; businessSlug: string }) {
  const now = Date.now();
  const id = crypto.randomUUID();
  await sqlBatch([
    {
      sql: `DELETE FROM featured_slots
            WHERE region = ? AND trade = ? AND status = 'pending' AND reserved_until <= ?`,
      args: [input.region, input.trade, now],
    },
    {
      sql: `INSERT OR IGNORE INTO featured_slots
            (id,region,trade,business_id,business_slug,status,reserved_until,updated_at)
            VALUES (?,?,?,?,?,'pending',?,?)`,
      args: [id, input.region, input.trade, input.businessId, input.businessSlug, now + 30 * 60_000, now],
    },
  ]);
  const slot = await sqlOne<FeaturedSlot>('SELECT * FROM featured_slots WHERE region = ? AND trade = ?', [input.region, input.trade]);
  return slot?.id === id ? slot : null;
}

export async function attachCheckoutToFeaturedSlot(slotId: string, checkoutSessionId: string) {
  await sqlRun(
    `UPDATE featured_slots SET stripe_checkout_session_id = ?, updated_at = ?
     WHERE id = ? AND status = 'pending'`,
    [checkoutSessionId, Date.now(), slotId],
  );
}

export async function releaseFeaturedReservation(slotId: string) {
  await sqlRun(`DELETE FROM featured_slots WHERE id = ? AND status = 'pending'`, [slotId]);
}

export async function releaseFeaturedReservationByCheckout(checkoutSessionId: string) {
  await sqlRun(
    `DELETE FROM featured_slots WHERE stripe_checkout_session_id = ? AND status = 'pending'`,
    [checkoutSessionId],
  );
}

export async function activateFeaturedSlot(input: {
  checkoutSessionId: string;
  subscriptionId: string;
  businessId: string;
  businessSlug: string;
  region: string;
  trade: string;
}) {
  const now = Date.now();
  await sqlRun(
    `UPDATE featured_slots
     SET business_id = ?, business_slug = ?, stripe_subscription_id = ?, status = 'active',
         reserved_until = NULL, activated_at = COALESCE(activated_at, ?), updated_at = ?
     WHERE region = ? AND trade = ? AND stripe_checkout_session_id = ?`,
    [input.businessId, input.businessSlug, input.subscriptionId, now, now, input.region, input.trade, input.checkoutSessionId],
  );
}

export async function deactivateFeaturedSlot(subscriptionId: string) {
  await sqlRun(
    `DELETE FROM featured_slots WHERE stripe_subscription_id = ?`,
    [subscriptionId],
  );
}

export async function upsertSubscription(input: {
  id: string;
  businessId: string;
  businessSlug: string;
  customerId: string;
  plan: 'enhanced' | 'featured';
  status: string;
  featuredRegion?: string | null;
  featuredTrade?: string | null;
  cancelAtPeriodEnd?: boolean;
  currentPeriodEnd?: number | null;
}) {
  const now = Date.now();
  await sqlRun(
    `INSERT INTO subscriptions
      (id,business_id,business_slug,stripe_customer_id,plan,status,featured_region,featured_trade,
       cancel_at_period_end,current_period_end,created_at,updated_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
     ON CONFLICT(id) DO UPDATE SET
       business_id=excluded.business_id,
       business_slug=excluded.business_slug,
       stripe_customer_id=excluded.stripe_customer_id,
       plan=excluded.plan,
       status=excluded.status,
       featured_region=excluded.featured_region,
       featured_trade=excluded.featured_trade,
       cancel_at_period_end=excluded.cancel_at_period_end,
       current_period_end=excluded.current_period_end,
       updated_at=excluded.updated_at`,
    [
      input.id, input.businessId, input.businessSlug, input.customerId, input.plan, input.status,
      input.featuredRegion ?? null, input.featuredTrade ?? null, input.cancelAtPeriodEnd ? 1 : 0,
      input.currentPeriodEnd ?? null, now, now,
    ],
  );
}

export async function getSubscriptionById(id: string) {
  return sqlOne<SubscriptionRecord>('SELECT * FROM subscriptions WHERE id = ?', [id]);
}

export async function getActiveSubscriptionForBusiness(businessSlug: string) {
  return sqlOne<SubscriptionRecord>(
    `SELECT * FROM subscriptions
     WHERE business_slug = ? AND status IN ('active','trialing')
     ORDER BY CASE plan WHEN 'featured' THEN 0 ELSE 1 END, updated_at DESC LIMIT 1`,
    [businessSlug],
  );
}

export async function recomputeBusinessTier(businessSlug: string) {
  const subscriptions = await sqlAll<Pick<SubscriptionRecord, 'plan' | 'status'>>(
    `SELECT plan,status FROM subscriptions WHERE business_slug = ?`,
    [businessSlug],
  );
  const active = subscriptions.filter((subscription) => activeStatuses.includes(subscription.status));
  const tier = active.some((subscription) => subscription.plan === 'featured')
    ? 'featured'
    : active.some((subscription) => subscription.plan === 'enhanced') ? 'enhanced' : 'free';
  await sqlRun(
    `UPDATE businesses SET tier = ?, updated_at = ? WHERE COALESCE(main_slug,slug) = ?`,
    [tier, Date.now(), businessSlug],
  );
  return tier;
}

export async function countPageLeadsLast30Days(region: string, trade: string) {
  const row = await sqlOne<{ count: number }>(
    `SELECT COUNT(*) AS count FROM leads WHERE region = ? AND trade = ? AND created_at >= ?`,
    [region, trade, Date.now() - 30 * 86_400_000],
  );
  return Number(row?.count ?? 0);
}

export async function listLeadPageCountsLast30Days() {
  return sqlAll<{ region: string; trade: string; count: number; unsold_count: number }>(
    `SELECT region,trade,COUNT(*) AS count,
       SUM(CASE WHEN routed = 0 THEN 1 ELSE 0 END) AS unsold_count
     FROM leads WHERE created_at >= ?
     GROUP BY region,trade ORDER BY count DESC,region,trade`,
    [Date.now() - 30 * 86_400_000],
  );
}

export async function listLeads(filters: { region?: string; trade?: string; limit?: number } = {}) {
  const where: string[] = [];
  const args: Array<string | number> = [];
  if (filters.region) { where.push('region = ?'); args.push(filters.region); }
  if (filters.trade) { where.push('trade = ?'); args.push(filters.trade); }
  const limit = Math.max(1, Math.min(filters.limit ?? 250, 5_000));
  args.push(limit);
  return sqlAll<LeadRecord>(
    `SELECT * FROM leads ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
     ORDER BY created_at DESC LIMIT ?`,
    args,
  );
}

export async function getBusinessPerformance(businessSlug: string, placements: Array<{ region: string; trade: string }>) {
  const since = Date.now() - 30 * 86_400_000;
  const [totalViews, recentViews, routedLeads] = await Promise.all([
    sqlOne<{ count: number }>('SELECT COUNT(*) AS count FROM profile_views WHERE business_slug = ?', [businessSlug]),
    sqlOne<{ count: number }>('SELECT COUNT(*) AS count FROM profile_views WHERE business_slug = ? AND viewed_at >= ?', [businessSlug, since]),
    sqlOne<{ count: number }>('SELECT COUNT(*) AS count FROM leads WHERE routed_business_slug = ? AND created_at >= ?', [businessSlug, since]),
  ]);

  let pageLeads = 0;
  const pairs = [...new Map(placements.map((placement) => [`${placement.region}|${placement.trade}`, placement])).values()];
  if (pairs.length) {
    const conditions = pairs.map(() => '(region = ? AND trade = ?)').join(' OR ');
    const args = pairs.flatMap((placement) => [placement.region, placement.trade]);
    const row = await sqlOne<{ count: number }>(
      `SELECT COUNT(*) AS count FROM leads WHERE created_at >= ? AND (${conditions})`,
      [since, ...args],
    );
    pageLeads = Number(row?.count ?? 0);
  }

  return {
    totalViews: Number(totalViews?.count ?? 0),
    viewsLast30Days: Number(recentViews?.count ?? 0),
    pageLeadsLast30Days: pageLeads,
    routedLeadsLast30Days: Number(routedLeads?.count ?? 0),
  };
}
