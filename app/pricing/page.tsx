import type { Metadata } from 'next';
import { Check, Crown, ShieldCheck, Sparkles } from 'lucide-react';
import { Footer } from '@/components/site/footer';
import { Header } from '@/components/site/header';
import { activeRegions, trades } from '@/data/catalog';
import { currentBusiness } from '@/db/auth';
import { pageHasUnavailableFeaturedSlot } from '@/db/revenue';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Business listing plans',
  description: 'Compare Enhanced and Featured business listing plans on Who Knows a Pro.',
  alternates: { canonical: '/pricing' },
};

export default async function PricingPage({ searchParams }: { searchParams: Promise<{ plan?: string; region?: string; trade?: string }> }) {
  const input = await searchParams;
  const region = activeRegions.find((item) => item.slug === input.region);
  const trade = trades.find((item) => item.slug === input.trade);
  let business = null;
  try { business = await currentBusiness(); } catch {}
  let featuredUnavailable = false;
  if (region && trade) {
    try { featuredUnavailable = await pageHasUnavailableFeaturedSlot(region.slug, trade.slug); } catch {}
  }

  const destination = (plan: 'enhanced' | 'featured') => {
    const params = new URLSearchParams({ plan });
    if (region) params.set('region', region.slug);
    if (trade) params.set('trade', trade.slug);
    return `${business ? '/dashboard' : '/claim'}?${params}`;
  };

  return <><Header/><main className="bg-[#f5f7fa]">
    <section className="border-b border-slate-200 bg-[#eef3f8]">
      <div className="mx-auto max-w-5xl px-5 py-14 text-center sm:px-8 sm:py-20">
        <p className="eyebrow">For local businesses</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-.05em] text-[#142c4c] sm:text-6xl">Turn your directory profile into a growth channel.</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">Start with a free claimed profile, then upgrade through secure Stripe Checkout. Manage or cancel from your business dashboard.</p>
        {region && trade ? <p className="mx-auto mt-5 max-w-2xl rounded-xl border border-[#bed0df] bg-white px-4 py-3 text-sm font-bold text-[#142c4c]">Selected page: {trade.name} in {region.name}</p> : null}
      </div>
    </section>
    <section className="mx-auto grid max-w-5xl gap-6 px-5 py-14 sm:px-8 lg:grid-cols-2">
      <PlanCard
        icon={Sparkles}
        name="Enhanced listing"
        price="$29/month"
        description="Show more of what makes your business useful and appear above free listings on pages where you are listed."
        items={['Full profile details', 'Logo and photo gallery', 'Placement above non-paying listings', 'Profile views and website-click counts']}
        href={destination('enhanced')}
        action="Choose Enhanced"
      />
      <PlanCard
        icon={Crown}
        name="Featured"
        price="$99/month"
        description="Own the exclusive featured position on one selected city/category page and receive that page’s incoming quote requests."
        items={['Everything in Enhanced', 'One exclusive Featured spot', 'Top highlighted placement', 'Immediate lead routing while active']}
        href={featuredUnavailable ? destination('enhanced') : destination('featured')}
        action={featuredUnavailable ? 'Featured unavailable — choose Enhanced' : 'Choose Featured'}
        featured
      />
      <div className="lg:col-span-2 flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#27715c]"/><p>Payments use Stripe Checkout. Who Knows a Pro never stores card details. Featured availability is checked again before checkout so two businesses cannot purchase the same page.</p></div>
    </section>
    <section className="mx-auto max-w-5xl px-5 pb-6 sm:px-8">
      <h2 className="text-2xl font-black text-[#142c4c]">Compare plans</h2>
      <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[34rem] text-left text-sm">
          <thead className="bg-[#eef3f8] text-[#142c4c]"><tr><th className="p-4">&nbsp;</th><th className="p-4">Free</th><th className="p-4">Enhanced · $29/mo</th><th className="p-4">Featured · $99/mo</th></tr></thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {comparison.map(([feature, free, enhanced, featured]) => <tr key={feature}><th scope="row" className="p-4 font-semibold text-[#142c4c]">{feature}</th><td className="p-4">{free}</td><td className="p-4">{enhanced}</td><td className="p-4">{featured}</td></tr>)}
          </tbody>
        </table>
      </div>
    </section>
    <section className="mx-auto max-w-3xl px-5 pb-16 pt-8 sm:px-8">
      <h2 className="text-2xl font-black text-[#142c4c]">Questions</h2>
      <div className="mt-5 space-y-3">
        {faqs.map(([q, a]) => <details key={q} className="rounded-2xl border border-slate-200 bg-white p-5"><summary className="cursor-pointer font-extrabold text-[#142c4c]">{q}</summary><p className="mt-3 text-sm leading-7 text-slate-600">{a}</p></details>)}
      </div>
    </section>
  </main><Footer/></>;
}

