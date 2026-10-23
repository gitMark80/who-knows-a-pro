'use client';

import { useEffect } from 'react';

export function ProfileViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    void fetch('/api/profile-views', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ slug, wd: Boolean((navigator as Navigator & { webdriver?: boolean }).webdriver) }),
      keepalive: true,
    }).catch(() => {});
  }, [slug]);
  return null;
}
