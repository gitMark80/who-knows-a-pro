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

export function brandedEmail(subject: string, html: string) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(subject)}</title></head><body style="margin:0;background:#f4f7fa;color:#172b49;font-family:Arial,sans-serif"><div style="max-width:600px;margin:24px auto;background:#ffffff;border-radius:12px;overflow:hidden"><div style="padding:24px;background:#172b49;color:#ffffff;font-size:23px;font-weight:bold">WHO KNOWS A PRO<span style="color:#ec7d2c">?</span></div><div style="padding:28px;line-height:1.6">${html}</div><div style="padding:20px 28px;border-top:1px solid #dce4e9;color:#526277;font-size:13px"><p>Who Knows a Pro — a local business directory operated by Restless Faith Media LLC.</p><p>Questions? <a href="mailto:hello@whoknowsapro.com">hello@whoknowsapro.com</a> · <a href="https://whoknowsapro.com">whoknowsapro.com</a></p></div></div></body></html>`;
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
    body: JSON.stringify({
      from: from.includes('<') ? from : `Who Knows a Pro <${from}>`,
      to,
      reply_to: 'hello@whoknowsapro.com',
      subject: subject.includes('Who Knows a Pro') ? subject : `Who Knows a Pro — ${subject}`,
      html: brandedEmail(subject, html),
    }),
  });
  if (!response.ok) {
    const requestId = response.headers.get('x-request-id');
    throw new Error(`Email delivery failed (${response.status}${requestId ? `, request ${requestId}` : ''})`);
  }
}
