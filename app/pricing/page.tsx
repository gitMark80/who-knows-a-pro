import type { Metadata } from 'next';
import { BadgeCheck, Check, Crown, ShieldCheck, Sparkles } from 'lucide-react';
import { PageEvent } from '@/components/site/analytics-client';
import { Footer } from '@/components/site/footer';
import { Header } from '@/components/site/header';
import { activeRegions, trades } from '@/data/catalog';
import { currentBusiness } from '@/db/auth';
import { countPageLeadsLast30Days, pageHasUnavailableFeaturedSlot } from '@/db/revenue';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Free, Enhanced, and Featured business listings',
  description: 'Claim a free business listing on Who Knows a Pro, or upgrade to Enhanced ($29/month) or Featured ($99/month). Cancel anytime.',
  alternates: { canonical: '/pricing' },
};

export default async function PricingPage({ searchParams }: { searchParams: Promise<{ plan?: string; region?: string; trade?: string }> }) {
  const input = await searchParams;
  const region = activeRegions.find((item) => item.slug === input.region);
  const trade = trades.find((item) => item.slug === input.trade);
  let business = null;
  try { business = await currentBusiness(); } catch {}
  let featuredUnavailable = false;
  let pageLeads: number | null = null;
  if (region && trade) {
    try { featuredUnavailable = await pageHasUnavailableFeaturedSlot(region.slug, trade.slug); } catch {}
    try { pageLeads = await countPageLeadsLast30Days(region.slug, trade.slug); } catch {}
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
        <h1 className="mt-3 text-4xl font-black tracking-[-.05em] text-[#142c4c] sm:text-6xl">Start free. Upgrade only if it helps.</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">Claim your listing at no cost to keep your details accurate. Enhanced and Featured add visibility on the city and category pages where customers compare local pros. Monthly, no contract, cancel anytime.</p>
        {region && trade ? <div className="mx-auto mt-5 max-w-2xl rounded-xl border border-[#bed0df] bg-white px-4 py-3 text-sm text-[#142c4c]"><p className="font-bold">Selected page: {trade.name} in {region.name}</p><p className="mt-1 text-slate-600">{featuredUnavailable ? 'The Featured spot on this page is taken. Enhanced is available.' : 'The Featured spot on this page is open.'}{pageLeads !== null && pageLeads > 0 ? ` ${pageLeads} quote ${pageLeads === 1 ? 'request was' : 'requests were'} submitted on this page in the last 30 days.` : ''}</p></div> : null}
      </div>
    </section>
    <section className="mx-auto grid max-w-6xl gap-6 px-5 py-14 sm:px-8 lg:grid-cols-3">
      <PlanCard
        icon={BadgeCheck}
        name="Free claimed listing"
        price="$0"
        description="Take control of the listing customers already see. Correct your details and add the information people use to choose a pro."
        items={['Claimed business badge', 'Edit phone, website, hours, service area, and description', 'Listed on your city and category pages', 'Profile views and website/phone clicks in your dashboard', 'Find-us badge for your website']}
        href={business ? '/dashboard' : '/claim'}
        action={business ? 'Go to your dashboard' : 'Claim free listing'}
        quiet
      />
      <PlanCard
        icon={Sparkles}
        name="Enhanced listing"
        price="$29/month"
        description="Look established and appear above free listings on every page where your business is listed."
        items={['Everything in Free', 'Logo and up to six photos', 'Placed above non-paying listings', 'Enhanced label on your listing card']}
        href={destination('enhanced')}
        action="Choose Enhanced"
      />
      <PlanCard
        icon={Crown}
        name="Featured"
        price="$99/month"
        description="Hold the one exclusive top spot on a city and category page. That page’s quote form appears only while it has a Featured business, and its requests are emailed to you."
        items={['Everything in Enhanced', 'One exclusive spot per city/category page', 'Highlighted at the top of that page', 'Quote requests from that page sent to you']}
        href={featuredUnavailable ? destination('enhanced') : destination('featured')}
        action={featuredUnavailable ? 'Featured taken — choose Enhanced' : 'Choose Featured'}
        featured
      />
      <div className="lg:col-span-3 flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#27715c]"/><p>Paid plans require a claimed listing first (free, takes a minute). Payments use Stripe Checkout; Who Knows a Pro never sees or stores card details. Featured availability is checked again before checkout so two businesses cannot buy the same page. Cancel anytime from your dashboard; your plan runs to the end of the period you paid for.</p></div>
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
        {faqs.map(([q, a]) => <details key={q} className="rounded-2xl border border-slate-200 bg-white p-5"><summary className="cursor-pointer font-extrabold text-[#142c4c]">{q}</summary><div className="mt-3 space-y-3 text-sm leading-7 text-slate-600">{a.split('\n\n').map((para) => <p key={para}>{para.split(/(\*\*[^*]+\*\*)/).map((part, i) => part.startsWith('**') ? <strong key={i} className="font-extrabold text-[#142c4c]">{part.slice(2, -2)}</strong> : part)}</p>)}</div></details>)}
      </div>
    </section>
  </main><Footer/><PageEvent event="pricing_viewed" region={region?.slug} trade={trade?.slug} plan={input.plan === 'featured' || input.plan === 'enhanced' ? input.plan : undefined}/></>;
}

const comparison = [
  ['Listing on your city and category pages', 'Yes', 'Yes', 'Yes'],
  ['Claimed badge and editable details', 'Yes', 'Yes', 'Yes'],
  ['Views and click counts in your dashboard', 'Yes', 'Yes', 'Yes'],
  ['Logo and photo gallery', '—', 'Yes', 'Yes'],
  ['Placed above non-paying listings', '—', 'Yes', 'Yes'],
  ['Exclusive top spot on one page', '—', '—', 'Yes'],
  ['Receives that page’s quote requests', '—', '—', 'Yes'],
  ['Price', 'Free', '$29/month', '$99/month'],
];

const faqs = [
  ['Why would I pay when a listing is already free?', 'You don’t have to. A free claimed listing keeps your information accurate and shows the claimed badge.\n\n**Enhanced** is for businesses that want to look more established — a logo, photos, and placement above free listings on the pages where you appear.\n\n**Featured** is for businesses that want the single most visible spot on one specific city and category page, plus any quote requests submitted there.\n\nYour dashboard shows real views and clicks so you can judge whether an upgrade is worth it. We can’t promise a number of views, calls, or customers.'],
  ['Do I need to claim my listing first?', 'Yes. Claiming is free and confirms you represent the business. With an email address on your business website’s domain it takes about a minute; other addresses are reviewed by a person, usually within one business day.'],
  ['How does billing work?', 'Plans are billed monthly through Stripe Checkout and renew until you cancel. No contract and no setup fee.'],
  ['Can I cancel anytime?', 'Yes. Cancel from your business dashboard. Your plan stays active through the end of the period you already paid for.'],
  ['How do quote requests reach me?', 'Consumers submit a quote request on a city and category page. While you hold the Featured spot on that page, the request is sent to you. Pages without a Featured business do not show the quote form.'],
  ['What does “exclusive” mean?', 'Only one business can be Featured on a given city and category page. Availability is checked again before checkout.'],
  ['Are results guaranteed?', 'No. We cannot promise a number of views, leads, or customers.'],
];

function PlanCard({ icon: Icon, name, price, description, items, href, action, featured = false, quiet = false }: { icon: typeof Sparkles; name: string; price: string; description: string; items: string[]; href: string; action: string; featured?: boolean; quiet?: boolean }) {
  return <article className={`flex flex-col rounded-3xl border bg-white p-7 shadow-[0_18px_55px_rgba(20,44,76,.08)] ${featured ? 'border-[#ec7d2c] ring-2 ring-[#ec7d2c]/10' : 'border-slate-200'}`}>
    <span className={`grid size-12 place-items-center rounded-2xl ${featured ? 'bg-[#fff0e4] text-[#d96c20]' : 'bg-[#eaf0f6] text-[#142c4c]'}`}><Icon className="size-6"/></span>
    <h2 className="mt-5 text-2xl font-black text-[#142c4c]">{name}</h2>
    <p className="mt-1 text-xl font-extrabold text-slate-700">{price}</p>
    <p className="mt-4 leading-7 text-slate-600">{description}</p>
    <ul className="mb-7 mt-6 space-y-3 text-sm text-slate-700">{items.map((item) => <li key={item} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-[#27715c]"/>{item}</li>)}</ul>
    <a href={href} rel="nofollow" className={`mt-auto inline-flex w-full justify-center rounded-xl px-5 py-3 font-extrabold ${featured ? 'bg-[#ec7d2c] text-white hover:bg-[#d96c20]' : quiet ? 'border border-[#142c4c] text-[#142c4c] hover:bg-[#eef3f8]' : 'bg-[#142c4c] text-white hover:bg-[#203d62]'}`}>{action}</a>
  </article>;
}
