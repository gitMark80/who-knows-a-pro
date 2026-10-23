/** Mailbox providers anyone can sign up for. These never prove control of a business. */
export const freeEmailDomains = new Set([
  'gmail.com', 'googlemail.com', 'yahoo.com', 'ymail.com', 'rocketmail.com', 'outlook.com', 'hotmail.com', 'live.com',
  'msn.com', 'icloud.com', 'me.com', 'mac.com', 'aol.com', 'proton.me', 'protonmail.com', 'pm.me', 'gmx.com', 'gmx.net',
  'mail.com', 'zoho.com', 'zohomail.com', 'yandex.com', 'yandex.ru', 'tutanota.com', 'tuta.io', 'fastmail.com', 'hey.com',
  'comcast.net', 'att.net', 'sbcglobal.net', 'bellsouth.net', 'cox.net', 'verizon.net', 'charter.net', 'spectrum.net',
  'earthlink.net', 'mediacombb.net', 'windstream.net', 'centurylink.net', 'frontier.com', 'juno.com', 'netzero.net',
]);

/**
 * Hosts where many unrelated businesses share one domain (site builders, social pages, marketplaces).
 * A website on one of these can never be used for automatic domain-based ownership verification
 * or duplicate matching.
 */
const sharedHostSuffixes = [
  'wixsite.com', 'wix.com', 'square.site', 'squareup.com', 'squarespace.com', 'godaddysites.com', 'weebly.com', 'wordpress.com',
  'blogspot.com', 'business.site', 'sites.google.com', 'google.com', 'github.io', 'vercel.app', 'netlify.app', 'pages.dev',
  'webflow.io', 'carrd.co', 'yolasite.com', 'myshopify.com', 'ueniweb.com', 'site123.me', 'jimdosite.com', 'strikingly.com',
  'mystrikingly.com', 'facebook.com', 'fb.com', 'instagram.com', 'linkedin.com', 'yelp.com', 'nextdoor.com', 'angi.com',
  'angieslist.com', 'homeadvisor.com', 'thumbtack.com', 'houzz.com', 'bbb.org', 'linktr.ee', 'square.com', 'booksy.com',
];

export const normalizeDomain = (value: string) => value.trim().toLowerCase().replace(/^www\./, '').replace(/\.$/, '');

export function websiteDomain(value: string | null | undefined) {
  if (!value) return '';
  try {
    const parsed = new URL(value);
    return ['http:', 'https:'].includes(parsed.protocol) ? normalizeDomain(parsed.hostname) : '';
  } catch {
    return '';
  }
}

export function isSharedHost(domain: string) {
  const normalized = normalizeDomain(domain);
  return sharedHostSuffixes.some((suffix) => normalized === suffix || normalized.endsWith(`.${suffix}`));
}

/**
 * True when an email address is on the business's own website domain (or a mail subdomain of it).
 * Website subdomains of the email domain (shop.example.com vs @example.com) also qualify,
 * except on shared hosts where the parent domain belongs to a platform, not the business.
 */
export function emailMatchesWebsite(email: string, website: string | null | undefined) {
  const site = websiteDomain(website);
  const emailDomain = normalizeDomain(email.split('@')[1] || '');
  if (!site || !emailDomain || freeEmailDomains.has(emailDomain) || isSharedHost(site) || isSharedHost(emailDomain)) return false;
  return emailDomain === site || emailDomain.endsWith(`.${site}`) || site.endsWith(`.${emailDomain}`);
}
