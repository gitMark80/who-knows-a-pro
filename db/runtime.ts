import { createClient, type Client, type InValue } from '@libsql/client';
import { directorySeed } from '@/data/directory';
import { additiveColumns, schemaStatements } from '@/db/setup';

const STATIC_UPDATED_AT = Date.UTC(2026, 8, 25);

export type Business = {
  id: string;
  name: string;
  slug: string;
  main_slug: string | null;
  region: string;
  trade: string;
  location: string;
  summary: string;
  website: string;
  phone: string | null;
  address: string | null;
  service_area: string | null;
  hours: string | null;
  specialties: string | null;
  year_founded: number | null;
  license_number: string | null;
  logo_url: string | null;
  photo_urls: string;
  owner_email: string | null;
  tier: string;
  approved: number;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  source_url: string | null;
  source_verified_at: string | null;
  public_email: string | null;
  email_source_url: string | null;
  email_verified_at: string | null;
  updated_at: number;
};

export type BusinessProfile = Business & {
  main_slug: string;
  regions: string[];
  trades: string[];
  placements: Business[];
};

function publicBusiness(seed: (typeof directorySeed)[number]): Business {
  return {
    ...seed,
    main_slug: seed.mainSlug,
    phone: null,
    address: null,
    service_area: null,
    hours: null,
    specialties: null,
    year_founded: null,
    license_number: null,
    logo_url: null,
    photo_urls: '[]',
    owner_email: null,
    tier: 'free',
    approved: 1,
    stripe_customer_id: null,
    stripe_subscription_id: null,
    source_url: seed.sourceUrl,
    source_verified_at: seed.sourceVerifiedAt,
    public_email: seed.publicEmail,
    email_source_url: seed.emailSourceUrl,
    email_verified_at: seed.emailVerifiedAt,
    updated_at: STATIC_UPDATED_AT,
  };
}

const publicDirectory = directorySeed.map(publicBusiness);
let client: Client | null = null;
let setupPromise: Promise<void> | null = null;

export function config(name: string): string {
  return (process.env[name] || '').trim();
}

export function databaseConfigured() {
  return Boolean(config('TURSO_DATABASE_URL'));
}

export function database(): Client {
  if (client) return client;
  const url = config('TURSO_DATABASE_URL');
  if (!url) throw new Error('Turso database is not configured');
  client = createClient({
    url,
    authToken: config('TURSO_AUTH_TOKEN') || undefined,
    intMode: 'number',
  });
  return client;
}

export async function ensureDatabase() {
  if (!setupPromise) {
    setupPromise = initializeDatabase().catch((error) => {
      setupPromise = null;
      throw error;
    });
  }
  return setupPromise;
}

async function initializeDatabase() {
  const db = database();
  await db.batch(schemaStatements.map((sql) => ({ sql, args: [] })), 'write');

  for (const [table, columns] of Object.entries(additiveColumns)) {
    const existing = await db.execute(`PRAGMA table_info(${table})`);
    const names = new Set(existing.rows.map((row) => String(row.name)));
    for (const [name, type] of columns) {
      if (!names.has(name)) await db.execute(`ALTER TABLE ${table} ADD COLUMN ${name} ${type}`);
    }
  }
}

export async function sqlAll<T>(sql: string, args: InValue[] = []): Promise<T[]> {
  await ensureDatabase();
  const result = await database().execute({ sql, args });
  return result.rows.map((row) => ({ ...row }) as T);
}

export async function sqlOne<T>(sql: string, args: InValue[] = []): Promise<T | null> {
  const rows = await sqlAll<T>(sql, args);
  return rows[0] ?? null;
}

export async function sqlRun(sql: string, args: InValue[] = []) {
  await ensureDatabase();
  return database().execute({ sql, args });
}

export async function sqlBatch(statements: Array<{ sql: string; args?: InValue[] }>) {
  await ensureDatabase();
  return database().batch(statements.map((statement) => ({ sql: statement.sql, args: statement.args ?? [] })), 'write');
}

