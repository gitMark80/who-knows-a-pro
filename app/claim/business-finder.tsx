'use client';

import { useEffect, useState } from 'react';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Result = { slug: string; name: string; claimed: boolean; places: string[]; categories: string[] };

/** Step 1: find the existing listing so owners claim it instead of creating a duplicate. */
export function BusinessFinder() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const term = query.trim();
  const active = term.length >= 2;

  useEffect(() => {
    if (!active) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/business-search?q=${encodeURIComponent(term)}`, { signal: controller.signal });
        const data = await response.json() as { results?: Result[] };
        setResults(data.results || []);
        setSearched(true);
      } catch { /* Aborted or offline; the form below still works. */ } finally {
        setLoading(false);
      }
    }, 250);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [active, term]);
  const visible = active ? results : [];

  return <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-8">
    <p className="text-xs font-black uppercase tracking-wider text-[#35516d]">Step 1</p>
    <Label htmlFor="businessSearch" className="mt-1 block text-lg font-extrabold text-[#142c4c]">Find your business</Label>
    <p className="mt-1 text-sm text-slate-600">Most local businesses are already listed. Claim the existing listing so customers see one accurate profile.</p>
    <div className="relative mt-4">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"/>
      <Input id="businessSearch" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Business name" autoComplete="organization" className="h-12 pl-9"/>
      {active && loading ? <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-slate-400"/> : null}
    </div>
    {visible.length ? <ul className="mt-4 divide-y divide-slate-100 rounded-2xl border border-slate-200">{visible.map((result) => <li key={result.slug}>
      <a href={`/claim?business=${encodeURIComponent(result.slug)}`} rel="nofollow" className="flex items-center justify-between gap-4 p-4 hover:bg-[#fff7f0]">
        <span><span className="block font-extrabold text-[#142c4c]">{result.name}</span><span className="mt-0.5 block text-xs text-slate-500">{[...result.categories, ...result.places].join(' · ')}</span></span>
        <span className="shrink-0 rounded-lg bg-[#ec7d2c] px-3 py-1.5 text-xs font-extrabold text-white">{result.claimed ? 'Sign in' : 'Claim'}</span>
      </a>
    </li>)}</ul> : null}
    {active && searched && !loading && !visible.length ? <p className="mt-4 text-sm text-slate-600">No listing found with that name. Add your business with the form below — it’s free.</p> : null}
  </div>;
}
