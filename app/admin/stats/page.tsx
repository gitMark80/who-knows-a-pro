/* eslint-disable @next/next/no-html-link-for-pages -- Native anchors keep navigation consistent with the rest of the site. */
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Footer } from '@/components/site/footer';
import { Header } from '@/components/site/header';
import { regions, trades } from '@/data/catalog';
import { currentAdminEmail } from '@/db/auth';
import { STAT_RANGES, parseRange, rangeStart, statTotals, statsByDay, statsByPlace, statsBySource, type DayRow } from '@/db/stats';
import { NoCountToggle } from './no-count-toggle';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Site stats', robots: { index: false, follow: false } };

const fmt = (value: number) => value.toLocaleString('en-US');
const regionName = new Map<string, string>(regions.map((item) => [item.slug, item.name]));
const tradeName = new Map<string, string>(trades.map((item) => [item.slug, item.name]));

function Bars({ rows, pick, color }: { rows: DayRow[]; pick: (row: DayRow) => number; color: string }) {
  const values = rows.map(pick);
  const max = Math.max(1, ...values);
  return (
    <div className="flex h-28 items-end gap-[2px]" role="img" aria-label={`Daily values, oldest to newest: ${values.join(', ')}`}>
      {rows.map((row, i) => (
        <div
          key={row.day}
          title={`${row.day}: ${values[i]}`}
          className="min-h-[2px] flex-1 rounded-t-[3px]"
          style={{ height: `${Math.max(2, (values[i] / max) * 100)}%`, background: i === rows.length - 1 ? '#ec7d2c' : color }}
        />
      ))}
    </div>
  );
}

function Tile({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="text-2xl font-black text-[#142c4c] tabular-nums">{value}</div>
      <div className="mt-1 text-xs font-semibold text-slate-600">{label}</div>
      {sub ? <div className="mt-0.5 text-xs text-slate-400">{sub}</div> : null}
    </div>
  );
}

