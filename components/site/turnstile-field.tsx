'use client';

import { useEffect, useRef, useState } from 'react';

type TurnstileApi = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};
declare global {
  interface Window { turnstile?: TurnstileApi }
}

export const TURNSTILE_RESET_EVENT = 'wkap-turnstile-reset';
const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
let scriptPromise: Promise<void> | null = null;

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = SCRIPT_URL;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => { scriptPromise = null; reject(new Error('Turnstile failed to load')); };
      document.head.appendChild(script);
    });
  }
  return scriptPromise;
}

/**
 * Cloudflare Turnstile, rendered only when NEXT_PUBLIC_TURNSTILE_SITE_KEY is configured.
 * "interaction-only" keeps it invisible for most visitors; the server verifies the token.
 * Forms dispatch TURNSTILE_RESET_EVENT after a failed submission because tokens are single-use.
 */
export function TurnstileField({ action }: { action: 'claim' | 'quote' }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const container = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const [token, setToken] = useState('');
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!siteKey || !container.current) return;
    let cancelled = false;
    loadTurnstile().then(() => {
      if (cancelled || !container.current || !window.turnstile) return;
      widget.current = window.turnstile.render(container.current, {
        sitekey: siteKey,
        action,
        appearance: 'interaction-only',
        callback: (value: string) => { setToken(value); setFailed(false); },
        'expired-callback': () => setToken(''),
        'error-callback': () => { setToken(''); setFailed(true); },
      });
    }).catch(() => setFailed(true));
    const reset = () => {
      setToken('');
      if (widget.current && window.turnstile) window.turnstile.reset(widget.current);
    };
    window.addEventListener(TURNSTILE_RESET_EVENT, reset);
    return () => {
      cancelled = true;
      window.removeEventListener(TURNSTILE_RESET_EVENT, reset);
      if (widget.current && window.turnstile) window.turnstile.remove(widget.current);
      widget.current = null;
    };
  }, [siteKey, action]);

  if (!siteKey) return null;
  return <div className="sm:col-span-2">
    <div ref={container}/>
    <input type="hidden" name="turnstileToken" value={token}/>
    {failed ? <p className="mt-2 text-xs text-slate-500">The security check could not load. Refresh the page or try another browser if submitting fails.</p> : null}
  </div>;
}
