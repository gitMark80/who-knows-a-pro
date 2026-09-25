'use client';

import { FormEvent, useState } from 'react';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type QuoteRequestFormProps = {
  region: string;
  regionName: string;
  trade: string;
  tradeName: string;
};

export function QuoteRequestForm({ region, regionName, trade, tradeName }: QuoteRequestFormProps) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setBusy(true);
    setMessage('');
    setError('');
    try {
      const values = Object.fromEntries(new FormData(form));
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...values, region, trade }),
      });
      const data = await response.json() as { message?: string; error?: string };
      if (!response.ok) throw new Error(data.error || 'We could not send your request.');
      setMessage(data.message || 'Your request was received.');
      form.reset();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'We could not send your request.');
    } finally {
      setBusy(false);
    }
  }

  if (message) {
    return <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm sm:p-8" aria-live="polite">
      <CheckCircle2 className="size-8 text-emerald-600"/>
      <h2 className="mt-3 text-2xl font-black text-emerald-950">Quote request received</h2>
      <p className="mt-2 max-w-3xl leading-7 text-emerald-900">{message}</p>
      <button type="button" onClick={() => setMessage('')} className="mt-4 text-sm font-extrabold text-emerald-800 underline">Send another request</button>
    </section>;
  }

  return <section className="overflow-hidden rounded-3xl border border-[#bed0df] bg-white shadow-[0_18px_55px_rgba(20,44,76,.10)]">
    <div className="bg-[#142c4c] px-6 py-5 text-white sm:px-8">
      <p className="text-xs font-black uppercase tracking-[.16em] text-[#f4a66b]">Tell us what you need</p>
      <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">Get free quotes from {tradeName.toLowerCase()} pros in {regionName}</h2>
      <p className="mt-2 text-sm leading-6 text-white/70">Your contact details are shared only with a featured business on this page, if one is available. Otherwise the request stays in our private admin queue.</p>
    </div>
    <form onSubmit={submit} className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
      <input type="hidden" name="region" value={region}/>
      <input type="hidden" name="trade" value={trade}/>
      <div className="hidden" aria-hidden="true"><Label htmlFor="companyWebsite">Company website</Label><Input id="companyWebsite" name="companyWebsite" tabIndex={-1} autoComplete="off"/></div>
      <div><Label htmlFor="quoteName">Name</Label><Input id="quoteName" name="name" required autoComplete="name" className="mt-2 h-11"/></div>
      <div><Label htmlFor="quoteEmail">Email</Label><Input id="quoteEmail" name="email" type="email" required autoComplete="email" className="mt-2 h-11"/></div>
      <div><Label htmlFor="quotePhone">Phone</Label><Input id="quotePhone" name="phone" type="tel" required autoComplete="tel" className="mt-2 h-11"/></div>
      <div><Label htmlFor="quoteZip">ZIP code</Label><Input id="quoteZip" name="zip" inputMode="numeric" required autoComplete="postal-code" maxLength={12} className="mt-2 h-11"/></div>
      <div className="sm:col-span-2"><Label htmlFor="quoteJob">What do you need help with?</Label><Textarea id="quoteJob" name="jobDescription" required maxLength={1500} className="mt-2 min-h-24" placeholder="A short description of the job"/></div>
      <div>
        <Label htmlFor="preferredContactMethod">Preferred contact</Label>
        <select id="preferredContactMethod" name="preferredContactMethod" defaultValue="either" className="mt-2 h-11 w-full rounded-md border border-input bg-transparent px-3 text-sm">
          <option value="either">Phone or email</option>
          <option value="phone">Phone</option>
          <option value="email">Email</option>
        </select>
      </div>
      <div className="flex items-end"><Button type="submit" disabled={busy} className="h-11 w-full bg-[#ec7d2c] text-white hover:bg-[#d96c20]">{busy ? <Loader2 className="size-4 animate-spin"/> : <Send className="size-4"/>}{busy ? 'Sending…' : 'Get free quotes'}</Button></div>
      {error ? <p role="alert" className="sm:col-span-2 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
      <p className="sm:col-span-2 text-xs leading-5 text-slate-500">By submitting, you agree that Who Knows a Pro and the page’s featured business, if any, may contact you about this request. No third-party lead networks receive it.</p>
    </form>
  </section>;
}
