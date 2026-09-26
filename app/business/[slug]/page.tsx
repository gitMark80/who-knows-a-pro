import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound, permanentRedirect } from 'next/navigation';
import { cache } from 'react';
import { BadgeCheck, Building2, CalendarDays, Clock3, ExternalLink, Globe2, Hash, MapPin, MapPinned, Phone, ShieldCheck, Wrench } from 'lucide-react';
import { Header } from '@/components/site/header';
import { Footer } from '@/components/site/footer';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { ProfileViewTracker } from '@/components/site/profile-view-tracker';
import { regions, trades } from '@/data/catalog';
import { getBusinessProfile } from '@/db/runtime';
import { businessMetaDescription, businessStructuredJsonLd, SITE_URL, specialtyList } from '@/lib/business-profile';

export const dynamic = 'force-dynamic';

const loadBusiness = cache((slug: string) => getBusinessProfile(slug));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const result = await loadBusiness(slug);
  if (!result || result.profile.is_test) return { title: 'Business profile', robots: { index: false, follow: true } };
  const business = result.profile;
  const region = regions.find((item) => item.slug === business.region);
  const trade = trades.find((item) => item.slug === business.trade);
  const city = region?.name || business.location;
  const category = trade?.name || business.trade;
  return {
    title: { absolute: `${business.name} – ${category} in ${city} | Who Knows a Pro?` },
    description: businessMetaDescription(business, category, city),
    alternates: { canonical: `/business/${business.main_slug}` },
  };
}

