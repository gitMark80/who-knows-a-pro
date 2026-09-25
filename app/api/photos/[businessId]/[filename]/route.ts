import { get } from '@vercel/blob';
import { getBusiness } from '@/db/runtime';

export const runtime = 'nodejs';

// The store stays private. Only images attached to approved paid listings are
// published through this route; arbitrary Blob paths cannot be requested.
export async function GET(request: Request, context: { params: Promise<{ businessId: string; filename: string }> }) {
  const { businessId, filename } = await context.params;
  if (!/^[a-zA-Z0-9_-]+$/.test(businessId) || !/^[a-zA-Z0-9_.-]+$/.test(filename)) {
    return new Response(null, { status: 404 });
  }
  const business = await getBusiness(businessId);
  if (!business?.approved || !['enhanced', 'featured', 'sponsored'].includes(business.tier)) {
    return new Response(null, { status: 404 });
  }
  const imageUrl = `/api/photos/${encodeURIComponent(businessId)}/${encodeURIComponent(filename)}`;
  let photos: unknown = [];
  try { photos = JSON.parse(business.photo_urls || '[]'); } catch {}
  if (business.logo_url !== imageUrl && !(Array.isArray(photos) && photos.includes(imageUrl))) {
    return new Response(null, { status: 404 });
  }
  const blob = await get(`businesses/${businessId}/${filename}`, {
    access: 'private',
    ifNoneMatch: request.headers.get('if-none-match') || undefined,
  });
  if (!blob) return new Response(null, { status: 404 });
  const headers = new Headers({
    'Cache-Control': 'public, max-age=60, s-maxage=60',
    'ETag': blob.blob.etag,
    'X-Content-Type-Options': 'nosniff',
  });
  if (blob.statusCode === 304) return new Response(null, { status: 304, headers });
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(blob.blob.contentType)) {
    return new Response(null, { status: 404 });
  }
  headers.set('Content-Type', blob.blob.contentType);
  return new Response(blob.stream, { headers });
}
