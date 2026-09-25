import type { Metadata } from 'next';
import { Download, Inbox, MailCheck, Route } from 'lucide-react';
import { Footer } from '@/components/site/footer';
import { Header } from '@/components/site/header';
import { activeRegionGroups, activeRegions, trades } from '@/data/catalog';
import { currentAdminEmail } from '@/db/auth';
import { sqlAll } from '@/db/runtime';
import { listLeadPageCountsLast30Days, listLeads } from '@/db/revenue';
import { AdminLoginForm } from './admin-login-form';

type ClaimReview = { id: string; business_name: string; website: string; contact_name: string; email: string; note: string; created_at: number };

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Lead and claim admin', alternates: { canonical: '/admin' }, robots: { index: false, follow: false } };

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ region?: string; trade?: string; error?: string }> }) {
  const query = await searchParams;
  let adminEmail = null;
  try { adminEmail = await currentAdminEmail(); } catch {}
  if (!adminEmail) return <><Header/><main className="min-h-[70vh] bg-[#f5f7fa] px-5 py-16">{query.error ? <p role="alert" className="mx-auto mb-5 max-w-md rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">That sign-in link is invalid or expired.</p> : null}<AdminLoginForm/></main><Footer/></>;

  const region = activeRegions.some((item) => item.slug === query.region) ? query.region : undefined;
  const trade = trades.some((item) => item.slug === query.trade) ? query.trade : undefined;
  const [leads, pageCounts, claims] = await Promise.all([
    listLeads({ region, trade, limit: 500 }),
    listLeadPageCountsLast30Days(),
    sqlAll<ClaimReview>(
      `SELECT claims.id,businesses.name AS business_name,businesses.website,claims.contact_name,
              claims.email,claims.note,claims.created_at
       FROM claims JOIN businesses ON claims.business_id = businesses.id
       WHERE claims.status = 'manual_review' ORDER BY claims.created_at DESC`,
    ),
  ]);
  const routed = leads.filter((lead) => lead.routed).length;
  const exportParams = new URLSearchParams();
  if (region) exportParams.set('region', region);
  if (trade) exportParams.set('trade', trade);

  return <><Header/><main className="min-h-screen bg-[#f5f7fa]"><div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
    <p className="eyebrow">Private admin</p><h1 className="mt-2 text-4xl font-black tracking-tight text-[#142c4c]">Leads and claim reviews</h1><p className="mt-2 text-sm text-slate-500">Signed in as {adminEmail}</p>
    <div className="mt-8 grid gap-4 sm:grid-cols-3"><Summary icon={Inbox} label="Leads in this view" value={leads.length}/><Summary icon={Route} label="Routed" value={routed}/><Summary icon={MailCheck} label="Unsold" value={leads.length - routed}/></div>

    <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-xl font-black">Lead submissions</h2><p className="mt-1 text-sm text-slate-500">Filter the table or export the same filtered result.</p></div><a href={`/api/admin/leads/export${exportParams.size ? `?${exportParams}` : ''}`} className="inline-flex items-center gap-2 rounded-xl bg-[#142c4c] px-4 py-2.5 text-sm font-extrabold text-white"><Download className="size-4"/>Export CSV</a></div>
      <form className="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <select name="region" defaultValue={region || ''} className="h-11 rounded-md border border-input bg-transparent px-3 text-sm"><option value="">All cities</option>{activeRegionGroups.map((group) => <optgroup key={group.state} label={group.state}>{group.regions.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}</optgroup>)}</select>
        <select name="trade" defaultValue={trade || ''} className="h-11 rounded-md border border-input bg-transparent px-3 text-sm"><option value="">All categories</option>{trades.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select>
        <button className="h-11 rounded-xl bg-[#ec7d2c] px-5 font-extrabold text-white">Apply filters</button>
      </form>
      <div className="mt-6 overflow-x-auto"><table className="min-w-[1000px] w-full text-left text-sm"><thead><tr className="border-b text-xs uppercase tracking-wider text-slate-500"><th className="px-3 py-3">Submitted</th><th className="px-3 py-3">Customer</th><th className="px-3 py-3">Page</th><th className="px-3 py-3">Job</th><th className="px-3 py-3">Routing</th></tr></thead><tbody>{leads.map((lead) => <tr key={lead.id} className="border-b border-slate-100 align-top"><td className="px-3 py-4 whitespace-nowrap">{new Date(lead.created_at).toLocaleString()}</td><td className="px-3 py-4"><strong>{lead.name}</strong><br/><a className="text-blue-700 underline" href={`mailto:${lead.email}`}>{lead.email}</a><br/><a className="text-blue-700 underline" href={`tel:${lead.phone}`}>{lead.phone}</a><br/>ZIP {lead.zip} · {lead.preferred_contact_method}</td><td className="px-3 py-4">{tradeName(lead.trade)}<br/>{regionName(lead.region)}</td><td className="max-w-sm px-3 py-4 whitespace-pre-wrap">{lead.job_description}</td><td className="px-3 py-4">{lead.routed ? <span className="font-bold text-emerald-700">Routed to {lead.routed_business_slug}</span> : <span className="font-bold text-amber-700">Unsold</span>}<br/><span className="text-xs text-slate-500">Owner email: {lead.owner_notification_status}<br/>Business email: {lead.business_notification_status}</span></td></tr>)}{!leads.length ? <tr><td colSpan={5} className="px-3 py-8 text-center text-slate-500">No leads match these filters.</td></tr> : null}</tbody></table></div>
    </section>

    <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-black">Lead volume by page — last 30 days</h2><div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">{pageCounts.map((item) => <div key={`${item.region}|${item.trade}`} className="rounded-xl border border-slate-200 p-4"><p className="font-extrabold text-[#142c4c]">{tradeName(item.trade)} in {regionName(item.region)}</p><p className="mt-2 text-sm text-slate-600">{item.count} total · {item.unsold_count} unsold</p></div>)}{!pageCounts.length ? <p className="text-sm text-slate-500">No quote requests in the last 30 days.</p> : null}</div></section>

    <section className="mt-8"><h2 className="text-2xl font-black text-[#142c4c]">Business claims awaiting review</h2><div className="mt-5 space-y-4">{claims.length ? claims.map((claim) => <article key={claim.id} className="rounded-2xl border border-slate-200 bg-white p-5"><h3 className="text-lg font-black">{claim.business_name}</h3><p className="mt-1 text-sm">{claim.contact_name} · {claim.email}</p><a className="mt-2 block text-sm text-blue-700 underline" href={claim.website} target="_blank" rel="noopener noreferrer">{claim.website}</a><p className="mt-3 text-sm text-slate-600">{claim.note || 'No note supplied.'}</p><form action={`/api/admin/claims/${claim.id}/approve`} method="post"><button className="mt-4 rounded-lg bg-[#142c4c] px-4 py-2 font-bold text-white">Approve and email access link</button></form></article>) : <p className="rounded-xl bg-white p-5 text-slate-500">No claims need review.</p>}</div></section>
  </div></main><Footer/></>;
}

function regionName(slug: string) { return activeRegions.find((item) => item.slug === slug)?.name || slug; }
function tradeName(slug: string) { return trades.find((item) => item.slug === slug)?.name || slug; }
function Summary({ icon: Icon, label, value }: { icon: typeof Inbox; label: string; value: number }) { return <div className="rounded-2xl border border-slate-200 bg-white p-5"><Icon className="size-5 text-[#d96c20]"/><p className="mt-3 text-3xl font-black text-[#142c4c]">{value}</p><p className="mt-1 text-sm font-bold text-slate-500">{label}</p></div>; }
