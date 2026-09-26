'use client';

import { FormEvent, useState } from 'react';
import Image from 'next/image';
import { BarChart3, Check, Copy, ImagePlus, Loader2, Star, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Business } from '@/db/runtime';

type PageOption = { region: string; trade: string; label: string };
type Performance = { totalViews: number; viewsLast30Days: number; pageLeadsLast30Days: number; routedLeadsLast30Days: number };

export function DashboardForm({ business, pageOptions, stats, requestedPlan, requestedPage, checkoutState }: {
  business: Business;
  pageOptions: PageOption[];
  stats: Performance;
  requestedPlan?: 'enhanced' | 'featured';
  requestedPage?: string;
  checkoutState?: string;
}) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [badgeMessage, setBadgeMessage] = useState('');
  const [selectedPage, setSelectedPage] = useState(requestedPage || (pageOptions[0] ? `${pageOptions[0].region}|${pageOptions[0].trade}` : ''));
  const [checkoutPlan, setCheckoutPlan] = useState<'enhanced' | 'featured' | null>(null);
  const profileUrl = `https://whoknowsapro.com/business/${business.main_slug || business.slug}`;
  const badgeCode = (theme: 'light' | 'dark') => `<a href="${profileUrl}"><img src="https://whoknowsapro.com/badges/find-us-${theme}.svg" alt="Find us on Who Knows a Pro"></a>`;

  async function copyBadge(theme: 'light' | 'dark') {
    await navigator.clipboard.writeText(badgeCode(theme));
    setBadgeMessage(`${theme === 'light' ? 'Light' : 'Dark'} badge code copied.`);
  }
  const missingProfileFields = [business.phone, business.address, business.service_area, business.hours, business.summary, business.specialties, business.year_founded, business.license_number].filter((value) => !value).length;

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const response = await fetch('/api/business', {
        method: 'PATCH',
        body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))),
        headers: { 'content-type': 'application/json' },
      });
      const data = await response.json() as { error?: string };
      setIsError(!response.ok);
      setMessage(response.ok ? 'Profile saved.' : data.error || 'Could not save changes.');
    } catch {
      setIsError(true);
      setMessage('Could not save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function upload(event: React.ChangeEvent<HTMLInputElement>, kind: 'logo' | 'photo') {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const data = new FormData();
    data.set('file', file);
    data.set('kind', kind);
    try {
      const response = await fetch('/api/upload', { method: 'POST', body: data });
      if (response.ok) location.reload();
      else {
        setIsError(true);
        setMessage('Upload failed. Use a JPG, PNG, or WebP under 5 MB.');
      }
    } catch {
      setIsError(true);
      setMessage('Upload failed. Check your connection and try again.');
    } finally {
      setUploading(false);
    }
  }

  async function checkout(plan: 'enhanced' | 'featured') {
    setCheckoutPlan(plan);
    setMessage('');
    setIsError(false);
    const [region, trade] = selectedPage.split('|');
    if (plan === 'featured' && (!region || !trade)) {
      setCheckoutPlan(null);
      setIsError(true);
      setMessage('Choose the city/category page you want to feature.');
      return;
    }
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ plan, region: plan === 'featured' ? region : undefined, trade: plan === 'featured' ? trade : undefined }),
      });
      const data = await response.json() as { url?: string; error?: string };
      if (data.url) location.href = data.url;
      else {
        setIsError(true);
        setMessage(data.error || 'Checkout is not ready.');
      }
    } catch {
      setIsError(true);
      setMessage('Checkout is not ready.');
    } finally {
      setCheckoutPlan(null);
    }
  }

  async function billingPortal() {
    setMessage('');
    setIsError(false);
    try {
      const response = await fetch('/api/billing-portal', { method: 'POST' });
      const data = await response.json() as { url?: string; error?: string };
      if (data.url) location.href = data.url;
      else {
        setIsError(true);
        setMessage(data.error || 'Billing management is not ready.');
      }
    } catch {
      setIsError(true);
      setMessage('Billing management is not ready.');
    }
  }

  return <div className="space-y-7">
    {checkoutState === 'success' ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 font-semibold text-emerald-900">Stripe Checkout completed. Your plan will appear as soon as the verified Stripe webhook is processed.</div> : null}
    {checkoutState === 'cancelled' ? <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 font-semibold text-amber-900">Checkout was cancelled and no plan change was made.</div> : null}

    <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
      <div className="flex items-center gap-3"><BarChart3 className="size-6 text-[#d96c20]"/><div><p className="eyebrow">Real performance</p><h2 className="text-xl font-black">Your listing activity</h2></div></div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Profile views, all time" value={stats.totalViews}/>
        <Stat label="Profile views, last 30 days" value={stats.viewsLast30Days}/>
        <Stat label="Quote requests on your pages, last 30 days" value={stats.pageLeadsLast30Days}/>
      </div>
      {business.tier === 'free' ? <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#bed0df] bg-[#eef3f8] p-4"><TrendingUp className="mt-0.5 size-5 shrink-0 text-[#27715c]"/><p className="text-sm leading-6 text-slate-700">Enhanced adds richer placement. Featured adds one exclusive page position and routes that page’s future quote requests to your verified business email. These numbers are measured from actual site activity.</p></div> : <p className="mt-4 text-sm text-slate-500">Leads routed directly to this business in the last 30 days: <strong>{stats.routedLeadsLast30Days}</strong></p>}
    </section>

    <form onSubmit={save} className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
      <h2 className="text-xl font-black">Business profile</h2>
      {missingProfileFields > 0 ? <div className="mt-4 rounded-2xl border border-[#bed0df] bg-[#eef3f8] p-4"><p className="font-extrabold text-[#142c4c]">Complete your profile</p><p className="mt-1 text-sm leading-6 text-slate-600">Add the real details customers use to compare businesses. Blank fields stay hidden from your public listing.</p></div> : null}
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div><Label htmlFor="name">Business name</Label><Input id="name" name="name" required defaultValue={business.name} className="mt-2 h-12"/></div>
        <div><Label htmlFor="phone">Phone</Label><Input id="phone" name="phone" type="tel" defaultValue={business.phone || ''} className="mt-2 h-12"/></div>
        <div className="sm:col-span-2"><Label htmlFor="website">Website</Label><Input id="website" name="website" type="url" required defaultValue={business.website} className="mt-2 h-12"/></div>
        <div className="sm:col-span-2"><Label htmlFor="location">Directory city or primary market</Label><Input id="location" name="location" required defaultValue={business.location} className="mt-2 h-12"/></div>
        <div className="sm:col-span-2"><Label htmlFor="address">Business address</Label><Input id="address" name="address" defaultValue={business.address || ''} placeholder="Only add an address customers may visit" className="mt-2 h-12"/></div>
        <div className="sm:col-span-2"><Label htmlFor="serviceArea">Service area</Label><Input id="serviceArea" name="serviceArea" defaultValue={business.service_area || ''} placeholder="Cities, counties, or neighborhoods you serve" className="mt-2 h-12"/></div>
        <div className="sm:col-span-2"><Label htmlFor="summary">Short description</Label><Textarea id="summary" name="summary" defaultValue={business.summary} className="mt-2 min-h-28" maxLength={900}/></div>
        <div className="sm:col-span-2"><Label htmlFor="specialties">Specialties</Label><Textarea id="specialties" name="specialties" defaultValue={business.specialties || ''} placeholder="Separate specialties with commas or new lines" className="mt-2 min-h-24" maxLength={800}/></div>
        <div className="sm:col-span-2"><Label htmlFor="hours">Business hours</Label><Textarea id="hours" name="hours" defaultValue={business.hours || ''} placeholder="For example: Mo-Fr 08:00-17:00" className="mt-2 min-h-24" maxLength={1000}/><p className="mt-2 text-xs leading-5 text-slate-500">Use one schedule per line, such as Mo-Fr 08:00-17:00, so search engines can read the hours.</p></div>
        <div><Label htmlFor="yearFounded">Year founded</Label><Input id="yearFounded" name="yearFounded" type="number" min="1600" max={new Date().getFullYear()} defaultValue={business.year_founded || ''} className="mt-2 h-12"/></div>
        <div><Label htmlFor="licenseNumber">License number</Label><Input id="licenseNumber" name="licenseNumber" defaultValue={business.license_number || ''} className="mt-2 h-12"/></div>
      </div>
      {message ? <p role={isError ? 'alert' : 'status'} aria-live="polite" className={`mt-4 text-sm font-semibold ${isError ? 'text-red-700' : 'text-[#27715c]'}`}>{message}</p> : null}
      <Button disabled={saving} className="mt-6 bg-[#142c4c] text-white hover:bg-[#203d62]">{saving ? <Loader2 className="size-4 animate-spin"/> : <Check className="size-4"/>}Save profile</Button>
    </form>

    {!business.is_test ? <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
      <h2 className="text-xl font-black">Find us badge</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">Add this linked badge to your website so customers can reach your Who Knows a Pro profile.</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">{(['light', 'dark'] as const).map((theme) => <div key={theme} className={`rounded-2xl border p-5 ${theme === 'dark' ? 'border-slate-700 bg-[#10243e]' : 'border-slate-200 bg-white'}`}><Image src={`/badges/find-us-${theme}.svg`} alt="Find us on Who Knows a Pro" width={220} height={56}/><Button type="button" variant={theme === 'dark' ? 'secondary' : 'outline'} onClick={() => copyBadge(theme)} className="mt-4"><Copy className="size-4"/>Copy {theme} badge</Button></div>)}</div>
      {badgeMessage ? <p role="status" aria-live="polite" className="mt-3 text-sm font-semibold text-[#27715c]">{badgeMessage}</p> : null}
    </div> : null}

    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
      <h2 className="text-xl font-black">Logo and photos</h2>
      <p className="mt-2 text-sm text-slate-600">Add a square logo and up to six project or business photos.</p>
      {business.tier === 'free' ? <p className="mt-5 rounded-xl bg-[#eef3f8] p-4 text-sm font-semibold text-[#142c4c]">Upgrade to Enhanced or Featured to add your logo and photo gallery.</p> : <div className="mt-5 flex flex-wrap gap-3"><label className="cursor-pointer rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold"><input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(event) => upload(event, 'logo')}/><ImagePlus className="mr-2 inline size-4"/>Upload logo</label><label className="cursor-pointer rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold"><input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(event) => upload(event, 'photo')}/><ImagePlus className="mr-2 inline size-4"/>Add photo</label>{uploading ? <span className="flex items-center gap-2 text-sm text-slate-500"><Loader2 className="size-4 animate-spin"/>Uploading…</span> : null}</div>}
    </div>

    <div className={`rounded-3xl border bg-white p-6 sm:p-8 ${requestedPlan ? 'border-[#ec7d2c] ring-2 ring-[#ec7d2c]/10' : 'border-slate-200'}`}>
      <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-xl font-black">Listing plan</h2><p className="mt-2 text-sm text-slate-600">Current plan: <strong className="capitalize">{business.tier === 'sponsored' ? 'Featured' : business.tier}</strong></p></div>{business.stripe_customer_id ? <Button variant="outline" onClick={billingPortal}>Manage billing</Button> : null}</div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Plan name="Enhanced" price="$29/month" items={['Full profile details', 'Logo and photo gallery', 'Placement above free listings']} action={() => checkout('enhanced')} busy={checkoutPlan === 'enhanced'} selected={requestedPlan === 'enhanced'}/>
        {!business.is_test ? <div>
          <Plan name="Featured" price="$99/month" items={['Everything in Enhanced', 'Exclusive top spot on one page', 'That page’s incoming leads']} action={() => checkout('featured')} busy={checkoutPlan === 'featured'} selected={requestedPlan === 'featured'} featured/>
          <Label htmlFor="featuredPage" className="mt-4 block">Featured city/category page</Label>
          <select id="featuredPage" value={selectedPage} onChange={(event) => setSelectedPage(event.target.value)} className="mt-2 h-12 w-full rounded-md border border-input bg-transparent px-3 text-sm">
            {pageOptions.map((option) => <option key={`${option.region}|${option.trade}`} value={`${option.region}|${option.trade}`}>{option.label}</option>)}
          </select>
        </div> : null}
      </div>
      <p className="mt-5 text-xs leading-5 text-slate-500">Checkout uses Stripe’s hosted payment page. The Featured spot is checked and reserved immediately before checkout.</p>
    </div>
  </div>;
}