const overlayKeys = [
  'name', 'location', 'summary', 'website', 'phone', 'address', 'service_area', 'hours',
  'specialties', 'year_founded', 'license_number', 'logo_url', 'photo_urls', 'owner_email',
  'tier', 'stripe_customer_id', 'stripe_subscription_id', 'source_url', 'source_verified_at',
  'public_email', 'email_source_url', 'email_verified_at', 'approved', 'updated_at',
] as const satisfies ReadonlyArray<keyof Business>;

function canonicalSlug(business: Pick<Business, 'main_slug' | 'slug'>) {
  return business.main_slug || business.slug;
}

function mergeBusiness(base: Business, override?: Business | null): Business {
  if (!override) return base;
  const merged = { ...base };
  for (const key of overlayKeys) {
    const value = override[key];
    if (value !== null && value !== undefined) {
      Object.assign(merged, { [key]: value });
    }
  }
  merged.main_slug = override.main_slug || base.main_slug;
  return merged;
}

function bestOverride(rows: Business[]) {
  return [...rows].sort((a, b) => {
    const claimed = Number(Boolean(b.owner_email)) - Number(Boolean(a.owner_email));
    if (claimed) return claimed;
    return b.updated_at - a.updated_at;
  })[0] ?? null;
}

async function databaseBusinessesForPage(region?: string, trade?: string, slugs: string[] = []) {
  if (!databaseConfigured()) return [] as Business[];
  const rows: Business[] = [];
  const where: string[] = [];
  const values: InValue[] = [];
  if (region) { where.push('region = ?'); values.push(region); }
  if (trade) { where.push('trade = ?'); values.push(trade); }
  if (where.length) {
    rows.push(...await sqlAll<Business>(`SELECT * FROM businesses WHERE approved = 1 AND ${where.join(' AND ')}`, values));
  }
  if (slugs.length) {
    for (let index = 0; index < slugs.length; index += 100) {
      const batch = slugs.slice(index, index + 100);
      rows.push(...await sqlAll<Business>(
        `SELECT * FROM businesses WHERE COALESCE(main_slug, slug) IN (${batch.map(() => '?').join(',')})`,
        batch,
      ));
    }
  }
  return rows;
}

export async function seedDirectory() {
  await ensureDatabase();
}

export async function upsertBusinessRecord(business: Business) {
  await sqlRun(
    `INSERT INTO businesses (
      id,name,slug,main_slug,region,trade,location,summary,website,source_url,source_verified_at,
      public_email,email_source_url,email_verified_at,phone,address,service_area,hours,specialties,
      year_founded,license_number,logo_url,photo_urls,owner_email,tier,stripe_customer_id,
      stripe_subscription_id,approved,updated_at
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    ON CONFLICT(id) DO UPDATE SET
      main_slug=COALESCE(businesses.main_slug,excluded.main_slug),
      source_url=COALESCE(businesses.source_url,excluded.source_url),
      source_verified_at=COALESCE(businesses.source_verified_at,excluded.source_verified_at),
      public_email=COALESCE(businesses.public_email,excluded.public_email),
      email_source_url=COALESCE(businesses.email_source_url,excluded.email_source_url),
      email_verified_at=COALESCE(businesses.email_verified_at,excluded.email_verified_at),
      approved=MAX(businesses.approved,excluded.approved)`,
    [
      business.id, business.name, business.slug, business.main_slug, business.region, business.trade,
      business.location, business.summary, business.website, business.source_url, business.source_verified_at,
      business.public_email, business.email_source_url, business.email_verified_at, business.phone,
      business.address, business.service_area, business.hours, business.specialties, business.year_founded,
      business.license_number, business.logo_url, business.photo_urls, business.owner_email, business.tier,
      business.stripe_customer_id, business.stripe_subscription_id, business.approved, business.updated_at,
    ],
  );
}

