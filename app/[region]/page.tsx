import { ArrowRight, MapPin, Wrench } from 'lucide-react';
import { notFound } from 'next/navigation';
import { Footer } from '@/components/site/footer';
import { Header } from '@/components/site/header';
import { SearchBox } from '@/components/site/search-box';
import { activeRegions, trades } from '@/data/catalog';

export function generateStaticParams() {
  return activeRegions.map((region) => ({ region: region.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ region: string }> }) {
  const { region: regionSlug } = await params;
  const region = activeRegions.find((item) => item.slug === regionSlug);
  return {
    title: region ? `Local businesses in ${region.name}` : 'Browse local businesses',
    description: region
      ? `Browse service categories and local businesses serving ${region.name}.`
      : 'Browse local businesses by region and category.',
  };
}

export default async function RegionPage({ params }: { params: Promise<{ region: string }> }) {
  const { region: regionSlug } = await params;
  const region = activeRegions.find((item) => item.slug === regionSlug);
  if (!region) notFound();

  return <><Header/><main>
    <section className="border-b border-slate-200 bg-[#eef3f8]">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <p className="eyebrow flex items-center gap-2"><MapPin className="size-4"/>{region.name}</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-.045em] text-[#142c4c] sm:text-6xl">Choose a category</h1>
        <p className="mt-4 max-w-2xl text-slate-600">Find businesses serving {region.name}, then compare profiles and visit each company’s official website.</p>
        <div className="mt-7 max-w-3xl"><SearchBox key={region.slug} compact initialRegion={region.slug}/></div>
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {trades.map((trade) => <a key={trade.slug} href={`/${region.slug}/${trade.slug}`} className="group flex min-h-28 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_35px_rgba(15,35,60,.05)] transition hover:-translate-y-0.5 hover:border-[#ec7d2c]">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#eef3f8] text-[#d96c20]"><Wrench className="size-5"/></span>
          <span className="flex flex-1 items-center justify-between gap-3 font-extrabold text-[#142c4c]">{trade.name}<ArrowRight className="size-4 shrink-0 transition group-hover:translate-x-1"/></span>
        </a>)}
      </div>
    </section>
  </main><Footer/></>;
}
