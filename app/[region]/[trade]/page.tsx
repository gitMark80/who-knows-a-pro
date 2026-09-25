import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { ArrowRight } from 'lucide-react';
import { Footer } from '@/components/site/footer';
import { Header } from '@/components/site/header';
import { ListingCard } from '@/components/site/listing-card';
import { QuoteRequestForm } from '@/components/site/quote-request-form';
import { SearchBox } from '@/components/site/search-box';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { activeRegions, trades, type RegionSlug, type TradeSlug } from '@/data/catalog';
import { nearbyRegionSlugs } from '@/data/nearby-regions';
import { categoryFaqs, categoryIntro, relatedTradeSlugs } from '@/data/seo-content';
import { MIN_INDEXABLE_LISTINGS } from '@/data/directory-config';
import { listBusinesses, listListedDirectoryPairs } from '@/db/runtime';
import { getFeaturedBusiness } from '@/db/revenue';
import { SITE_URL } from '@/lib/business-profile';

export const dynamic = 'force-dynamic';

const loadBusinesses = cache(async (region: string, trade: string) => {
  try {
    return { businesses: await listBusinesses(region, trade), unavailable: false };
  } catch {
    return { businesses: [] as Awaited<ReturnType<typeof listBusinesses>>, unavailable: true };
  }
});

const loadListedPairs = cache(async () => {
  try {
    return { pairs: await listListedDirectoryPairs(), unavailable: false };
  } catch {
    return { pairs: [] as Awaited<ReturnType<typeof listListedDirectoryPairs>>, unavailable: true };
  }
});

const loadFeatured = cache(async (region: string, trade: string) => {
  try { return await getFeaturedBusiness(region, trade); } catch { return null; }
});

export async function generateMetadata({ params }: { params: Promise<{ region: string; trade: string }> }): Promise<Metadata> {
  const { region: regionSlug, trade: tradeSlug } = await params;
  const region = activeRegions.find((item) => item.slug === regionSlug);
  const trade = trades.find((item) => item.slug === tradeSlug);
  if (!region || !trade) return { title: 'Local pros', description: 'Find local service businesses.' };

  const { businesses, unavailable } = await loadBusinesses(region.slug, trade.slug);
  const count = businesses.length;
  const description = unavailable
    ? `Find ${trade.name.toLowerCase()} businesses serving ${region.name}. View available profiles and contact information on Who Knows a Pro.`
    : count > 0
      ? `Compare ${count} local ${trade.name.toLowerCase()} ${count === 1 ? 'business' : 'businesses'} in ${region.name}. See services, service areas, and contact info on Who Knows a Pro.`
      : `No ${trade.name.toLowerCase()} businesses are listed in ${region.name} yet. Business owners can claim a free listing on Who Knows a Pro.`;

  return {
    title: `${trade.name} in ${region.name}`,
    description,
    alternates: { canonical: `/${region.slug}/${trade.slug}` },
    robots: !unavailable && count < MIN_INDEXABLE_LISTINGS ? { index: false, follow: true } : undefined,
  };
}

