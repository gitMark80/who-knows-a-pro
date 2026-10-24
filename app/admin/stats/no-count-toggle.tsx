'use client';

import { useSyncExternalStore } from 'react';

const COOKIE = 'wkap_nocount';
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const isOn = () => document.cookie.split('; ').includes(`${COOKIE}=1`);

/** Sets a first-party cookie on this browser so its visits, profile views, and clicks aren't counted. */
export function NoCountToggle() {
  const on = useSyncExternalStore(subscribe, isOn, () => false);
  const change = (checked: boolean) => {
    const secure = location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = checked
      ? `${COOKIE}=1; Max-Age=${5 * 365 * 86_400}; Path=/; SameSite=Lax${secure}`
      : `${COOKIE}=; Max-Age=0; Path=/; SameSite=Lax${secure}`;
    listeners.forEach((listener) => listener());
  };
  return (
    <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-700">
      <input type="checkbox" checked={on} onChange={(event) => change(event.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-[#142c4c]" />
      <span>
        <strong>Don&apos;t count my visits on this browser.</strong> Your page visits, profile views, and website/phone clicks won&apos;t be
        counted here or in businesses&apos; results. Turn it on on each phone and computer you use.
      </span>
    </label>
  );
}
