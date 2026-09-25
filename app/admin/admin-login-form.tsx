'use client';

import { FormEvent, useState } from 'react';
import { Loader2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function AdminLoginForm() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    setError('');
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))),
      });
      const data = await response.json() as { message?: string; error?: string };
      if (!response.ok) throw new Error(data.error || 'Could not send the sign-in link.');
      setMessage(data.message || 'Check your email for a secure sign-in link.');
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Could not send the sign-in link.');
    } finally { setBusy(false); }
  }
  return <form onSubmit={submit} className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-lg">
    <Mail className="size-7 text-[#d96c20]"/>
    <h1 className="mt-4 text-2xl font-black text-[#142c4c]">Admin sign in</h1>
    <p className="mt-2 text-sm leading-6 text-slate-600">A secure, single-use link will be sent only to the configured admin address.</p>
    <div className="hidden" aria-hidden="true"><Label htmlFor="adminCompany">Company</Label><Input id="adminCompany" name="company" tabIndex={-1} autoComplete="off"/></div>
    <Label htmlFor="adminEmail" className="mt-5 block">Admin email</Label>
    <Input id="adminEmail" name="email" type="email" required autoComplete="email" className="mt-2 h-12"/>
    {message ? <p role="status" className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">{message}</p> : null}
    {error ? <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
    <Button type="submit" disabled={busy} className="mt-5 h-12 w-full bg-[#142c4c] text-white hover:bg-[#203d62]">{busy ? <Loader2 className="size-4 animate-spin"/> : null}Email sign-in link</Button>
  </form>;
}
