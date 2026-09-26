import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ArrowLeft, BadgeCheck } from 'lucide-react';
import { Footer } from '@/components/site/footer';
import { Header } from '@/components/site/header';
import { regions, trades } from '@/data/catalog';
import { currentBusiness } from '@/db/auth';
import { getBusinessProfile, type Business } from '@/db/runtime';
import { getBusinessPerformance } from '@/db/revenue';
import { DashboardForm } from './dashboard-form';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Business dashboard', alternates: { canonical: '/dashboard' }, robots: { index: false, follow: false } };

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ plan?: string; region?: string; trade?: string; checkout?: string }> }) {
  const query = await searchParams;
  let business = null;
  try { business = await currentBusiness(); } catch {}
  if (!business) redirect('/claim');
  const profileResult = await getBusinessProfile(business.main_slug || business.slug);
  const profile = profileResult?.profile || business;
  const placements: Business[] = profileResult?.profile.placements || [business];
  const pageOptions = [...new Map<string, { region: string; trade: string; label: string }>(placements.map((placement) => {
    const region = regions.find((item) => item.slug === placement.region);
    const trade = trades.find((item) => item.slug === placement.trade);
    return [`${placement.region}|${placement.trade}`, {
      region: placement.region,
      trade: placement.trade,
      label: `${trade?.name || placement.trade} in ${region?.name || placement.location}`,
    }];
  })).values()];
  const stats = await getBusinessPerformance(profile.main_slug || profile.slug, placements);
  const requestedPlan = query.plan === 'featured' || query.plan === 'enhanced' ? query.plan : undefined;
  const requestedPage = pageOptions.find((option) => option.region === query.region && option.trade === query.trade);

  return <><Header/><main className="bg-[#f5f7fa]"><div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
    {!business.is_test ? <a href={`/business/${profile.main_slug || profile.slug}`} className="flex items-center gap-1 text-sm font-bold text-slate-600"><ArrowLeft className="size-4"/>View public profile</a> : <p className="rounded-xl border border-amber-300 bg-amber-50 p-4 font-semibold">Private billing test — excluded from public listings, search, counts, and the sitemap. No public profile is available. Live Checkout charges real money. After refunding and canceling, ask the site administrator to remove this test profile.</p>}
    <div className="my-7 flex items-start gap-3"><span className="grid size-12 place-items-center rounded-2xl bg-[#142c4c] text-white"><BadgeCheck/></span><div><p className="eyebrow">Business dashboard</p><h1 className="mt-1 text-3xl font-black tracking-tight">{profile.name}</h1></div></div>
    <DashboardForm
      business={profile}
      pageOptions={pageOptions}
      stats={stats}
      requestedPlan={requestedPlan}
      requestedPage={requestedPage ? `${requestedPage.region}|${requestedPage.trade}` : undefined}
      checkoutState={query.checkout}
    />
  </div></main><Footer/></>;
}
