/* eslint-disable @next/next/no-html-link-for-pages -- Native anchors keep navigation consistent with the rest of the site. */
import type { Metadata } from 'next';
import { ShieldCheck } from 'lucide-react';
import { Footer } from '@/components/site/footer';
import { Header } from '@/components/site/header';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Confirm your business claim',
  robots: { index: false, follow: false },
  referrer: 'same-origin',
};

export default async function VerifyClaimPage({ searchParams }: { searchParams: Promise<{ token?: string | string[] }> }) {
  const { token } = await searchParams;
  const value = typeof token === 'string' ? token.slice(0, 200) : '';
  return <><Header/><main className="min-h-[60vh] bg-[#f5f7fa] px-5 py-16 sm:px-8">
    <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-xl shadow-slate-200/40 sm:p-9">
      <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#e6edf4]"><ShieldCheck className="size-6 text-[#142c4c]"/></span>
      {value ? <>
        <h1 className="mt-5 text-2xl font-black tracking-tight text-[#142c4c]">Confirm and open your dashboard</h1>
        <p className="mt-3 leading-7 text-slate-600">One more click confirms it’s really you. This step keeps automated email scanners from using your link before you do.</p>
        <form action="/api/verify-claim" method="post" className="mt-7">
          <input type="hidden" name="token" value={value}/>
          <button type="submit" className="h-12 w-full rounded-xl bg-[#ec7d2c] px-5 font-extrabold text-white hover:bg-[#d96c20]">Confirm and continue</button>
        </form>
        <p className="mt-4 text-xs leading-5 text-slate-500">The link works once and expires 24 hours after it was sent.</p>
      </> : <>
        <h1 className="mt-5 text-2xl font-black tracking-tight text-[#142c4c]">This link is incomplete</h1>
        <p className="mt-3 leading-7 text-slate-600">Open the link from your email again, or request a new one.</p>
        <a href="/claim" className="mt-6 inline-flex rounded-xl bg-[#142c4c] px-5 py-3 font-extrabold text-white">Request a new link</a>
      </>}
    </div>
  </main><Footer/></>;
}
