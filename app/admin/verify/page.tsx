import type { Metadata } from 'next';
import { Footer } from '@/components/site/footer';
import { Header } from '@/components/site/header';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Confirm admin sign-in', robots: { index: false, follow: false }, referrer: 'same-origin' };

export default async function AdminVerifyPage({ searchParams }: { searchParams: Promise<{ token?: string | string[] }> }) {
  const { token } = await searchParams;
  const value = typeof token === 'string' ? token.slice(0, 200) : '';
  return <><Header/><main className="min-h-[60vh] bg-[#f5f7fa] px-5 py-16">
    <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-7 text-center">
      <h1 className="text-2xl font-black text-[#142c4c]">Confirm admin sign-in</h1>
      {value ? <form action="/api/admin/verify" method="post" className="mt-6">
        <input type="hidden" name="token" value={value}/>
        <button type="submit" className="h-12 w-full rounded-xl bg-[#142c4c] px-5 font-extrabold text-white">Sign in</button>
      </form> : <p className="mt-3 text-slate-600">This sign-in link is incomplete. Request a new one from the admin page.</p>}
    </div>
  </main><Footer/></>;
}
