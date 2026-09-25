import { config } from '@/db/runtime';

export function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  })[character] || character);
}

export function emailConfigured() {
  return Boolean(config('RESEND_API_KEY') && config('CLAIM_EMAIL_FROM'));
}

export async function sendEmail(to: string, subject: string, html: string) {
  const key = config('RESEND_API_KEY');
  const from = config('CLAIM_EMAIL_FROM');
  if (!key || !from) throw new Error('Email delivery is not configured');
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${key}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ from, to, subject, html }),
  });
  if (!response.ok) {
    const requestId = response.headers.get('x-request-id');
    throw new Error(`Email delivery failed (${response.status}${requestId ? `, request ${requestId}` : ''})`);
  }
}