const comparison = [
  ['Listing on your city and category pages', 'Yes', 'Yes', 'Yes'],
  ['Claim and edit your profile', 'Yes', 'Yes', 'Yes'],
  ['Logo and photo gallery', 'No', 'Yes', 'Yes'],
  ['Placed above non-paying listings', 'No', 'Yes', 'Yes'],
  ['Exclusive top spot on one page', 'No', 'No', 'Yes'],
  ['Receives that page’s quote requests', 'No', 'No', 'Yes'],
];

const faqs = [
  ['Why should I pay when a listing is already free?', 'A free listing gets your business into the directory. A paid plan makes it stand out: Enhanced adds your logo, a fuller profile, and profile-view and website-click counts, and Featured puts you at the top of a city and category page and sends you that page’s quote requests. You can start with the free listing and upgrade only if you want the extra visibility. We cannot guarantee results.'],
  ['How does billing work?', 'Plans are billed monthly through Stripe Checkout and renew until you cancel.'],
  ['Can I cancel anytime?', 'Yes. Cancel from your business dashboard. Your plan stays active through the end of the period you already paid for.'],
  ['How do quote requests reach me?', 'Consumers submit a quote request on a city and category page. While you hold the Featured spot on that page, the request is sent to you. Pages without a Featured business do not show the quote form.'],
  ['What does “exclusive” mean?', 'Only one business can be Featured on a given city and category page. Availability is checked again before checkout.'],
  ['Are results guaranteed?', 'No. We cannot promise a number of views, leads, or customers.'],
];

function PlanCard({ icon: Icon, name, price, description, items, href, action, featured = false }: { icon: typeof Sparkles; name: string; price: string; description: string; items: string[]; href: string; action: string; featured?: boolean }) {
  return <article className={`rounded-3xl border bg-white p-7 shadow-[0_18px_55px_rgba(20,44,76,.08)] ${featured ? 'border-[#ec7d2c] ring-2 ring-[#ec7d2c]/10' : 'border-slate-200'}`}>
    <span className={`grid size-12 place-items-center rounded-2xl ${featured ? 'bg-[#fff0e4] text-[#d96c20]' : 'bg-[#eaf0f6] text-[#142c4c]'}`}><Icon className="size-6"/></span>
    <h2 className="mt-5 text-2xl font-black text-[#142c4c]">{name}</h2>
    <p className="mt-1 text-xl font-extrabold text-slate-700">{price}</p>
    <p className="mt-4 leading-7 text-slate-600">{description}</p>
    <ul className="mt-6 space-y-3 text-sm text-slate-700">{items.map((item) => <li key={item} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-[#27715c]"/>{item}</li>)}</ul>
    <a href={href} className={`mt-7 inline-flex w-full justify-center rounded-xl px-5 py-3 font-extrabold text-white ${featured ? 'bg-[#ec7d2c] hover:bg-[#d96c20]' : 'bg-[#142c4c] hover:bg-[#203d62]'}`}>{action}</a>
  </article>;
}
