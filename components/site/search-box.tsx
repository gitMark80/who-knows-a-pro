'use client';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Search, Wrench } from 'lucide-react';
import { activeRegionGroups, activeRegions, trades } from '@/data/catalog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
type SearchBoxProps = { compact?: boolean; initialRegion?: string; initialTrade?: string };

export function SearchBox({compact=false,initialRegion=activeRegions[0].slug,initialTrade=trades[0].slug}:SearchBoxProps){
 const router=useRouter();
 const [region,setRegion]=useState<string>(initialRegion); const [trade,setTrade]=useState<string>(initialTrade);
 const go=(e:FormEvent)=>{e.preventDefault();router.push(`/${region}/${trade}`)};
 return <form onSubmit={go} className={`grid gap-2 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-[0_18px_60px_rgba(15,35,60,.14)] ${compact?'md:grid-cols-[1fr_1fr_auto]':'sm:grid-cols-[1fr_1fr_auto]'}`}>
  <Select value={trade} onValueChange={setTrade}><SelectTrigger aria-label="Category" className="h-13 w-full border-0 bg-slate-50 px-4 text-base shadow-none"><Wrench className="size-4 text-[#ec7d2c]"/><SelectValue/></SelectTrigger><SelectContent>{trades.map(t=><SelectItem key={t.slug} value={t.slug}>{t.name}</SelectItem>)}</SelectContent></Select>
  <Select value={region} onValueChange={setRegion}><SelectTrigger aria-label="Region" className="h-13 w-full border-0 bg-slate-50 px-4 text-base shadow-none"><MapPin className="size-4 text-[#ec7d2c]"/><SelectValue/></SelectTrigger><SelectContent className="max-h-80">{activeRegionGroups.map(group=><SelectGroup key={group.state}><SelectLabel className="font-extrabold uppercase tracking-wider">{group.state}</SelectLabel>{group.regions.map(r=><SelectItem key={r.slug} value={r.slug}>{r.name}</SelectItem>)}</SelectGroup>)}</SelectContent></Select>
  <Button type="submit" className="h-13 bg-[#ec7d2c] px-7 text-base text-white hover:bg-[#d96c20]"><Search className="size-4"/>Search</Button>
 </form>
}
