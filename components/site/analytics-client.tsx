'use client';

import { useEffect } from 'react';

const COOKIE = 'wkap_src';
const NO_COUNT = 'wkap_nocount';
const clean = (value: string | null, limit = 80) => (value || '').trim().toLowerCase().replace(/[^a-z0-9._~+-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, limit);

/**
 * Remembers where a visitor came from (UTM tags, or the external referrer's host) in a
 * first-party cookie for 30 days, so server-confirmed conversions can be attributed.
 * Stores no personal information.
 */
export function AttributionCapture() {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const source = clean(params.get('utm_source'));
      const existing = document.cookie.split('; ').some((item) => item.startsWith(`${COOKIE}=`));
      let value: Record<string, string> | null = null;
      if (source) {
        value = { s: source, m: clean(params.get('utm_medium')), c: clean(params.get('utm_campaign')) };
      } else if (!existing && document.referrer) {
        const host = new URL(document.referrer).hostname.replace(/^www\./, '');
        if (host && host !== window.location.hostname.replace(/^www\./, '')) value = { r: clean(host, 120) };
      }
      if (value) {
        document.cookie = `${COOKIE}=${encodeURIComponent(JSON.stringify(value))}; Max-Age=${30 * 86_400}; Path=/; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
      }
    } catch { /* Attribution is optional. */ }
    countVisit();
  }, []);
  return null;
}

/**
 * One anonymous "site_visit" per browser tab session, for /admin/stats (visits per day, by source,
 * city, and category). Owner and admin pages, and browsers with "Don't count my visits" on, are skipped.
 * The only thing kept on the device is a visit count, used to tell new visitors from returning ones.
 */
function countVisit() {
  try {
    const path = window.location.pathname;
    if (/^\/(admin|dashboard|api)(\/|$)/.test(path)) return;
    if (document.cookie.split('; ').includes(`${NO_COUNT}=1`)) return;
    if (sessionStorage.getItem('wkap_visit')) return;
    sessionStorage.setItem('wkap_visit', '1');
    const before = Number(localStorage.getItem('wkap_visits') || '0') || 0;
    localStorage.setItem('wkap_visits', String(before + 1));
    const [region, trade] = path.split('/').filter(Boolean);
    sendClientEvent('site_visit', { region, trade, visit: before > 0 ? 'returning' : 'new' });
  } catch { /* Counting is optional. */ }
}

type ClientEvent = 'pricing_viewed' | 'claim_page_viewed' | 'claim_started' | 'site_visit';

export function sendClientEvent(event: ClientEvent, extra: { region?: string; trade?: string; plan?: string; business?: string; visit?: 'new' | 'returning' } = {}) {
  try {
    const body = JSON.stringify({
      event,
      path: window.location.pathname,
      wd: Boolean((navigator as Navigator & { webdriver?: boolean }).webdriver),
      ...extra,
    });
    void fetch('/api/events', { method: 'POST', headers: { 'content-type': 'application/json' }, body, keepalive: true }).catch(() => {});
  } catch { /* Tracking never blocks the page. */ }
}

/** Fires one page-level funnel event after hydration (so non-JS scrapers are never counted). */
export function PageEvent({ event, region, trade, plan, business }: { event: ClientEvent; region?: string; trade?: string; plan?: string; business?: string }) {
  useEffect(() => {
    sendClientEvent(event, { region, trade, plan, business });
  }, [event, region, trade, plan, business]);
  return null;
}
