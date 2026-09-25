import { ArrowRight, BadgeCheck, ExternalLink, MapPin, Star } from 'lucide-react';
import type { Business } from '@/db/runtime';

export function ListingCard({ business }: { business: Business }) {
  const featured = business.tier === 'sponsored';
  const enhanced = business.tier === 'enhanced';
  return <article className={`relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white p-5 shadow-[0_8px_35px_rgba(15,35,60,.06)] ${featured ? 'border-[#ec7d2c] ring-2 ring-[#ec7d2c]/10' : enhanced ? 'border-[#42617e] ring-1 ring-[#142c4c]/10' : 'border-slate-200'}`}>
    {featured ? <div className="absolute right-0 top-0 rounded-bl-xl bg-[#ec7d2c] px-3 py-1.5 text-[.67rem] font-extrabold uppercase tracking-wider text-white"><Star className="mr-1 inline size-3 fill-current"/>Sponsored</div> : null}
    {enhanced ? <div className="absolute right-0 top-0 rounded-bl-xl bg-[#142c4c] px-3 py-1.5 text-[.67rem] font-extrabold uppercase tracking-wider text-white">Enhanced</div> : null}
    {business.logo_url && business.tier !== 'free' ? <div className="flex size-12 items-center justify-center overflow-hidden rounded-xl bg-[#eaf0f6]"><img src={business.logo_url} alt={`${business.name} logo`} className="size-full object-cover"/></div> : null}
    <div className={`${business.logo_url && business.tier !== 'free' ? 'mt-4' : ''} flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#27715c]`}><BadgeCheck className="size-3.5"/>{business.owner_email ? 'Claimed business' : 'Public listing'}</div>
    <h2 className="mt-2 pr-8 text-xl font-extrabold tracking-tight text-[#142c4c]">{business.name}</h2>
    <p className="mt-1.5 flex items-center gap-1 text-sm text-slate-500"><MapPin className="size-3.5"/>{business.location}</p>
    <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">{business.summary}</p>
    <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-3 pt-6">
      <a href={business.website} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${business.name} website`} className="inline-flex items-center gap-1 rounded-lg bg-[#ec7d2c] px-3 py-2 text-sm font-extrabold text-white hover:bg-[#d96c20]">Visit website <ExternalLink className="size-3.5"/></a>
      <a href={`/business/${business.slug}`} className="inline-flex items-center gap-1 rounded-lg border border-[#142c4c]/15 px-3 py-2 text-sm font-extrabold text-[#142c4c] hover:border-[#ec7d2c] hover:bg-[#fff7f0] hover:text-[#d96c20]">Profile & claim <ArrowRight className="size-4"/></a>
    </div>
  </article>;
}
