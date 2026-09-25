import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { Footer } from '@/components/site/footer';
import { Header } from '@/components/site/header';
import { ListingCard } from '@/components/site/listing-card';
import { SearchBox } from '@/components/site/search-box';
import { activeRegions, trades } from '@/data/catalog';
import { listBusinesses } from '@/db/runtime';

export const dynamic = 'force-dynamic';

const loadDirectory = cache(async (region: string, trade: string) => {
  try {
    return { businesses: await listBusinesses(region, trade), unavailable: false };
  } catch {
    return {
      businesses: [] as Awaited<ReturnType<typeof listBusinesses>>,
      unavailable: true,
    };
  }
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string; trade: string }>;
}): Promise<Metadata> {
  const { region: regionSlug, trade: tradeSlug } = await params;
  const region = activeRegions.find((item) => item.slug === regionSlug);
  const trade = trades.find((item) => item.slug === tradeSlug);
  if (!region || !trade) {
    return { title: 'Local pros', description: 'Find local service businesses.' };
  }

  const { businesses, unavailable } = await loadDirectory(region.slug, trade.slug);
  return {
    title: `${trade.name} in ${region.name}`,
    description: `Find and compare ${trade.name.toLowerCase()} businesses serving ${region.name}. View local profiles, services, and contact information.`,
    robots: !unavailable && businesses.length === 0 ? { index: false, follow: true } : undefined,
  };
}

export default async function DirectoryPage({
  params,
}: {
  params: Promise<{ region: string; trade: string }>;
}) {
  const { region: regionSlug, trade: tradeSlug } = await params;
  const region = activeRegions.find((item) => item.slug === regionSlug);
  const trade = trades.find((item) => item.slug === tradeSlug);
  if (!region || !trade) notFound();

  const { businesses, unavailable } = await loadDirectory(region.slug, trade.slug);
  return <><Header/><main>
    <section className="border-b border-slate-200 bg-[#eef3f8]">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <p className="eyebrow"><a href={`/${region.slug}`} className="hover:underline">{region.name}</a></p>
        <h1 className="mt-3 text-4xl font-black tracking-[-.045em] text-[#142c4c] sm:text-6xl">{trade.name}</h1>
        <p className="mt-4 max-w-2xl text-slate-600">Compare local providers, view their services, and contact the business that fits your project.</p>
        <div className="mt-7 max-w-3xl"><SearchBox key={`${region.slug}/${trade.slug}`} compact initialRegion={region.slug} initialTrade={trade.slug}/></div>
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <div className="flex items-end justify-between">
        <div><p className="eyebrow">Directory results</p><h2 className="mt-2 text-2xl font-black text-[#142c4c]">Pros serving {region.name}</h2></div>
        <p className="text-sm text-slate-500">{businesses.length} {businesses.length === 1 ? 'business' : 'businesses'}</p>
      </div>
      {unavailable
        ? <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">The directory is temporarily unavailable. Please try again shortly.</div>
        : businesses.length
          ? <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{businesses.map((business) => <ListingCard key={business.id} business={business}/>)}</div>
          : <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <h3 className="text-xl font-extrabold">No {trade.name.toLowerCase()} pros listed here yet.</h3>
            <p className="mt-2 text-slate-600">Own a {trade.name.toLowerCase()} business in {region.name}? Claim a free listing.</p>
            <a href={`/claim?region=${encodeURIComponent(region.slug)}&trade=${encodeURIComponent(trade.slug)}`} className="mt-5 inline-flex rounded-xl bg-[#ec7d2c] px-5 py-3 font-extrabold text-white">Claim a free listing</a>
          </div>}
    </section>
  </main><Footer/></>;
}
