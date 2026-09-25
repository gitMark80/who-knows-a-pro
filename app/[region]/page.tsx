import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { ArrowRight, MapPin, Wrench } from 'lucide-react';
import { Footer } from '@/components/site/footer';
import { Header } from '@/components/site/header';
import { SearchBox } from '@/components/site/search-box';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { activeRegions, trades } from '@/data/catalog';
import { listCategoryCounts } from '@/db/runtime';
import { SITE_URL } from '@/lib/business-profile';

export const dynamic = 'force-dynamic';

const loadCategoryCounts = cache(async (region: string) => {
  try {
    return { counts: await listCategoryCounts(region), unavailable: false };
  } catch {
    return { counts: [] as Awaited<ReturnType<typeof listCategoryCounts>>, unavailable: true };
  }
});

export function generateStaticParams() {
  return activeRegions.map((region) => ({ region: region.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ region: string }> }): Promise<Metadata> {
  const { region: regionSlug } = await params;
  const region = activeRegions.find((item) => item.slug === regionSlug);
  if (!region) return { title: 'Browse local businesses', description: 'Browse local businesses by region and category.' };
  const { counts, unavailable } = await loadCategoryCounts(region.slug);
  const listedCategories = counts.filter((item) => item.count > 0).length;
  return {
    title: `Local businesses in ${region.name}`,
    description: unavailable
      ? `Browse service categories and business profiles serving ${region.name} on Who Knows a Pro.`
      : `Browse ${listedCategories} service ${listedCategories === 1 ? 'category' : 'categories'} with business listings in ${region.name}. Compare available details and contact businesses directly.`,
    alternates: { canonical: `/${region.slug}` },
  };
}

export default async function RegionPage({ params }: { params: Promise<{ region: string }> }) {
  const { region: regionSlug } = await params;
  const region = activeRegions.find((item) => item.slug === regionSlug);
  if (!region) notFound();

  const { counts, unavailable } = await loadCategoryCounts(region.slug);
  const countMap = new Map(counts.map((item) => [item.trade, item.count]));
  const listedCategories = trades.filter((trade) => (countMap.get(trade.slug) ?? 0) > 0);
  const totalBusinesses = counts.reduce((total, item) => total + item.count, 0);
  const city = region.name.replace(/,\s*[A-Z]{2}$/, '');
  const breadcrumbItems = [{ label: 'Home', href: '/' }, { label: region.name }];
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: region.name, item: `${SITE_URL}/${region.slug}` },
    ],
  };
  const categoryListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Business categories in ${region.name}`,
    numberOfItems: listedCategories.length,
    itemListElement: listedCategories.map((trade, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: trade.name,
      url: `${SITE_URL}/${region.slug}/${trade.slug}`,
    })),
  };

  return <>
    <JsonLd id="city-breadcrumbs" data={breadcrumbJsonLd}/>
    {!unavailable ? <JsonLd id="city-category-list" data={categoryListJsonLd}/> : null}
    <Header/>
    <main>
      <section className="border-b border-slate-200 bg-[#eef3f8]">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12">
          <Breadcrumbs items={breadcrumbItems}/>
          <p className="eyebrow mt-5 flex items-center gap-2"><MapPin className="size-4"/>{region.name}</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-.045em] text-[#142c4c] sm:text-6xl">Local businesses in {region.name}</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">{unavailable
            ? `Browse service categories for ${region.name}, open business profiles, and contact providers directly.`
            : `Browse ${listedCategories.length} categories with ${totalBusinesses} ${totalBusinesses === 1 ? 'business listing' : 'business listings'} for ${city}. Profiles show the information available in the directory, including official websites and any details supplied by verified owners. Choose a category to compare businesses and contact them directly.`}</p>
          <div className="mt-7 max-w-3xl"><SearchBox key={region.slug} compact initialRegion={region.slug}/></div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="eyebrow">Browse services</p><h2 className="mt-2 text-3xl font-black text-[#142c4c]">Choose a category</h2></div>
          {!unavailable ? <p className="text-sm text-slate-500">{listedCategories.length} categories with listings</p> : null}
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {trades.map((trade) => {
            const count = countMap.get(trade.slug) ?? 0;
            return <a key={trade.slug} href={`/${region.slug}/${trade.slug}`} className="group flex min-h-28 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_35px_rgba(15,35,60,.05)] transition hover:-translate-y-0.5 hover:border-[#ec7d2c]">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#eef3f8] text-[#d96c20]"><Wrench className="size-5"/></span>
              <span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-3 font-extrabold text-[#142c4c]">{trade.name}<ArrowRight className="size-4 shrink-0 transition group-hover:translate-x-1"/></span>{!unavailable ? <span className="mt-1 block text-xs text-slate-500">{count > 0 ? `${count} ${count === 1 ? 'business' : 'businesses'}` : 'No listings yet'}</span> : null}</span>
            </a>;
          })}
        </div>
      </section>
    </main>
    <Footer/>
  </>;
}