function Stat({ label, value }: { label: string; value: number }) {
  return <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-3xl font-black text-[#142c4c]">{value.toLocaleString()}</p><p className="mt-1 text-xs font-bold leading-5 text-slate-500">{label}</p></div>;
}

function Plan({ name, price, items, action, busy, selected = false, featured = false }: { name: string; price: string; items: string[]; action: () => void; busy: boolean; selected?: boolean; featured?: boolean }) {
  return <div className={`rounded-2xl border p-5 ${featured ? 'border-[#ec7d2c] bg-orange-50' : 'border-slate-200'} ${selected ? 'ring-2 ring-[#ec7d2c]/20' : ''}`}><Star className={`size-5 ${featured ? 'fill-[#ec7d2c] text-[#ec7d2c]' : 'text-[#142c4c]'}`}/><h3 className="mt-4 text-lg font-black">{name}</h3><p className="mt-1 font-bold text-slate-600">{price}</p><ul className="mt-4 space-y-2 text-sm text-slate-600">{items.map((item) => <li key={item} className="flex gap-2"><Check className="size-4 shrink-0 text-[#27715c]"/>{item}</li>)}</ul><Button onClick={action} disabled={busy} className={`mt-5 w-full ${featured ? 'bg-[#ec7d2c] hover:bg-[#d96c20]' : 'bg-[#142c4c] hover:bg-[#203d62]'}`}>{busy ? <Loader2 className="size-4 animate-spin"/> : null}Choose {name}</Button></div>;
}
