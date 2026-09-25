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
