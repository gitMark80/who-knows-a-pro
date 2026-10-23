import type { Metadata } from 'next';
import Link from 'next/link';
import { BadgeCheck, CreditCard, Image, PencilLine } from 'lucide-react';
import { PageEvent } from '@/components/site/analytics-client';
import { Footer } from '@/components/site/footer';
import { Header } from '@/components/site/header';
import { activeRegions, trades } from '@/data/catalog';
import { getBusiness } from '@/db/runtime';
import { BusinessFinder } from './business-finder';
import { ClaimForm } from './claim-form';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Claim your business',
  description: 'Claim and manage your Who Knows a Pro business profile.',
  alternates: { canonical: '/claim' },
  robots: { index: false, follow: true },
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
    [BadgeCheck, 'Free, verified listing', 'A “Claimed business” badge shows customers the details come from you. No card required.'],
    [PencilLine, 'Fix and complete your details', 'Add your phone, service area, hours, specialties, license number, and a short description.'],
    [Image, 'See real activity', 'Your dashboard shows profile views and website and phone clicks measured on this site.'],
    [CreditCard, 'Upgrade only if it helps', 'Enhanced ($29/mo) and Featured ($99/mo) are optional and cancel anytime.'],
  ] as const;
  const errorMessage = verificationError === 'claimed'
    ? 'That listing is already managed by another verified owner. Submit a request below and we will review it.'
    : verificationError
      ? 'That verification link is invalid, expired, or already used. Submit the form again for a new link.'
      : '';
  return <><Header/><main className="bg-[#f5f7fa]"><div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[.8fr_1.2fr]"><div>
    <p className="eyebrow">For business owners</p>
    <h1 className="mt-3 text-4xl font-black tracking-[-.05em] sm:text-5xl">Claim your business profile.</h1>
    <p className="mt-5 text-lg leading-8 text-slate-600">Claiming is free. Verify that you represent the business, correct your information, and see how customers interact with your profile.</p>
    <ol className="mt-6 space-y-2 text-sm font-semibold text-[#142c4c]">
      <li><span className="mr-2 inline-grid size-6 place-items-center rounded-full bg-[#142c4c] text-xs text-white">1</span>Find your listing (or add it)</li>
      <li><span className="mr-2 inline-grid size-6 place-items-center rounded-full bg-[#142c4c] text-xs text-white">2</span>Verify by email — instant with a business-domain address</li>
      <li><span className="mr-2 inline-grid size-6 place-items-center rounded-full bg-[#142c4c] text-xs text-white">3</span>Update your profile from your dashboard</li>
      <li><span className="mr-2 inline-grid size-6 place-items-center rounded-full bg-[#142c4c] text-xs text-white">4</span>Upgrade later if you want more visibility</li>
    </ol>
    <p className="mt-5 text-sm font-semibold text-[#27715c]">Every claim includes a copy-and-paste “Find us on Who Knows a Pro” website badge.</p>
    {errorMessage ? <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{errorMessage}</p> : null}
    <div className="mt-8 space-y-5">{benefits.map(([Icon, title, copy]) => <div key={title} className="flex gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#e6edf4]"><Icon className="size-4 text-[#142c4c]"/></span><div><h2 className="font-extrabold">{title}</h2><p className="mt-1 text-sm leading-6 text-slate-600">{copy}</p></div></div>)}</div>
    <Link href="/pricing" className="mt-7 inline-flex font-extrabold text-[#d96c20] underline underline-offset-4">Compare free and paid plans</Link>
  </div><div className="space-y-6">{!business ? <BusinessFinder/> : null}{!business ? <p className="px-1 text-xs font-black uppercase tracking-wider text-[#35516d]">Not listed yet? Add your business</p> : null}{business?.owner_email && !business.is_test ? <p className="rounded-xl border border-[#bed0df] bg-[#eef3f8] p-4 text-sm font-semibold text-[#142c4c]">This listing is already claimed. If you manage it, submit the form with the owner email address to get a new sign-in link.</p> : null}{business?.is_test ? <p className="mb-5 rounded-xl border border-amber-300 bg-amber-50 p-4 font-semibold">WKAP Test Business is a private billing fixture, not a real service provider. Claim only with hello@whoknowsapro.com. It will never appear in public listings or the sitemap.</p> : null}<ClaimForm
    initialBusiness={business ? { id: business.id, name: business.name, website: business.website, location: business.location, region: business.region, trade: business.trade } : null}
    initialRegion={requestedRegion}
    initialTrade={requestedTrade}
    requestedPlan={requestedPlan}
  /></div></div></main><Footer/><PageEvent event="claim_page_viewed" region={business?.region || requestedRegion} trade={business?.trade || requestedTrade} plan={requestedPlan} business={business ? business.main_slug || business.slug : undefined}/></>;
}
