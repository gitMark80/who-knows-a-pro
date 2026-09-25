'use client';

import { useEffect } from 'react';

export function ProfileViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    void fetch('/api/profile-views', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ slug }),
      keepalive: true,
    });
  }, [slug]);
  return null;
}