export default async function BusinessPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await loadBusiness(slug);
  if (!result || result.profile.is_test) notFound();
  if (result.legacy) permanentRedirect(`/business/${result.profile.main_slug}`);
  const business = result.profile;

  const region = regions.find((item) => item.slug === business.region);
  const trade = trades.find((item) => item.slug === business.trade);
  const regionName = region?.name || business.location;
  const tradeName = trade?.name || business.trade;
  const specialties = specialtyList(business.specialties);
  const servedRegions = business.regions.map((slug) => regions.find((item) => item.slug === slug)).filter((item) => item !== undefined);
  const servedTrades = business.trades.map((slug) => trades.find((item) => item.slug === slug)).filter((item) => item !== undefined);
  let photos: string[] = [];
  if (business.tier !== 'free') {
    try { photos = JSON.parse(business.photo_urls || '[]') as string[]; } catch { photos = []; }
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: regionName, href: `/${business.region}` },
    { label: tradeName, href: `/${business.region}/${business.trade}` },
    { label: business.name },
  ];
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: regionName, item: `${SITE_URL}/${business.region}` },
      { '@type': 'ListItem', position: 3, name: tradeName, item: `${SITE_URL}/${business.region}/${business.trade}` },
      { '@type': 'ListItem', position: 4, name: business.name, item: `${SITE_URL}/business/${business.main_slug}` },
    ],
  };

  return <>
    <ProfileViewTracker slug={business.main_slug}/>
    <JsonLd id="business-profile" data={businessStructuredJsonLd(business)}/>
    <JsonLd id="business-breadcrumbs" data={breadcrumbJsonLd}/>
    <Header/>
    <main className="bg-[#f5f7fa]">
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        <Breadcrumbs items={breadcrumbItems}/>
        <article className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
          {photos.length > 0 ? <div className="grid h-64 grid-cols-2 gap-1 bg-slate-100 sm:h-80">{photos.slice(0, 3).map((photo, index) => <div key={photo} className={`relative min-h-0 ${index === 0 ? 'row-span-2' : ''}`}><Image src={photo} alt={`${business.name} business photo ${index + 1}`} fill sizes={index === 0 ? '(min-width: 640px) 50vw, 100vw' : '50vw'} unoptimized className="object-cover"/></div>)}</div> : null}
          <div className="grid gap-9 p-6 sm:p-9 md:grid-cols-[1fr_280px]">
            <div>
              <div className="flex items-center gap-4">
                {business.logo_url && business.tier !== 'free' ? <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[#eaf0f6]"><Image src={business.logo_url} alt={`${business.name} logo`} width={64} height={64} unoptimized className="size-full object-cover"/></div> : null}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#27715c]"><BadgeCheck className="size-4"/>{business.owner_email ? 'Claimed business' : 'Public listing'}</div>
                  <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">{business.name}</h1>
                  <p className="mt-2 text-sm font-semibold text-slate-500">{tradeName} in {regionName}</p>
                </div>
              </div>

              {business.summary ? <p className="mt-7 text-base leading-8 text-slate-700">{business.summary}</p> : null}

              {(business.address || business.service_area || business.hours || specialties.length || business.year_founded || business.license_number) ? <section className="mt-8">
                <h2 className="text-xl font-extrabold text-[#142c4c]">Business details</h2>
                <dl className="mt-4 grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
                  {business.address ? <Detail icon={MapPin} label="Address" value={business.address}/> : null}
                  {business.service_area ? <Detail icon={MapPinned} label="Service area" value={business.service_area}/> : null}
                  {business.hours ? <Detail icon={Clock3} label="Hours" value={business.hours} multiline/> : null}
                  {business.year_founded ? <Detail icon={CalendarDays} label="Year founded" value={String(business.year_founded)}/> : null}
                  {business.license_number ? <Detail icon={Hash} label="License number" value={business.license_number}/> : null}
                  {specialties.length ? <Detail icon={Wrench} label="Specialties" value={specialties.join(', ')}/> : null}
                </dl>
              </section> : null}

              <section className="mt-8 grid gap-6 sm:grid-cols-2">
                <div><h2 className="text-xl font-extrabold text-[#142c4c]">Areas served</h2><div className="mt-3 flex flex-wrap gap-2">{servedRegions.map((item) => <a key={item.slug} href={`/${item.slug}`} className="rounded-full bg-[#eef3f8] px-3 py-1.5 text-sm font-bold text-[#142c4c]">{item.name}</a>)}</div></div>
                <div><h2 className="text-xl font-extrabold text-[#142c4c]">Directory categories</h2><div className="mt-3 flex flex-wrap gap-2">{servedTrades.map((item) => <a key={item.slug} href={`/${business.region}/${item.slug}`} className="rounded-full bg-[#fff2e8] px-3 py-1.5 text-sm font-bold text-[#9b4917]">{item.name}</a>)}</div></div>
              </section>

              <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h2 className="font-extrabold">Before you hire</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">Confirm price, availability, licensing, insurance, and project details directly with the business.</p>
              </div>
            </div>

            <aside className="h-fit rounded-2xl bg-[#142c4c] p-5 text-white">
              <h2 className="text-lg font-extrabold">Contact this pro</h2>
              <div className="mt-5 space-y-3">
                {business.phone ? <a href={`tel:${business.phone}`} className="flex items-center gap-2 rounded-xl bg-white/10 p-3 font-bold hover:bg-white/15"><Phone className="size-4"/>{business.phone}</a> : null}
                {business.website ? <a href={business.website} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${business.name} official website`} className="flex items-center gap-2 rounded-xl bg-[#ec7d2c] p-3 font-bold hover:bg-[#d96c20]"><Globe2 className="size-4"/>Visit official website <ExternalLink className="ml-auto size-3.5"/></a> : null}
              </div>
              {business.website ? <p className="mt-3 break-all text-xs text-white/65">{business.website}</p> : null}
              <div className="mt-5 flex items-start gap-2 border-t border-white/15 pt-5 text-xs leading-5 text-white/60"><ShieldCheck className="mt-0.5 size-4 shrink-0"/>Directory profiles are informational and are not endorsements.</div>
            </aside>
          </div>
        </article>

        {!business.owner_email ? <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5">
          <div><p className="font-extrabold">Own this business?</p><p className="text-sm text-slate-500">Claim this profile to add verified details and keep its information current.</p></div>
          <a href={`/claim?business=${encodeURIComponent(business.id)}`} className="rounded-xl bg-[#ec7d2c] px-5 py-3 font-extrabold text-white">Claim this business</a>
        </div> : null}
      </div>
    </main>
    <Footer/>
  </>;
}

function Detail({ icon: Icon, label, value, multiline = false }: { icon: typeof Building2; label: string; value: string; multiline?: boolean }) {
  return <div className="rounded-xl border border-slate-200 p-4">
    <dt className="flex items-center gap-2 font-bold text-[#142c4c]"><Icon className="size-4 text-[#d96c20]"/>{label}</dt>
    <dd className={`mt-2 leading-6 ${multiline ? 'whitespace-pre-line' : ''}`}>{value}</dd>
  </div>;
}
