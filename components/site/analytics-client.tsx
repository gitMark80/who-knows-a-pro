'use client';

import { useEffect } from 'react';

const COOKIE = 'wkap_src';
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
  }, []);
  return null;
}

type ClientEvent = 'pricing_viewed' | 'claim_page_viewed' | 'claim_started';

export function sendClientEvent(event: ClientEvent, extra: { region?: string; trade?: string; plan?: string; business?: string } = {}) {
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