export async function listBusinesses(region?: string, trade?: string): Promise<Business[]> {
  const base = publicDirectory.filter((business) => (!region || business.region === region) && (!trade || business.trade === trade));
  let databaseRows: Business[] = [];
  try {
    databaseRows = await databaseBusinessesForPage(region, trade, [...new Set(base.map(canonicalSlug))]);
  } catch (error) {
    console.error('Could not load directory overrides', error);
  }

  const overrides = new Map<string, Business[]>();
  for (const row of databaseRows) {
    const key = canonicalSlug(row);
    overrides.set(key, [...(overrides.get(key) ?? []), row]);
  }

  const combined = base.map((business) => mergeBusiness(business, bestOverride(overrides.get(canonicalSlug(business)) ?? [])));
  const staticIds = new Set(base.map((business) => business.id));
  for (const row of databaseRows) {
    if (row.approved !== 1 || staticIds.has(row.id)) continue;
    if (region && row.region !== region) continue;
    if (trade && row.trade !== trade) continue;
    if (!combined.some((business) => business.id === row.id)) combined.push(row);
  }

  const seen = new Set<string>();
  return combined
    .filter((business) => business.approved === 1)
    .filter((business) => {
      let website = business.website.trim().toLowerCase().replace(/\/+$/, '');
      try {
        const url = new URL(business.website);
        website = `${url.hostname.replace(/^www\./, '').toLowerCase()}${url.pathname.replace(/\/+$/, '').toLowerCase()}`;
      } catch {}
      const key = `${business.region}|${business.trade}|${website || canonicalSlug(business)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => {
      const rank = (tier: string) => tier === 'featured' || tier === 'sponsored' ? 0 : tier === 'enhanced' ? 1 : 2;
      return rank(a.tier) - rank(b.tier) || Number(Boolean(b.owner_email)) - Number(Boolean(a.owner_email)) || a.name.localeCompare(b.name);
    })
    .slice(0, 200);
}

export async function listBusinessSlugs(): Promise<{ slug: string; updated_at: number }[]> {
  const slugs = new Map<string, number>();
  for (const business of publicDirectory) slugs.set(canonicalSlug(business), STATIC_UPDATED_AT);
  if (databaseConfigured()) {
    try {
      const rows = await sqlAll<{ slug: string; updated_at: number }>(
        `SELECT COALESCE(main_slug, slug) AS slug, MAX(updated_at) AS updated_at
         FROM businesses WHERE approved = 1 GROUP BY COALESCE(main_slug, slug)`,
      );
      for (const row of rows) slugs.set(row.slug, Math.max(slugs.get(row.slug) ?? 0, row.updated_at));
    } catch (error) {
      console.error('Could not load business sitemap overrides', error);
    }
  }
  return [...slugs].map(([slug, updated_at]) => ({ slug, updated_at })).sort((a, b) => a.slug.localeCompare(b.slug));
}

export async function listDirectoryPairCounts(): Promise<{ region: string; trade: string; count: number }[]> {
  const groups = new Map<string, Set<string>>();
  for (const business of publicDirectory) {
    const key = `${business.region}|${business.trade}`;
    const profiles = groups.get(key) ?? new Set<string>();
    profiles.add(canonicalSlug(business));
    groups.set(key, profiles);
  }
  if (databaseConfigured()) {
    try {
      const rows = await sqlAll<Pick<Business, 'region' | 'trade' | 'slug' | 'main_slug'>>(
        'SELECT region,trade,slug,main_slug FROM businesses WHERE approved = 1',
      );
      for (const business of rows) {
        const key = `${business.region}|${business.trade}`;
        const profiles = groups.get(key) ?? new Set<string>();
        profiles.add(canonicalSlug(business));
        groups.set(key, profiles);
      }
    } catch (error) {
      console.error('Could not load dynamic directory counts', error);
    }
  }
  return [...groups].map(([key, profiles]) => {
    const [region, trade] = key.split('|');
    return { region, trade, count: profiles.size };
  }).sort((a, b) => a.region.localeCompare(b.region) || a.trade.localeCompare(b.trade));
}

export async function listListedDirectoryPairs(): Promise<{ region: string; trade: string }[]> {
  return (await listDirectoryPairCounts()).map(({ region, trade }) => ({ region, trade }));
}

export async function listCategoryCounts(region: string): Promise<{ trade: string; count: number }[]> {
  const counts = new Map<string, Set<string>>();
  for (const business of await listBusinesses(region)) {
    const profiles = counts.get(business.trade) ?? new Set<string>();
    profiles.add(canonicalSlug(business));
    counts.set(business.trade, profiles);
  }
  return [...counts].map(([trade, profiles]) => ({ trade, count: profiles.size })).sort((a, b) => a.trade.localeCompare(b.trade));
}

async function loadOverride(slug: string) {
  if (!databaseConfigured()) return null;
  const rows = await sqlAll<Business>('SELECT * FROM businesses WHERE COALESCE(main_slug,slug) = ? ORDER BY owner_email IS NOT NULL DESC, updated_at DESC', [slug]);
  return bestOverride(rows);
}

export async function getBusiness(id: string): Promise<Business | null> {
  const base = publicDirectory.find((business) => business.id === id || business.slug === id) ?? null;
  if (base) {
    try { return mergeBusiness(base, await loadOverride(canonicalSlug(base))); } catch { return base; }
  }
  if (!databaseConfigured()) return null;
  return sqlOne<Business>('SELECT * FROM businesses WHERE id = ? OR slug = ? LIMIT 1', [id, id]);
}

export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  return getBusiness(slug);
}

export async function getBusinessProfile(slug: string): Promise<{ profile: BusinessProfile; legacy: boolean } | null> {
  const staticDirect = publicDirectory.find((business) => business.slug === slug || canonicalSlug(business) === slug) ?? null;
  let databaseDirect: Business | null = null;
  if (databaseConfigured()) {
    try { databaseDirect = await sqlOne<Business>('SELECT * FROM businesses WHERE slug = ? OR main_slug = ? ORDER BY owner_email IS NOT NULL DESC, updated_at DESC LIMIT 1', [slug, slug]); } catch {}
  }
  const direct = staticDirect || databaseDirect;
  if (!direct) return null;
  const mainSlug = canonicalSlug(direct);
  const staticPlacements = publicDirectory.filter((business) => canonicalSlug(business) === mainSlug);
  let databaseRows: Business[] = [];
  if (databaseConfigured()) {
    try { databaseRows = await sqlAll<Business>('SELECT * FROM businesses WHERE COALESCE(main_slug,slug) = ? ORDER BY owner_email IS NOT NULL DESC, updated_at DESC', [mainSlug]); } catch {}
  }
  const override = bestOverride(databaseRows);
  const placements = staticPlacements.map((business) => mergeBusiness(business, override));
  for (const row of databaseRows) {
    if (row.approved === 1 && !placements.some((business) => business.region === row.region && business.trade === row.trade)) placements.push(row);
  }
  if (!placements.length && override) placements.push(override);
  if (!placements.length) return null;
  const primary = [...placements].sort((a, b) => Number(Boolean(b.owner_email)) - Number(Boolean(a.owner_email)) || b.updated_at - a.updated_at)[0];
  const firstValue = <K extends keyof Business>(key: K) => placements.find((row) => row[key] !== null && row[key] !== '')?.[key] ?? primary[key];
  const profile: BusinessProfile = {
    ...primary,
    main_slug: mainSlug,
    summary: firstValue('summary') as string,
    phone: firstValue('phone') as string | null,
    address: firstValue('address') as string | null,
    service_area: firstValue('service_area') as string | null,
    hours: firstValue('hours') as string | null,
    specialties: firstValue('specialties') as string | null,
    year_founded: firstValue('year_founded') as number | null,
    license_number: firstValue('license_number') as string | null,
    logo_url: firstValue('logo_url') as string | null,
    photo_urls: firstValue('photo_urls') as string,
    owner_email: firstValue('owner_email') as string | null,
    tier: firstValue('tier') as string,
    stripe_customer_id: firstValue('stripe_customer_id') as string | null,
    stripe_subscription_id: firstValue('stripe_subscription_id') as string | null,
    public_email: firstValue('public_email') as string | null,
    email_source_url: firstValue('email_source_url') as string | null,
    email_verified_at: firstValue('email_verified_at') as string | null,
    regions: [...new Set(placements.map((business) => business.region))],
    trades: [...new Set(placements.map((business) => business.trade))],
    placements,
  };
  const legacy = direct.slug === slug && mainSlug !== slug;
  return { profile, legacy };
}

export async function sha256(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function randomToken() {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)), (byte) => byte.toString(16).padStart(2, '0')).join('');
}
