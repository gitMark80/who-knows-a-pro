import { config } from '@/db/runtime';

export const PUBLIC_SITE_URL = 'https://whoknowsapro.com';

export function requestOrigin(request: Request) {
  const vercelUrl = config('VERCEL_URL');
  if (config('VERCEL_ENV') === 'preview' && vercelUrl) return `https://${vercelUrl}`;
  const configured = config('SITE_URL');
  if (configured) return configured.replace(/\/$/, '');
  return new URL(request.url).origin;
}
