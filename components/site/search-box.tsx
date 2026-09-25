'use client';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, MapPin, Search, Wrench } from 'lucide-react';
import { activeRegionGroups, activeRegions, trades } from '@/data/catalog';
import { Button } from '@/components/ui/button';
type SearchBoxProps = { compact?: boolean; initialRegion?: string; initialTrade?: string };

export function SearchBox({compact=false,initialRegion=activeRegions[0].slug,initialTrade=trades[0].slug}:SearchBoxProps){
 const router=useRouter();
 const [region,setRegion]=useState<string>(initialRegion); const [trade,setTrade]=useState<string>(initialTrade);
 const go=(e:FormEvent)=>{e.preventDefault();router.push(`/${region}/${trade}`)};
 return <form onSubmit={go} className={`grid gap-2 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-[0_18px_60px_rgba(15,35,60,.14)] ${compact?'md:grid-cols-[1fr_1fr_auto]':'sm:grid-cols-[1fr_1fr_auto]'}`}>
  <label className="relative flex h-13 items-center rounded-md bg-slate-50">
   <span className="sr-only">Category</span><Wrench className="pointer-events-none absolute left-4 size-4 text-[#ec7d2c]"/>
   <select aria-label="Category" value={trade} onChange={event=>setTrade(event.target.value)} className="h-full w-full appearance-none rounded-md bg-transparent pr-10 pl-11 text-base font-medium text-[#142c4c] outline-none focus-visible:ring-3 focus-visible:ring-[#ec7d2c]/30">
    {trades.map(t=><option key={t.slug} value={t.slug}>{t.name}</option>)}
   </select><ChevronDown className="pointer-events-none absolute right-4 size-4 text-slate-400"/>
  </label>
  <label className="relative flex h-13 items-center rounded-md bg-slate-50">
   <span className="sr-only">Region</span><MapPin className="pointer-events-none absolute left-4 size-4 text-[#ec7d2c]"/>
   <select aria-label="Region" value={region} onChange={event=>setRegion(event.target.value)} className="h-full w-full appearance-none rounded-md bg-transparent pr-10 pl-11 text-base font-medium text-[#142c4c] outline-none focus-visible:ring-3 focus-visible:ring-[#ec7d2c]/30">
    {activeRegionGroups.map(group=><optgroup key={group.state} label={group.state}>{group.regions.map(r=><option key={r.slug} value={r.slug}>{r.name}</option>)}</optgroup>)}
   </select><ChevronDown className="pointer-events-none absolute right-4 size-4 text-slate-400"/>
  </label>
  <Button type="submit" className="h-13 bg-[#ec7d2c] px-7 text-base text-white hover:bg-[#d96c20]"><Search className="size-4"/>Search</Button>
 </form>
}
