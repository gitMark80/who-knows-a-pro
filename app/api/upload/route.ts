import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { currentBusiness } from '@/db/auth';
import { config, sqlRun } from '@/db/runtime';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const business = await currentBusiness();
  if (!business) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
  if (!['enhanced', 'featured', 'sponsored'].includes(business.tier)) {
    return NextResponse.json({ error: 'Upgrade to add logos and photos.' }, { status: 403 });
  }
  if (!config('BLOB_READ_WRITE_TOKEN')) {
    return NextResponse.json({ error: 'File uploads are temporarily unavailable.' }, { status: 503 });
  }

  const form = await request.formData();
  const file = form.get('file');
  const kind = String(form.get('kind') || '');
  if (!(file instanceof File) || !['logo', 'photo'].includes(kind)) {
    return NextResponse.json({ error: 'Invalid upload.' }, { status: 400 });
  }
  if (file.size > 5_000_000 || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    return NextResponse.json({ error: 'Use JPG, PNG, or WebP under 5 MB.' }, { status: 400 });
  }

  const extension = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
  const blob = await put(`businesses/${business.id}/${kind}.${extension}`, file, {
    access: 'private',
    addRandomSuffix: true,
    contentType: file.type,
  });
  const imageUrl = `/api/photos/${encodeURIComponent(business.id)}/${encodeURIComponent(blob.pathname.split('/').pop()!)}`;

  if (kind === 'logo') {
    await sqlRun('UPDATE businesses SET logo_url = ?, updated_at = ? WHERE id = ?', [imageUrl, Date.now(), business.id]);
  } else {
    let photos: string[] = [];
    try { photos = JSON.parse(business.photo_urls || '[]') as string[]; } catch {}
    photos = [...photos, imageUrl].slice(-6);
    await sqlRun('UPDATE businesses SET photo_urls = ?, updated_at = ? WHERE id = ?', [JSON.stringify(photos), Date.now(), business.id]);
  }
  return NextResponse.json({ url: imageUrl });
}
