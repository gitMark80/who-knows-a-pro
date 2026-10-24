/* eslint-disable @next/next/no-html-link-for-pages -- Native anchors keep navigation consistent with the rest of the site. */
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Footer } from '@/components/site/footer';
import { Header } from '@/components/site/header';
import { currentAdminEmail } from '@/db/auth';
import { blockedSubmissions, claimsByDay, claimTrafficByCountry, eventTotals, funnelSteps, sourceBreakdown } from '@/db/funnel';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Conversion dashboard', robots: { index: false, follow: false } };

export default async function FunnelPage() {
  if (!await currentAdminEmail()) redirect('/admin');
  const [totals, sources, countries, blocked, claims] = await Promise.all([
    eventTotals(), sourceBreakdown(), claimTrafficByCountry(), blockedSubmissions(), claimsByDay(),
  ]);
  const cell = 'px-3 py-2.5';
  return <><Header/><main className="min-h-screen bg-[#f5f7fa] px-5 py-10"><div className="mx-auto max-w-6xl space-y-8">
    <div><a href="/admin" className="text-sm font-bold underline">Back to admin</a> <a href="/admin/stats" className="ml-4 text-sm font-bold underline">Site stats</a><h1 className="mt-4 text-3xl font-black text-[#142c4c]">Conversion dashboard</h1>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Server-confirmed events are recorded only after the action succeeds (or Stripe confirms it). Page views and form starts come from the browser after the page loads, skip self-identified bots, and count visits from automated browsers separately as “flagged.” No names, emails, or IP addresses are stored.</p></div>

    <section className="overflow-x-auto rounded-2xl border bg-white"><table className="w-full min-w-[560px] text-left text-sm"><thead><tr className="border-b text-xs uppercase tracking-wider text-slate-500"><th className={cell}>Step</th><th className={cell}>Last 7 days</th><th className={cell}>Flagged (7d)</th><th className={cell}>Last 30 days</th></tr></thead>
      <tbody>{funnelSteps.map(([key, label]) => { const row = totals.get(key); return <tr key={key} className="border-b border-slate-100"><th scope="row" className={`${cell} font-semibold text-[#142c4c]`}>{label}</th><td className={cell}>{row?.d7 ?? 0}</td><td className={`${cell} text-slate-500`}>{row?.flagged7 ?? 0}</td><td className={cell}>{row?.d30 ?? 0}</td></tr>; })}</tbody></table></section>

    <div className="grid gap-8 lg:grid-cols-2">
      <section className="rounded-2xl border bg-white p-5"><h2 className="text-lg font-black">Claim page traffic by country (7 days)</h2><p className="mt-1 text-xs text-slate-500">Many views with almost no form starts usually means automated traffic.</p>
        <table className="mt-3 w-full text-left text-sm"><thead><tr className="border-b text-xs text-slate-500"><th className="py-2">Country</th><th>Views</th><th>Form starts</th><th>Flagged</th></tr></thead><tbody>{countries.map((row) => <tr key={row.country} className="border-b border-slate-100"><td className="py-2 font-semibold">{row.country}</td><td>{row.views}</td><td>{row.starts}</td><td>{row.flagged}</td></tr>)}</tbody></table>
        {!countries.length ? <p className="mt-3 text-sm text-slate-500">No data yet.</p> : null}</section>
      <section className="rounded-2xl border bg-white p-5"><h2 className="text-lg font-black">Blocked submissions (7 days)</h2><p className="mt-1 text-xs text-slate-500">Honeypot, too-fast, rate-limit, and failed security-check attempts on the claim and quote forms.</p>
        <ul className="mt-3 space-y-1.5 text-sm">{blocked.map((row) => <li key={row.detail} className="flex justify-between border-b border-slate-100 py-1.5"><span>{row.detail}</span><strong>{row.count}</strong></li>)}</ul>
        {!blocked.length ? <p className="mt-3 text-sm text-slate-500">None recorded.</p> : null}</section>
    </div>

    <section className="overflow-x-auto rounded-2xl border bg-white p-5"><h2 className="text-lg font-black">Conversions by source (30 days)</h2><p className="mt-1 text-xs text-slate-500">From UTM tags (utm_source) or the referring site. Add ?utm_source=…&utm_campaign=… to links you share.</p>
      <table className="mt-3 w-full min-w-[560px] text-left text-sm"><thead><tr className="border-b text-xs text-slate-500"><th className="py-2">Source</th><th>Claims</th><th>Verified</th><th>Checkouts</th><th>Activated</th><th>Quotes</th></tr></thead><tbody>{sources.map((row) => <tr key={row.source} className="border-b border-slate-100"><td className="py-2 font-semibold">{row.source}</td><td>{row.claims}</td><td>{row.verified}</td><td>{row.checkouts}</td><td>{row.activations}</td><td>{row.quotes}</td></tr>)}</tbody></table>
      {!sources.length ? <p className="mt-3 text-sm text-slate-500">No conversions recorded yet.</p> : null}</section>

    <section className="overflow-x-auto rounded-2xl border bg-white p-5"><h2 className="text-lg font-black">Claim records by day (21 days, UTC)</h2><p className="mt-1 text-xs text-slate-500">Read directly from saved claims, so this includes the period before event tracking was added.</p>
      <table className="mt-3 w-full min-w-[480px] text-left text-sm"><thead><tr className="border-b text-xs text-slate-500"><th className="py-2">Day</th><th>Total</th><th>Email link sent</th><th>Manual review</th><th>Verified</th></tr></thead><tbody>{claims.map((row) => <tr key={row.day} className="border-b border-slate-100"><td className="py-2 font-semibold">{row.day}</td><td>{row.total}</td><td>{row.auto}</td><td>{row.manual}</td><td>{row.verified}</td></tr>)}</tbody></table>
      {!claims.length ? <p className="mt-3 text-sm text-slate-500">No claims in this period.</p> : null}</section>
  </div></main><Footer/></>;
}
