import { config, sha256, sqlOne, sqlRun } from '@/db/runtime';

export const MINUTE = 60_000;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;

/** Client IP as reported by Vercel's edge (which overwrites spoofed forwarding headers). */
export function clientIp(request: Request) {
  const value = request.headers.get('x-vercel-forwarded-for')
    || request.headers.get('x-forwarded-for')
    || request.headers.get('x-real-ip')
    || 'unknown';
  return value.split(',')[0].trim().slice(0, 80) || 'unknown';
}

/** Two-letter country from Vercel's geolocation header, used only for aggregate diagnostics. */
export function requestCountry(request: Request) {
  const value = (request.headers.get('x-vercel-ip-country') || '').trim().toUpperCase();
  return /^[A-Z]{2}$/.test(value) ? value : null;
}

const automationPattern = /bot|crawl|spider|slurp|headless|phantom|puppeteer|playwright|selenium|webdriver|python|curl|wget|httpclient|okhttp|go-http|scrapy|axios|node-fetch|undici|java\/|libwww|preview|facebookexternalhit|lighthouse|pagespeed|gtmetrix|monitor/i;

/** Self-identified automation. Real browsers are never matched; disguised bots are handled by rate limits and Turnstile. */
export function isAutomatedUserAgent(userAgent: string | null | undefined) {
  const agent = (userAgent || '').trim();
  return !agent || automationPattern.test(agent);
}

/**
 * Browsers always send Origin on cross-origin and same-origin POST/PATCH requests.
 * Requiring it to match the host blocks cross-site form posts and most scripted abuse.
 * Never apply this to the Stripe webhook.
 */
export function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  // Some privacy settings send "Origin: null" on same-site form posts; the browser's own
  // Sec-Fetch-Site header (not settable by scripts) still proves the request came from this site.
  if (origin === 'null') return request.headers.get('sec-fetch-site') === 'same-origin';
  if (!origin) return false;
  const host = (request.headers.get('x-forwarded-host') || request.headers.get('host') || new URL(request.url).host).split(',')[0].trim().toLowerCase();
  try {
    return new URL(origin).host.toLowerCase() === host;
  } catch {
    return false;
  }
}

/** Salted, one-way identifier so rate-limit rows never contain a raw IP or email address. */
export async function privateKey(value: string) {
  const salt = config('RATE_LIMIT_SALT') || config('TURSO_AUTH_TOKEN') || 'wkap-rate-limit';
  return (await sha256(`${salt}|${value.toLowerCase()}`)).slice(0, 40);
}

type Limit = { bucket: string; id: string; limit: number; windowMs: number };

/**
 * Fixed-window counter stored in Turso. Returns true when the request is over the limit.
 * Fails open (and logs) if the counter itself cannot be written, so a storage hiccup
 * never locks real customers out; Turnstile and honeypots still apply.
 */
export async function overLimit({ bucket, id, limit, windowMs }: Limit) {
  const now = Date.now();
  const windowStart = Math.floor(now / windowMs) * windowMs;
  try {
    const key = `${bucket}:${await privateKey(id)}`;
    const row = await sqlOne<{ count: number }>(
      `INSERT INTO rate_limits (key, window_start, count) VALUES (?, ?, 1)
       ON CONFLICT(key) DO UPDATE SET
         count = CASE WHEN rate_limits.window_start = excluded.window_start THEN rate_limits.count + 1 ELSE 1 END,
         window_start = excluded.window_start
       RETURNING count`,
      [key, windowStart],
    );
    if (Math.random() < 0.01) {
      await sqlRun('DELETE FROM rate_limits WHERE window_start < ?', [now - 2 * DAY]);
    }
    return Number(row?.count ?? 0) > limit;
  } catch (error) {
    console.error(`Rate limit check failed for ${bucket}`, error);
    return false;
  }
}

/** Checks every limit (so each window counts the attempt) and reports whether any was exceeded. */
export async function anyOverLimit(limits: Limit[]) {
  const results = await Promise.all(limits.map(overLimit));
  return results.some(Boolean);
}

/**
 * Forms record how long the visitor spent before submitting. Humans need several seconds
 * to fill in a claim or quote form; scripted submissions arrive almost instantly.
 * Missing values are allowed so cached pages from before this change keep working.
 */
export function submittedTooFast(value: unknown, minimumMs = 1_000) {
  const elapsed = Number(value);
  return Number.isFinite(elapsed) && elapsed >= 0 && elapsed < minimumMs;
}

/** Enforced only when BOTH keys are set, so a half-configured deploy can never block every form. */
export function turnstileEnabled() {
  return Boolean(config('TURNSTILE_SECRET_KEY') && config('NEXT_PUBLIC_TURNSTILE_SITE_KEY'));
}

/**
 * Mandatory server-side Cloudflare Turnstile verification whenever TURNSTILE_SECRET_KEY is set.
 * Fails closed: a missing, reused, expired, or wrong-action token is rejected.
 */
export async function verifyTurnstile(token: unknown, ip: string, action: string) {
  if (!turnstileEnabled()) return true;
  const secret = config('TURNSTILE_SECRET_KEY');
  if (typeof token !== 'string' || !token || token.length > 2_048) return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip && ip !== 'unknown') body.set('remoteip', ip);
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(8_000),
    });
    const result = await response.json() as { success?: boolean; action?: string; 'error-codes'?: string[] };
    if (!result.success) {
      console.warn('Turnstile rejected a submission', result['error-codes']);
      return false;
    }
    return !result.action || result.action === action;
  } catch (error) {
    console.error('Turnstile verification unavailable', error);
    return false;
  }
}