export default async function DirectoryPage({ params }: { params: Promise<{ region: string; trade: string }> }) {
  const { region: regionSlug, trade: tradeSlug } = await params;
  const region = activeRegions.find((item) => item.slug === regionSlug);
  const trade = trades.find((item) => item.slug === tradeSlug);
  if (!region || !trade) notFound();

  const [{ businesses, unavailable }, listed, featured] = await Promise.all([
    loadBusinesses(region.slug, trade.slug),
    loadListedPairs(),
    loadFeatured(region.slug, trade.slug),
  ]);
  const featuredSlug = featured?.business.main_slug || featured?.business.slug;
  const regularBusinesses = featuredSlug
    ? businesses.filter((business) => (business.main_slug || business.slug) !== featuredSlug)
    : businesses;
  const pairKeys = new Set(listed.pairs.map((pair) => `${pair.region}|${pair.trade}`));
  const relatedTrades = relatedTradeSlugs(trade.slug as TradeSlug)
    .filter((slug) => pairKeys.has(`${region.slug}|${slug}`))
    .map((slug) => trades.find((item) => item.slug === slug))
    .filter((item) => item !== undefined)
    .slice(0, 6);
  const nearbyRegions = nearbyRegionSlugs(region.slug as RegionSlug)
    .filter((slug) => pairKeys.has(`${slug}|${trade.slug}`))
    .map((slug) => activeRegions.find((item) => item.slug === slug))
    .filter((item) => item !== undefined)
    .slice(0, 6);
  const faqs = categoryFaqs(trade.slug as TradeSlug, region);
  const canonical = `${SITE_URL}/${region.slug}/${trade.slug}`;
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: region.name, href: `/${region.slug}` },
    { label: trade.name },
  ];

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: region.name, item: `${SITE_URL}/${region.slug}` },
      { '@type': 'ListItem', position: 3, name: trade.name, item: canonical },
    ],
  };
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${trade.name} in ${region.name}`,
    numberOfItems: businesses.length,
    itemListElement: businesses.map((business, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Organization',
        name: business.name,
        url: `${SITE_URL}/business/${business.main_slug || business.slug}`,
      },
    })),
  };
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  return <>
    <JsonLd id="directory-breadcrumbs" data={breadcrumbJsonLd}/>
    {!unavailable ? <JsonLd id="directory-item-list" data={itemListJsonLd}/> : null}
    <JsonLd id="directory-faqs" data={faqJsonLd}/>
    <Header/>
    <main>
      <section className="border-b border-slate-200 bg-[#eef3f8]">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12">
          <Breadcrumbs items={breadcrumbItems}/>
          <h1 className="mt-5 text-4xl font-black tracking-[-.045em] text-[#142c4c] sm:text-6xl">{trade.name} in {region.name}</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">{unavailable ? `Browse ${trade.name.toLowerCase()} businesses serving ${region.name}. Contact businesses directly to confirm availability and project details.` : categoryIntro(trade.slug as TradeSlug, region, businesses.length)}</p>
          <div className="mt-7 max-w-3xl"><SearchBox key={`${region.slug}/${trade.slug}`} compact initialRegion={region.slug} initialTrade={trade.slug}/></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pt-10 sm:px-8 sm:pt-12">
        <QuoteRequestForm region={region.slug} regionName={region.name} trade={trade.slug} tradeName={trade.name}/>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="flex items-end justify-between gap-5">
          <div><p className="eyebrow">Directory results</p><h2 className="mt-2 text-2xl font-black text-[#142c4c]">Pros serving {region.name}</h2></div>
          <p className="text-sm text-slate-500">{businesses.length} {businesses.length === 1 ? 'business' : 'businesses'}</p>
        </div>
        <div className="mt-8">
          {featured ? <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[.16em] text-[#9b4917]">Exclusive featured business</p>
            <div className="max-w-2xl"><ListingCard business={featured.business} featured/></div>
          </div> : <a href={`/pricing?plan=featured&region=${encodeURIComponent(region.slug)}&trade=${encodeURIComponent(trade.slug)}`} className="group block rounded-2xl border-2 border-dashed border-[#ec7d2c]/50 bg-[#fff7f0] p-6 hover:border-[#ec7d2c]">
            <p className="text-xs font-black uppercase tracking-[.16em] text-[#9b4917]">Featured spot available</p>
            <h3 className="mt-2 text-xl font-black text-[#142c4c]">Feature your business at the top of this page</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">One business gets the exclusive featured position and this page’s incoming quote requests.</p>
            <span className="mt-4 inline-flex items-center gap-1 font-extrabold text-[#d96c20]">See featured checkout <ArrowRight className="size-4 transition group-hover:translate-x-1"/></span>
          </a>}
        </div>
        {unavailable
          ? <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">The directory is temporarily unavailable. Please try again shortly.</div>
          : businesses.length
            ? <><div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{regularBusinesses.map((business) => <ListingCard key={business.id} business={business}/>)}</div>
              {businesses.length < MIN_INDEXABLE_LISTINGS ? <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center"><p className="font-extrabold text-[#142c4c]">Know another qualified {trade.name.toLowerCase()} pro serving {region.name}?</p><p className="mt-2 text-sm text-slate-600">Business owners can claim a free listing and add verified contact details.</p><a href={`/claim?region=${encodeURIComponent(region.slug)}&trade=${encodeURIComponent(trade.slug)}`} className="mt-4 inline-flex rounded-xl bg-[#ec7d2c] px-5 py-3 font-extrabold text-white">Claim a free listing</a></div> : null}</>
            : <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
              <h3 className="text-xl font-extrabold">No {trade.name.toLowerCase()} pros listed here yet.</h3>
              <p className="mt-2 text-slate-600">Own a {trade.name.toLowerCase()} business in {region.name}? Claim a free listing.</p>
              <a href={`/claim?region=${encodeURIComponent(region.slug)}&trade=${encodeURIComponent(trade.slug)}`} className="mt-5 inline-flex rounded-xl bg-[#ec7d2c] px-5 py-3 font-extrabold text-white">Claim a free listing</a>
            </div>}
      </section>

      {(relatedTrades.length > 0 || nearbyRegions.length > 0) ? <section className="border-y border-slate-200 bg-[#f5f7fa]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-2">
          {relatedTrades.length > 0 ? <div>
            <h2 className="text-2xl font-black text-[#142c4c]">Related categories in {region.name.replace(/,\s*[A-Z]{2}$/, '')}</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">{relatedTrades.map((related) => <a key={related.slug} href={`/${region.slug}/${related.slug}`} className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 font-bold text-[#142c4c] hover:border-[#ec7d2c]">{related.name}<ArrowRight className="size-4 transition group-hover:translate-x-1"/></a>)}</div>
          </div> : null}
          {nearbyRegions.length > 0 ? <div>
            <h2 className="text-2xl font-black text-[#142c4c]">{trade.name} in nearby cities</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">{nearbyRegions.map((nearby) => <a key={nearby.slug} href={`/${nearby.slug}/${trade.slug}`} className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 font-bold text-[#142c4c] hover:border-[#ec7d2c]">{nearby.name}<ArrowRight className="size-4 transition group-hover:translate-x-1"/></a>)}</div>
          </div> : null}
        </div>
      </section> : null}

      <section className="mx-auto max-w-4xl px-5 py-14 sm:px-8">
        <p className="eyebrow">Questions to ask</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-[#142c4c]">{trade.name} FAQs for {region.name}</h2>
        <div className="mt-7 space-y-4">{faqs.map((faq) => <details key={faq.question} className="group rounded-2xl border border-slate-200 bg-white p-5 open:shadow-[0_8px_30px_rgba(15,35,60,.06)]">
          <summary className="cursor-pointer list-none pr-6 font-extrabold text-[#142c4c] marker:hidden">{faq.question}</summary>
          <p className="mt-3 text-sm leading-7 text-slate-600"><FaqAnswer answer={faq.answer}/></p>
        </details>)}</div>
      </section>
    </main>
    <Footer/>
  </>;
}

function FaqAnswer({ answer }: { answer: string }) {
  const url = 'https://www.myfloridalicense.com/';
  if (!answer.includes(url)) return answer;
  const [before, after] = answer.split(url);
  return <>{before}<a href={url} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#d96c20] underline">{url}</a>{after}</>;
}
