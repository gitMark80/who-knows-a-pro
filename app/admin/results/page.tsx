import Link from 'next/link';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { currentAdminEmail } from '@/db/auth';
import { listBusinesses, sqlAll, type Business } from '@/db/runtime';
import { businessResults, emptyResults } from '@/db/business-results';
import { BusinessResultsPanel } from '@/components/site/business-results';
import { Header } from '@/components/site/header';
import { Footer } from '@/components/site/footer';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Business results admin', robots: { index: false, follow: false } };
export default async function Results({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  if (!await currentAdminEmail()) redirect('/admin');
  const { q = '' } = await searchParams;
  const search = q.trim().slice(0, 150).toLowerCase();
  const [businesses, databaseBusinesses, results] = await Promise.all([listBusinesses(undefined, undefined, 100000), sqlAll<Business>('SELECT * FROM businesses WHERE approved = 1 AND is_test = 0'), businessResults()]);
  const unique = [...new Map([...businesses, ...databaseBusinesses].map(business => [business.main_slug || business.slug, business])).entries()];
  const rows = unique.filter(([slug, b]) => !search || `${b.name} ${slug}`.toLowerCase().includes(search)).map(([slug, b]) => ({ slug, name: b.name, results: results.get(slug) || emptyResults() }));
  rows.sort((a, b) => (b.results.current.website + b.results.current.phone + b.results.current.quotes + b.results.current.views) - (a.results.current.website + a.results.current.phone + a.results.current.quotes + a.results.current.views) || a.name.localeCompare(b.name));
  const totals = emptyResults();
  for (const row of rows) for (const period of ['current', 'previous'] as const) for (const metric of ['views', 'website', 'phone', 'quotes'] as const) totals[period][metric] += row.results[period][metric];
  return <><Header/><main className="min-h-screen bg-[#f5f7fa] px-5 py-10"><div className="mx-auto max-w-6xl">
    <Link href="/admin" className="text-sm font-bold underline">Back to admin</Link><h1 className="my-6 text-3xl font-black text-[#142c4c]">Business results</h1>
    <form className="mb-6 flex gap-3"><label className="sr-only" htmlFor="business-search">Search business name or slug</label><input id="business-search" name="q" defaultValue={q} maxLength={150} placeholder="Search business name or slug" className="min-w-0 flex-1 rounded-xl border bg-white p-3"/><button className="rounded-xl bg-[#142c4c] px-5 font-bold text-white">Search</button></form>
    <p className="mb-4 text-sm text-slate-600">Totals for {rows.length.toLocaleString()} matching businesses. Table shows the 100 most active matches; search to find any listing.</p>
    <BusinessResultsPanel results={totals}/>
    <div className="overflow-x-auto rounded-2xl border bg-white"><table className="w-full min-w-[760px] text-left text-sm"><caption className="p-4 text-left font-bold">This month so far (previous full month in parentheses)</caption><thead><tr className="border-b">{['Business', 'Profile views', 'Website clicks', 'Phone clicks', 'Assigned quotes'].map(label => <th key={label} className="p-4">{label}</th>)}</tr></thead><tbody>{rows.slice(0,100).map(row => <tr key={row.slug} className="border-b"><th scope="row" className="p-4"><a className="text-blue-700 underline" href={`/business/${row.slug}`}>{row.name}</a><span className="mt-1 block text-xs font-normal text-slate-500">{row.slug}</span></th>{(['views','website','phone','quotes'] as const).map(key => <td key={key} className="p-4">{row.results.current[key]} <span className="text-slate-500">({row.results.previous[key]})</span></td>)}</tr>)}</tbody></table>{!rows.length ? <p className="p-6 text-slate-500">No matching businesses.</p> : null}</div>
  </div></main><Footer/></>;
}
