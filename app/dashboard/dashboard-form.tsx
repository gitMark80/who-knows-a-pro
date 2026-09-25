'use client';

import { FormEvent, useState } from 'react';
import { Check, Copy, ImagePlus, Loader2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Business } from '@/db/runtime';

export function DashboardForm({ business }: { business: Business }) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [badgeMessage, setBadgeMessage] = useState('');
  const profileUrl = `https://whoknowsapro.com/business/${business.main_slug || business.slug}`;
  const badgeCode = (theme: 'light' | 'dark') => `<a href="${profileUrl}"><img src="https://whoknowsapro.com/badges/find-us-${theme}.svg" alt="Find us on Who Knows a Pro."></a>`;

  async function copyBadge(theme: 'light' | 'dark') {
    await navigator.clipboard.writeText(badgeCode(theme));
    setBadgeMessage(`${theme === 'light' ? 'Light' : 'Dark'} badge code copied.`);
  }
  const missingProfileFields = [
    business.phone,
    business.address,
    business.service_area,
    business.hours,
    business.summary,
    business.specialties,
    business.year_founded,
    business.license_number,
  ].filter((value) => !value).length;

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
    const response = await fetch('/api/upload', { method: 'POST', body: data });
    setUploading(false);
    if (response.ok) location.reload();
    else {
      setIsError(true);
      setMessage('Upload failed. Use a JPG, PNG, or WebP under 5 MB.');
    }
  }

  async function checkout(tier: 'enhanced' | 'sponsored') {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ tier }),
    });
    const data = await response.json() as { url?: string; error?: string };
    if (data.url) location.href = data.url;
    else {
      setIsError(true);
      setMessage(data.error || 'Checkout is not ready.');
    }
  }

  async function billingPortal() {
    const response = await fetch('/api/billing-portal', { method: 'POST' });
    const data = await response.json() as { url?: string; error?: string };
    if (data.url) location.href = data.url;
    else {
      setIsError(true);
      setMessage(data.error || 'Billing management is not ready.');
    }
  }

  return <div className="space-y-7">
    <form onSubmit={save} className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
      <h2 className="text-xl font-black">Business profile</h2>
      {missingProfileFields > 0 ? <div className="mt-4 rounded-2xl border border-[#bed0df] bg-[#eef3f8] p-4">
        <p className="font-extrabold text-[#142c4c]">Complete your profile</p>
        <p className="mt-1 text-sm leading-6 text-slate-600">Add the real details customers use to compare businesses. Blank fields stay hidden from your public listing.</p>
      </div> : null}
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

    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
      <h2 className="text-xl font-black">Find us badge</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">Add this linked badge to your website so customers can reach your Who Knows a Pro profile.</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {(['light', 'dark'] as const).map((theme) => <div key={theme} className={`rounded-2xl border p-5 ${theme === 'dark' ? 'border-slate-700 bg-[#10243e]' : 'border-slate-200 bg-white'}`}>
          <img src={`/badges/find-us-${theme}.svg`} alt="Find us on Who Knows a Pro." width="220" height="56"/>
          <Button type="button" variant={theme === 'dark' ? 'secondary' : 'outline'} onClick={() => copyBadge(theme)} className="mt-4"><Copy className="size-4"/>Copy {theme} badge</Button>
        </div>)}
      </div>
      {badgeMessage ? <p role="status" aria-live="polite" className="mt-3 text-sm font-semibold text-[#27715c]">{badgeMessage}</p> : null}
    </div>

    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
      <h2 className="text-xl font-black">Logo and photos</h2>
      <p className="mt-2 text-sm text-slate-600">Add a square logo and up to six project or business photos.</p>
      {business.tier === 'free' ? <p className="mt-5 rounded-xl bg-[#eef3f8] p-4 text-sm font-semibold text-[#142c4c]">Upgrade to Enhanced or Sponsored to add your logo and photo gallery.</p> : <div className="mt-5 flex flex-wrap gap-3">
        <label className="cursor-pointer rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold"><input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(event) => upload(event, 'logo')}/><ImagePlus className="mr-2 inline size-4"/>Upload logo</label>
        <label className="cursor-pointer rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold"><input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(event) => upload(event, 'photo')}/><ImagePlus className="mr-2 inline size-4"/>Add photo</label>
        {uploading ? <span className="flex items-center gap-2 text-sm text-slate-500"><Loader2 className="size-4 animate-spin"/>Uploading…</span> : null}
      </div>}
    </div>

    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><h2 className="text-xl font-black">Listing plan</h2><p className="mt-2 text-sm text-slate-600">Current plan: <strong className="capitalize">{business.tier}</strong></p></div>
        {business.stripe_customer_id ? <Button variant="outline" onClick={billingPortal}>Manage billing</Button> : null}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Plan name="Enhanced" price="$29/month" items={['Logo and photo gallery', 'Highlighted listing card', 'Stronger contact action']} action={() => checkout('enhanced')}/>
        <Plan name="Sponsored" price="$99/month" items={['Everything in Enhanced', 'Top placement in one region and category', 'Sponsored label and priority position']} action={() => checkout('sponsored')} featured/>
      </div>
    </div>
  </div>;
}

function Plan({ name, price, items, action, featured = false }: { name: string; price: string; items: string[]; action: () => void; featured?: boolean }) {
  return <div className={`rounded-2xl border p-5 ${featured ? 'border-[#ec7d2c] bg-orange-50' : 'border-slate-200'}`}>
    <Star className={`size-5 ${featured ? 'fill-[#ec7d2c] text-[#ec7d2c]' : 'text-[#142c4c]'}`}/>
    <h3 className="mt-4 text-lg font-black">{name}</h3>
    <p className="mt-1 font-bold text-slate-600">{price}</p>
    <ul className="mt-4 space-y-2 text-sm text-slate-600">{items.map((item) => <li key={item} className="flex gap-2"><Check className="size-4 shrink-0 text-[#27715c]"/>{item}</li>)}</ul>
    <Button onClick={action} className={`mt-5 w-full ${featured ? 'bg-[#ec7d2c] hover:bg-[#d96c20]' : 'bg-[#142c4c] hover:bg-[#203d62]'}`}>Choose {name}</Button>
  </div>;
}
