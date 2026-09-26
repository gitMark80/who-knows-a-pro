import { integer, sqliteTable, text, index, uniqueIndex } from "drizzle-orm/sqlite-core";

export const businesses = sqliteTable("businesses", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  mainSlug: text("main_slug"),
  region: text("region").notNull(),
  trade: text("trade").notNull(),
  location: text("location").notNull(),
  summary: text("summary").notNull(),
  website: text("website").notNull(),
  sourceUrl: text("source_url"),
  sourceVerifiedAt: text("source_verified_at"),
  publicEmail: text("public_email"),
  emailSourceUrl: text("email_source_url"),
  emailVerifiedAt: text("email_verified_at"),
  phone: text("phone"),
  address: text("address"),
  serviceArea: text("service_area"),
  hours: text("hours"),
  specialties: text("specialties"),
  yearFounded: integer("year_founded"),
  licenseNumber: text("license_number"),
  logoUrl: text("logo_url"),
  photoUrls: text("photo_urls").notNull().default("[]"),
  ownerEmail: text("owner_email"),
  tier: text("tier").notNull().default("free"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  isTest: integer("is_test").notNull().default(0),
  approved: integer("approved").notNull().default(0),
  updatedAt: integer("updated_at").notNull(),
}, (t) => [uniqueIndex("idx_businesses_slug").on(t.slug), index("idx_businesses_main_slug").on(t.mainSlug), index("idx_businesses_region_trade").on(t.region, t.trade)]);

export const claims = sqliteTable("claims", {
  id: text("id").primaryKey(),
  businessId: text("business_id").notNull(),
  email: text("email").notNull(),
  contactName: text("contact_name").notNull(),
  note: text("note").notNull().default(""),
  status: text("status").notNull(),
  tokenHash: text("token_hash"),
  expiresAt: integer("expires_at"),
  requestedPlan: text("requested_plan"),
  requestedRegion: text("requested_region"),
  requestedTrade: text("requested_trade"),
  createdAt: integer("created_at").notNull(),
}, (t) => [index("idx_claims_business_id").on(t.businessId), index("idx_claims_token_hash").on(t.tokenHash)]);

export const sessions = sqliteTable("sessions", {
  tokenHash: text("token_hash").primaryKey(),
  businessId: text("business_id").notNull(),
  email: text("email").notNull(),
  expiresAt: integer("expires_at").notNull(),
}, (t) => [index("idx_sessions_business_id").on(t.businessId)]);

export const webhooks = sqliteTable("webhooks", {
  id: text("id").primaryKey(),
  createdAt: integer("created_at").notNull(),
});

export const directorySeedVersions = sqliteTable("directory_seed_versions", {
  id: text("id").primaryKey(),
  version: text("version").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const leads = sqliteTable("leads", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  zip: text("zip").notNull(),
  jobDescription: text("job_description").notNull(),
  preferredContactMethod: text("preferred_contact_method").notNull(),
  region: text("region").notNull(),
  trade: text("trade").notNull(),
  pageUrl: text("page_url").notNull(),
  ipAddress: text("ip_address").notNull(),
  routed: integer("routed").notNull().default(0),
  routedBusinessId: text("routed_business_id"),
  routedBusinessSlug: text("routed_business_slug"),
  routedAt: integer("routed_at"),
  ownerNotificationStatus: text("owner_notification_status").notNull().default("pending"),
  businessNotificationStatus: text("business_notification_status").notNull().default("not_applicable"),
  createdAt: integer("created_at").notNull(),
}, (t) => [
  index("idx_leads_region_trade_created").on(t.region, t.trade, t.createdAt),
  index("idx_leads_ip_created").on(t.ipAddress, t.createdAt),
  index("idx_leads_routed_business").on(t.routedBusinessSlug, t.createdAt),
]);

export const featuredSlots = sqliteTable("featured_slots", {
  id: text("id").primaryKey(),
  region: text("region").notNull(),
  trade: text("trade").notNull(),
  businessId: text("business_id").notNull(),
  businessSlug: text("business_slug").notNull(),
  stripeCheckoutSessionId: text("stripe_checkout_session_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  status: text("status").notNull(),
  reservedUntil: integer("reserved_until"),
  activatedAt: integer("activated_at"),
  updatedAt: integer("updated_at").notNull(),
}, (t) => [
  uniqueIndex("idx_featured_slots_page").on(t.region, t.trade),
  index("idx_featured_slots_business").on(t.businessSlug),
  index("idx_featured_slots_subscription").on(t.stripeSubscriptionId),
]);

export const subscriptions = sqliteTable("subscriptions", {
  id: text("id").primaryKey(),
  businessId: text("business_id").notNull(),
  businessSlug: text("business_slug").notNull(),
  stripeCustomerId: text("stripe_customer_id").notNull(),
  plan: text("plan").notNull(),
  status: text("status").notNull(),
  featuredRegion: text("featured_region"),
  featuredTrade: text("featured_trade"),
  cancelAtPeriodEnd: integer("cancel_at_period_end").notNull().default(0),
  currentPeriodEnd: integer("current_period_end"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
}, (t) => [
  index("idx_subscriptions_business").on(t.businessSlug),
  index("idx_subscriptions_customer").on(t.stripeCustomerId),
  index("idx_subscriptions_status").on(t.status),
]);

export const profileViews = sqliteTable("profile_views", {
  id: text("id").primaryKey(),
  businessSlug: text("business_slug").notNull(),
  viewerHash: text("viewer_hash").notNull(),
  viewedAt: integer("viewed_at").notNull(),
}, (t) => [
  index("idx_profile_views_business_date").on(t.businessSlug, t.viewedAt),
]);

export const adminLoginTokens = sqliteTable("admin_login_tokens", {
  tokenHash: text("token_hash").primaryKey(),
  email: text("email").notNull(),
  expiresAt: integer("expires_at").notNull(),
  usedAt: integer("used_at"),
  createdAt: integer("created_at").notNull(),
}, (t) => [index("idx_admin_login_tokens_email").on(t.email, t.createdAt)]);

export const adminSessions = sqliteTable("admin_sessions", {
  tokenHash: text("token_hash").primaryKey(),
  email: text("email").notNull(),
  expiresAt: integer("expires_at").notNull(),
}, (t) => [index("idx_admin_sessions_email").on(t.email)]);
