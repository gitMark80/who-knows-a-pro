import type { BusinessResults } from '@/db/business-results';

export function BusinessResultsPanel({ results }: { results: BusinessResults }) {
  const metrics = [['views', 'Profile views'], ['website', 'Website clicks'], ['phone', 'Phone clicks'], ['quotes', 'Assigned quote requests']] as const;
  return <section className="mb-7 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
    <p className="eyebrow">Your results</p><h2 className="mt-1 text-2xl font-black text-[#142c4c]">Interest in your business</h2>
    <p className="mt-2 text-sm text-slate-600">This calendar month so far, compared with the full previous month. Dates use UTC.</p>
    <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">{metrics.map(([key, label]) => <div key={key} className="rounded-2xl bg-[#f5f7fa] p-4">
      <p className="text-sm font-bold text-slate-600">{label}</p><p className="mt-2 text-3xl font-black text-[#142c4c]">{results.current[key]}</p>
      <p className="mt-2 text-xs text-slate-500">Last month: {results.previous[key]}</p>
    </div>)}</div>
    <p className="mt-5 text-xs leading-5 text-slate-500">Website and phone clicks are expressions of interest, not confirmed visits, calls, or sales. Rapid repeat clicks are limited; automated activity may still be included. Quote requests count only when assigned to your business, not every request on a page where you appear. Click tracking began September 29, 2026; earlier clicks are unavailable.</p>
  </section>;
}
