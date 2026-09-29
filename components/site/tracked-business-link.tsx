'use client';

import type { ComponentProps, MouseEvent } from 'react';

type Props = Omit<ComponentProps<'a'>, 'onClick' | 'onAuxClick'> & {
  businessSlug: string;
  action: 'website' | 'phone';
  source: 'listing' | 'profile';
};

export function TrackedBusinessLink({ businessSlug, action, source, ...props }: Props) {
  function record(event: MouseEvent<HTMLAnchorElement>) {
    if (!event.isTrusted || (event.type === 'auxclick' && event.button !== 1)) return;
    // Tracking must never delay or prevent the visitor's chosen navigation.
    void fetch('/api/business-clicks', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ slug: businessSlug, action, source }), keepalive: true,
    }).catch(() => {});
  }
  return <a {...props} onClick={record} onAuxClick={record}/>;
}
