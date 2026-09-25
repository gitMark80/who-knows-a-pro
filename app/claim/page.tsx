import type { Metadata } from 'next';
import Link from 'next/link';
import { BadgeCheck, CreditCard, Image, PencilLine } from 'lucide-react';
import { Footer } from '@/components/site/footer';
import { Header } from '@/components/site/header';
import { activeRegions, trades } from '@/data/catalog';
import { getBusiness } from '@/db/runtime';
import { ClaimForm } from './claim-form';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Claim your business',
  description: 'Claim and manage your Who Knows a Pro business profile.',
  alternates: { canonical: '/claim' },
};

export default async function ClaimPage({ searchParams }: { searchParams: Promise<{ business?: string | string[]; region?: string | string[]; trade?: string | string[]; plan?: string | string[]; error?: string | string[] }> }) {
  const query = await searchParams;
  const businessId = typeof query.business === 'string' ? query.business : '';
  const requestedRegion = typeof query.region === 'string' && activeRegions.some((region) => region.slug === query.region) ? query.region : undefined;
  const requestedTrade = typeof query.trade === 'string' && trades.some((trade) => trade.slug === query.trade) ? query.trade : undefined;
  const requestedPlan = query.plan === 'featured' || query.plan === 'enhanced' ? query.plan : undefined;
  const verificationError = typeof query.error === 'string' ? query.error : '';
  let business = null;
  if (businessId) {
    try { business = await getBusiness(businessId); } catch {}
  }
  const benefits = [
    [BadgeCheck, 'Verified ownership', 'Business-domain email verification helps prevent false claims.'],
    [PencilLine, 'Manage your details', 'Update contact information, description, service area, and website.'],
    [Image, 'Add your brand', 'Enhanced and Featured plans include a logo and business photo gallery.'],
    [CreditCard, 'Upgrade when ready', 'Choose Enhanced or Featured through secure Stripe Checkout.'],
  ] as const;
  return <><Header/><main className="bg-[#f5f7fa]"><div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[.8fr_1.2fr]"><div>
    <p className="eyebrow">For business owners</p>
    <h1 className="mt-3 text-4xl font-black tracking-[-.05em] sm:text-5xl">Claim your business profile.</h1>
    <p className="mt-5 text-lg leading-8 text-slate-600">Verify ownership, correct your information, and see what your directory profile is doing for your business.</p>
    <p className="mt-3 text-sm font-semibold text-[#27715c]">Every claim includes a copy-and-paste “Find us on Who Knows a Pro” website badge.</p>
    {verificationError ? <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">That verification link is invalid or expired. Submit the form again for a new link.</p> : null}
    <div className="mt-8 space-y-5">{benefits.map(([Icon, title, copy]) => <div key={title} className="flex gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#e6edf4]"><Icon className="size-4 text-[#142c4c]"/></span><div><h2 className="font-extrabold">{title}</h2><p className="mt-1 text-sm leading-6 text-slate-600">{copy}</p></div></div>)}</div>
    <Link href="/pricing" className="mt-7 inline-flex font-extrabold text-[#d96c20] underline underline-offset-4">Compare paid plans</Link>
  </div><ClaimForm
    initialBusiness={business ? { id: business.id, name: business.name, website: business.website, location: business.location, region: business.region, trade: business.trade } : null}
    initialRegion={requestedRegion}
    initialTrade={requestedTrade}
    requestedPlan={requestedPlan}
  /></div></main><Footer/></>;
}
