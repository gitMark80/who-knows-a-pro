import { ArrowRight, BadgeCheck, Clock3, ExternalLink, MapPin, MapPinned, Phone, Star, Wrench } from 'lucide-react';
import Image from 'next/image';
import type { Business } from '@/db/runtime';
import { specialtyList } from '@/lib/business-profile';

export function ListingCard({ business }: { business: Business }) {
  const featured = business.tier === 'sponsored';
  const enhanced = business.tier === 'enhanced';
  const specialties = specialtyList(business.specialties);

  return <article className={`relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white p-5 shadow-[0_8px_35px_rgba(15,35,60,.06)] ${featured ? 'border-[#ec7d2c] ring-2 ring-[#ec7d2c]/10' : enhanced ? 'border-[#42617e] ring-1 ring-[#142c4c]/10' : 'border-slate-200'}`}>
    {featured ? <div className="absolute right-0 top-0 rounded-bl-xl bg-[#ec7d2c] px-3 py-1.5 text-[.67rem] font-extrabold uppercase tracking-wider text-white"><Star className="mr-1 inline size-3 fill-current"/>Sponsored</div> : null}
    {enhanced ? <div className="absolute right-0 top-0 rounded-bl-xl bg-[#142c4c] px-3 py-1.5 text-[.67rem] font-extrabold uppercase tracking-wider text-white">Enhanced</div> : null}
    {business.logo_url && business.tier !== 'free' ? <div className="flex size-12 items-center justify-center overflow-hidden rounded-xl bg-[#eaf0f6]"><Image src={business.logo_url} alt={`${business.name} logo`} width={48} height={48} unoptimized className="size-full object-cover"/></div> : null}
    <div className={`${business.logo_url && business.tier !== 'free' ? 'mt-4' : ''} flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#27715c]`}><BadgeCheck className="size-3.5"/>{business.owner_email ? 'Claimed business' : 'Public listing'}</div>
    <h2 className="mt-2 pr-8 text-xl font-extrabold tracking-tight text-[#142c4c]">{business.name}</h2>

    {business.summary ? <p className="mt-4 text-sm leading-6 text-slate-600">{business.summary}</p> : null}

    {(business.phone || business.address || business.service_area || business.hours || specialties.length > 0) ? <dl className="mt-5 space-y-3 border-t border-slate-100 pt-4 text-sm text-slate-600">
      {business.phone ? <div className="flex items-start gap-2"><Phone aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#d96c20]"/><dt className="sr-only">Phone</dt><dd><a href={`tel:${business.phone}`} className="font-bold text-[#142c4c] hover:text-[#d96c20] hover:underline">{business.phone}</a></dd></div> : null}
      {business.address ? <div className="flex items-start gap-2"><MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#d96c20]"/><dt className="sr-only">Address</dt><dd>{business.address}</dd></div> : null}
      {business.service_area ? <div className="flex items-start gap-2"><MapPinned aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#d96c20]"/><dt className="sr-only">Service area</dt><dd><span className="font-semibold text-slate-700">Service area:</span> {business.service_area}</dd></div> : null}
      {business.hours ? <div className="flex items-start gap-2"><Clock3 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#d96c20]"/><dt className="sr-only">Hours</dt><dd className="whitespace-pre-line">{business.hours}</dd></div> : null}
      {specialties.length ? <div className="flex items-start gap-2"><Wrench aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#d96c20]"/><dt className="sr-only">Specialties</dt><dd><span className="font-semibold text-slate-700">Specialties:</span> {specialties.join(', ')}</dd></div> : null}
    </dl> : null}

    <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-3 pt-6">
      <a href={business.website} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${business.name} official website`} className="inline-flex items-center gap-1 rounded-lg bg-[#ec7d2c] px-3 py-2 text-sm font-extrabold text-white hover:bg-[#d96c20]">Visit website <ExternalLink className="size-3.5"/></a>
      <a href={`/business/${business.main_slug || business.slug}`} className="inline-flex items-center gap-1 rounded-lg border border-[#142c4c]/15 px-3 py-2 text-sm font-extrabold text-[#142c4c] hover:border-[#ec7d2c] hover:bg-[#fff7f0] hover:text-[#d96c20]">Profile & claim <ArrowRight className="size-4"/></a>
    </div>
  </article>;
}