export default async function StatsPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  if (!await currentAdminEmail()) redirect('/admin');
  const range = parseRange((await searchParams).range);
  const since = rangeStart(range);
  const [totals, days, sources, cities, categories] = await Promise.all([
    statTotals(since), statsByDay(30), statsBySource(since), statsByPlace('region', since), statsByPlace('trade', since),
  ]);
  const label = range === '1' ? 'today' : range === 'all' ? 'all time' : `last ${range} days`;
  const short = (day: string) => new Date(`${day}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
  const cell = 'px-2 py-2 text-right tabular-nums';
  const head = 'px-2 py-2 text-right font-semibold';
  const zero = (value: number) => (value ? fmt(value) : <span className="text-slate-300">0</span>);

  return <><Header/><main className="min-h-screen bg-[#f5f7fa] px-4 py-8 sm:px-5 sm:py-10"><div className="mx-auto max-w-5xl space-y-6">
    <div>
      <div className="flex flex-wrap gap-4 text-sm font-bold"><a href="/admin" className="underline">Back to admin</a><a href="/admin/funnel" className="underline">Conversion dashboard</a><a href="/admin/results" className="underline">Business results</a></div>
      <h1 className="mt-4 text-3xl font-black text-[#142c4c]">Site stats</h1>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Visits, profile views, clicks, and quote requests across the whole directory. Everything is anonymous: no names, emails, or IP addresses. Days run on UTC (they roll over at 7pm Central).</p>
    </div>

    <nav aria-label="Time range" className="flex gap-1 rounded-2xl bg-[#e3e9f1] p-1">
      {Object.entries(STAT_RANGES).map(([key, name]) => (
        <a key={key} href={`/admin/stats?range=${key}`} aria-current={key === range ? 'page' : undefined}
          className={`flex-1 rounded-xl px-2 py-2.5 text-center text-sm font-bold ${key === range ? 'bg-white text-[#142c4c] shadow-sm' : 'text-slate-600'}`}>{name}</a>
      ))}
    </nav>

    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      <Tile value={fmt(totals.visits)} label="Visits" sub={`${fmt(totals.returning)} returning`}/>
      <Tile value={fmt(totals.profileViews)} label="Business profile views"/>
      <Tile value={fmt(totals.websiteClicks + totals.phoneClicks)} label="Website & phone clicks" sub={`${fmt(totals.websiteClicks)} web · ${fmt(totals.phoneClicks)} phone`}/>
      <Tile value={fmt(totals.quotes)} label="Quote requests"/>
      <Tile value={fmt(totals.claims)} label="Listing claims" sub={`${fmt(totals.checkouts)} checkouts · ${fmt(totals.activations)} paid`}/>
    </div>

    <section className="rounded-2xl border bg-white p-5">
      <h2 className="text-lg font-black">Visits per day <span className="text-sm font-normal text-slate-500">last 30 days</span></h2>
      <div className="mt-3"><Bars rows={days} pick={(row) => row.visits} color="#142c4c"/></div>
      <div className="mt-1 flex justify-between text-xs text-slate-500"><span>{short(days[0].day)}</span><span>today</span></div>
      <h2 className="mt-6 text-lg font-black">Profile views and clicks per day</h2>
      <div className="mt-3"><Bars rows={days} pick={(row) => row.views + row.clicks} color="#5b7fa8"/></div>
      <div className="mt-1 flex justify-between text-xs text-slate-500"><span>{short(days[0].day)}</span><span>today</span></div>
      <p className="mt-3 text-xs text-slate-500">Quote requests in the last 30 days: {fmt(days.reduce((sum, row) => sum + row.quotes, 0))}. Visit counting started when this page went live; profile views, clicks, and quotes include earlier history.</p>
    </section>

    <section className="overflow-x-auto rounded-2xl border bg-white p-5">
      <h2 className="text-lg font-black">Where visitors come from, {label}</h2>
      <p className="mt-1 text-xs text-slate-500">Source is the visitor&apos;s utm_source tag, or the site that linked to them, remembered for 30 days. Add <code>?utm_source=facebook</code> (or nextdoor, flyer, email…) to links you share.</p>
      <table className="mt-3 w-full min-w-[640px] text-sm"><thead><tr className="border-b text-xs text-slate-500"><th className="py-2 text-left font-semibold">Source</th><th className={head}>Visits</th><th className={head}>Returning</th><th className={head}>Profile views</th><th className={head}>Quotes</th><th className={head}>Claims</th><th className={head}>Checkouts</th><th className={head}>Paid</th></tr></thead>
        <tbody>{sources.map((row) => <tr key={row.source} className="border-b border-slate-100"><td className="py-2 font-semibold capitalize">{row.source}</td><td className={cell}>{zero(row.visits)}</td><td className={cell}>{zero(row.returning)}</td><td className={cell}>{zero(row.views)}</td><td className={cell}>{zero(row.quotes)}</td><td className={cell}>{zero(row.claims)}</td><td className={cell}>{zero(row.checkouts)}</td><td className={cell}>{zero(row.activations)}</td></tr>)}</tbody></table>
      {!sources.length ? <p className="mt-3 text-sm text-slate-500">Nothing recorded for this range yet.</p> : null}
    </section>

    <div className="grid gap-6 lg:grid-cols-2">
      {([['Cities', cities, regionName], ['Categories', categories, tradeName]] as const).map(([title, rows, names]) => (
        <section key={title} className="overflow-x-auto rounded-2xl border bg-white p-5">
          <h2 className="text-lg font-black">{title}, {label}</h2>
          <table className="mt-3 w-full text-sm"><thead><tr className="border-b text-xs text-slate-500"><th className="py-2 text-left font-semibold">{title === 'Cities' ? 'City' : 'Category'}</th><th className={head}>Visits</th><th className={head}>Profile views</th><th className={head}>Quotes</th></tr></thead>
            <tbody>{rows.map((row) => <tr key={row.key} className="border-b border-slate-100"><td className="py-2 font-semibold">{names.get(row.key) || row.key}</td><td className={cell}>{zero(row.visits)}</td><td className={cell}>{zero(row.views)}</td><td className={cell}>{zero(row.quotes)}</td></tr>)}</tbody></table>
          {!rows.length ? <p className="mt-3 text-sm text-slate-500">Nothing recorded for this range yet.</p> : null}
        </section>
      ))}
    </div>

    <section className="rounded-2xl border bg-white p-5 space-y-3">
      <h2 className="text-lg font-black">This browser</h2>
      <NoCountToggle/>
      <p className="text-xs text-slate-500">
        {totals.flagged ? `${fmt(totals.flagged)} visit${totals.flagged === 1 ? '' : 's'} from automated browsers ${label} ${totals.flagged === 1 ? 'was' : 'were'} left out of these numbers. ` : ''}
        Per-business numbers are on <a href="/admin/results" className="underline">Business results</a>; the paid-listing funnel is on the <a href="/admin/funnel" className="underline">Conversion dashboard</a>. Page views by country and device are in Vercel Analytics.
      </p>
    </section>
  </div></main><Footer/></>;
}
