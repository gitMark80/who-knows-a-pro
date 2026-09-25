import { directorySeed } from '@/data/directory';

export type Business = {
  id: string;
  name: string;
  slug: string;
  region: string;
  trade: string;
  location: string;
  summary: string;
  website: string;
  phone: string | null;
  logo_url: string | null;
  photo_urls: string;
  owner_email: string | null;
  tier: string;
  approved: number;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
};

function publicBusiness(seed: (typeof directorySeed)[number]): Business {
  return {
    ...seed,
    phone: null,
    logo_url: null,
    photo_urls: '[]',
    owner_email: null,
    tier: 'free',
    approved: 1,
    stripe_customer_id: null,
    stripe_subscription_id: null,
  };
}

const publicDirectory = directorySeed.map(publicBusiness);

export async function seedDirectory() {
  return;
}

export async function listBusinesses(region?: string, trade?: string): Promise<Business[]> {
  const seen = new Set<string>();
  return publicDirectory
    .filter((business) => (!region || business.region === region) && (!trade || business.trade === trade))
    .filter((business) => {
      let website = business.website.trim().toLowerCase().replace(/\/+$/, '');
      try {
        const url = new URL(business.website);
        website = `${url.hostname.replace(/^www\./, '').toLowerCase()}${url.pathname.replace(/\/+$/, '').toLowerCase()}`;
      } catch {}
      const key = `${business.region}|${business.trade}|${website}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 200);
}

export async function listBusinessSlugs(): Promise<{ slug: string; updated_at: number }[]> {
  const updatedAt = Date.UTC(2026, 8, 25);
  return publicDirectory.map(({ slug }) => ({ slug, updated_at: updatedAt }));
}

export async function listListedDirectoryPairs(): Promise<{ region: string; trade: string }[]> {
  const seen = new Set<string>();
  const pairs: { region: string; trade: string }[] = [];
  for (const business of publicDirectory) {
    const key = `${business.region}|${business.trade}`;
    if (seen.has(key)) continue;
    seen.add(key);
    pairs.push({ region: business.region, trade: business.trade });
  }
  return pairs.sort((a, b) => a.region.localeCompare(b.region) || a.trade.localeCompare(b.trade));
}

export async function getBusiness(id: string): Promise<Business | null> {
  return publicDirectory.find((business) => business.id === id || business.slug === id) ?? null;
}

export async function sha256(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function randomToken() {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function config(name: string): string {
  return (process.env[name] || '').trim();
}
