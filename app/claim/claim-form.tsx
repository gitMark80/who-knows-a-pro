'use client';
import { FormEvent, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { activeRegionGroups, activeRegions, trades } from '@/data/catalog';

type InitialBusiness = { id: string; name: string; website: string; location: string; region: string; trade: string };
type ClaimFormProps = { initialBusiness: InitialBusiness | null; initialRegion?: string; initialTrade?: string; requestedPlan?: 'enhanced' | 'featured' };

export function ClaimForm({ initialBusiness, initialRegion, initialTrade, requestedPlan }: ClaimFormProps) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState('');
  const [error, setError] = useState('');
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setError('');
    try {
      const body = Object.fromEntries(new FormData(e.currentTarget));
      const res = await fetch('/api/claim', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json() as { message?: string; error?: string };
      if (res.ok) setDone(data.message || 'Your request was received.'); else setError(data.error || 'Please try again.');
    } catch {
      setError('We could not submit the claim right now. Please try again.');
    } finally {
      setBusy(false);
    }
  }
  if (done) return <div role="status" aria-live="polite" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-7 text-emerald-950"><CheckCircle2 className="size-8 text-emerald-600"/><h2 className="mt-4 text-xl font-extrabold">Request received</h2><p className="mt-2 leading-7">{done}</p></div>;
  return <form onSubmit={submit} className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-8">
    <input type="hidden" name="businessId" value={initialBusiness?.id || ''}/>
    <input type="hidden" name="requestedPlan" value={requestedPlan || ''}/>
    <input type="hidden" name="requestedRegion" value={initialRegion || initialBusiness?.region || ''}/>
    <input type="hidden" name="requestedTrade" value={initialTrade || initialBusiness?.trade || ''}/>
    <div className="hidden" aria-hidden="true"><Label htmlFor="companyFax">Company fax</Label><Input id="companyFax" name="companyFax" tabIndex={-1} autoComplete="off"/></div>
    {initialBusiness?<div className="rounded-xl border border-[#bed0df] bg-[#eef3f8] p-4"><p className="text-xs font-black uppercase tracking-wider text-[#35516d]">Claiming this profile</p><p className="mt-1 font-extrabold text-[#142c4c]">{initialBusiness.name}</p></div>:null}
    {requestedPlan ? <div className="rounded-xl border border-orange-200 bg-orange-50 p-4"><p className="text-xs font-black uppercase tracking-wider text-[#9b4917]">Selected after verification</p><p className="mt-1 font-extrabold text-[#142c4c]">{requestedPlan === 'featured' ? 'Featured — $99/month' : 'Enhanced listing — $29/month'}</p><p className="mt-1 text-xs text-slate-600">You will review the choice again before Stripe Checkout.</p></div> : null}
    <div><Label htmlFor="businessName">Business name</Label><Input id="businessName" name="businessName" required defaultValue={initialBusiness?.name} placeholder="Your business name" className="mt-2 h-12"/></div>
    <div className="grid gap-5 sm:grid-cols-2"><div><Label htmlFor="contactName">Your name</Label><Input id="contactName" name="contactName" required className="mt-2 h-12"/></div><div><Label htmlFor="email">Business email</Label><Input id="email" name="email" type="email" required placeholder="you@yourbusiness.com" className="mt-2 h-12"/></div></div>
    <div><Label htmlFor="website">Business website</Label><Input id="website" name="website" type="url" defaultValue={initialBusiness?.website} placeholder="https://..." className="mt-2 h-12"/></div>
    <div><Label htmlFor="location">City or service area</Label><Input id="location" name="location" required defaultValue={initialBusiness?.location} placeholder="Pensacola, FL" className="mt-2 h-12"/></div>
    <div className="grid gap-5 sm:grid-cols-2"><div><Label htmlFor="region">Directory region</Label><select id="region" name="region" defaultValue={initialBusiness?.region || initialRegion || activeRegions[0].slug} className="mt-2 h-12 w-full rounded-md border border-input bg-transparent px-3 text-sm">{activeRegionGroups.map(group => <optgroup key={group.state} label={group.state}>{group.regions.map(r => <option key={r.slug} value={r.slug}>{r.name}</option>)}</optgroup>)}</select></div><div><Label htmlFor="trade">Primary category</Label><select id="trade" name="trade" defaultValue={initialBusiness?.trade || initialTrade || trades[0].slug} className="mt-2 h-12 w-full rounded-md border border-input bg-transparent px-3 text-sm">{trades.map(t => <option key={t.slug} value={t.slug}>{t.name}</option>)}</select></div></div>
    <div><Label htmlFor="note">Anything we should know?</Label><Textarea id="note" name="note" className="mt-2 min-h-28" placeholder="Your role, service area, or a correction to the current listing"/></div>
    {error ? <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
    <Button type="submit" disabled={busy} className="h-12 w-full bg-[#ec7d2c] text-white hover:bg-[#d96c20]">{busy ? <><Loader2 className="size-4 animate-spin"/>Submitting…</> : 'Verify and claim business'}</Button>
    <p className="text-xs leading-5 text-slate-500">Email from the business website’s domain can be verified automatically. Requests using Gmail, Yahoo, or another unrelated address are reviewed before access is granted.</p>
  </form>;
}
