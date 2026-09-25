import fs from 'node:fs/promises';
import { directorySeed } from '../data/directory.ts';

const USER_AGENT = 'WhoKnowsAProDirectoryAudit/1.0 (+https://whoknowsapro.com/)';
const MAX_CONTENT_PAGES_PER_SITE = 5;
const MIN_REQUEST_INTERVAL_MS = 1_050;
const REQUEST_TIMEOUT_MS = 15_000;
const CONCURRENCY = Number.parseInt(process.env.EMAIL_AUDIT_CONCURRENCY || '20', 10);
const today = new Date().toISOString().slice(0, 10);

const auditPath = 'data/business-email-audit.json';
const evidencePath = 'data/business-email-evidence.json';

const freeEmailDomains = new Set([
  'aol.com', 'gmail.com', 'googlemail.com', 'hotmail.com', 'icloud.com',
  'live.com', 'outlook.com', 'proton.me', 'protonmail.com', 'yahoo.com',
]);
const excludedEmailDomains = new Set([
  'example.com', 'sentry.io', 'wix.com', 'squarespace.com', 'shopify.com',
  'godaddy.com', 'cloudflare.com', 'wordpress.com', 'webflow.io', 'mailservice.com',
  'mysite.com', 'sunlightfinancial.com',
]);
const excludedMailbox = /^(?:abuse|billing|compliance|copyright|dmca|do-?not-?reply|donotreply|jobs?|legal|mymail|noreply|privacy|security|spam|webmaster)$/i;
const contactHint = /(?:about|company|connect|contact|customer[-_ ]?service|get[-_ ]?in[-_ ]?touch|help|location|office|our[-_ ]?team|staff|support|team)/i;
const designerContext = /(?:built|created|designed|developed|hosted|marketing|powered|site|website)\s+(?:by|with)|(?:web|website)\s+(?:design|development|hosting)/i;

const profiles = new Map();
for (const business of directorySeed) {
  const current = profiles.get(business.mainSlug);
  if (!current) {
    profiles.set(business.mainSlug, {
      mainSlug: business.mainSlug,
      businessName: business.name,
      website: business.website,
    });
  }
}

function normalizedHost(value) {
  return value.toLowerCase().replace(/^www\./, '');
}

function normalizedPageUrl(value) {
  try {
    const url = new URL(value);
    url.hash = '';
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    url.hostname = url.hostname.toLowerCase();
    if ((url.protocol === 'https:' && url.port === '443') || (url.protocol === 'http:' && url.port === '80')) url.port = '';
    url.pathname = url.pathname.replace(/\/{2,}/g, '/');
    return url.href;
  } catch {
    return null;
  }
}

function rootUrl(value) {
  const url = new URL(value);
  return `${url.protocol}//${url.host}/`;
}

function decodeHtml(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&#38;', '&')
    .replaceAll('&commat;', '@')
    .replaceAll('&#64;', '@')
    .replaceAll('&#x40;', '@')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(Number.parseInt(code, 16)));
}

function visibleText(html) {
  return decodeHtml(html)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<!--([\s\S]*?)-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanEmail(raw) {
  if (!raw) return null;
  let decodedEmail = raw;
  try { decodedEmail = decodeURIComponent(raw); } catch {}
  const email = decodedEmail.trim().replace(/^mailto:/i, '').replace(/[),.;:]+$/, '').toLowerCase();
  if (!/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i.test(email)) return null;
  const split = email.lastIndexOf('@');
  const mailbox = email.slice(0, split);
  const emailDomain = normalizedHost(email.slice(split + 1));
  if (excludedMailbox.test(mailbox) || excludedEmailDomains.has(emailDomain)) return null;
  return email;
}

function nameNeedle(name) {
  return name
    .toLowerCase()
    .replace(/&amp;|&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\b(?:and|company|co|corp|corporation|inc|llc|ltd|services?|the)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function pageMentionsBusiness(text, name) {
  const needle = nameNeedle(name);
  if (!needle) return false;
  const haystack = text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ');
  if (haystack.includes(needle)) return true;
  const meaningful = needle.split(' ').filter((word) => word.length >= 4);
  return meaningful.length > 0 && meaningful.every((word) => haystack.includes(word));
}

function parseRobots(text, agent = '*') {
  const groups = [];
  let current = null;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/\s*#.*$/, '').trim();
    if (!line) continue;
    const match = line.match(/^([^:]+):\s*(.*)$/);
    if (!match) continue;
    const key = match[1].trim().toLowerCase();
    const value = match[2].trim();
    if (key === 'user-agent') {
      if (!current || current.hasRules) {
        current = { agents: [], rules: [], crawlDelay: 0, hasRules: false };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
    } else if (current && (key === 'allow' || key === 'disallow')) {
      current.hasRules = true;
      if (value) current.rules.push({ allow: key === 'allow', path: value });
    } else if (current && key === 'crawl-delay') {
      current.hasRules = true;
      const seconds = Number.parseFloat(value);
      if (Number.isFinite(seconds) && seconds > 0) current.crawlDelay = seconds * 1_000;
    }
  }
  const lowerAgent = agent.toLowerCase();
  const exact = groups.filter((group) => group.agents.some((value) => value !== '*' && lowerAgent.includes(value)));
  const selected = exact.length ? exact : groups.filter((group) => group.agents.includes('*'));
  return {
    rules: selected.flatMap((group) => group.rules),
    crawlDelay: Math.max(0, ...selected.map((group) => group.crawlDelay)),
  };
}

function robotsAllows(url, policy) {
  const target = `${url.pathname}${url.search}`;
  const matches = policy.rules
    .filter((rule) => target.startsWith(rule.path.replace(/\*.*$/, '')))
    .sort((a, b) => b.path.length - a.path.length);
  return matches.length === 0 || matches[0].allow;
}

function extractLinks(html, baseUrl, allowedHost) {
  const links = [];
  const anchorPattern = /<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  for (const match of html.matchAll(anchorPattern)) {
    let url;
    try { url = new URL(decodeHtml(match[1]), baseUrl); } catch { continue; }
    if (!['http:', 'https:'].includes(url.protocol) || normalizedHost(url.hostname) !== allowedHost) continue;
    const label = visibleText(match[2]);
    if (!contactHint.test(`${url.pathname} ${label}`)) continue;
    url.hash = '';
    links.push(url.href);
  }
  return [...new Set(links)];
}

function extractEmailCandidates(html, pageUrl, siteHost) {
  const decoded = decodeHtml(html);
  const text = visibleText(html);
  const candidates = new Map();
  const mailtoPattern = /href\s*=\s*["']mailto:([^?"'#\s>]+)[^"']*["']/gi;
  for (const match of decoded.matchAll(mailtoPattern)) addCandidate(match[1], true, match.index ?? 0);
  const textPattern = /[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+/gi;
  for (const match of text.matchAll(textPattern)) addCandidate(match[0], false, match.index ?? 0, text);

  function addCandidate(raw, mailto, index, contextText = decoded) {
    const email = cleanEmail(raw);
    if (!email) return;
    const split = email.lastIndexOf('@');
    if (split <= 0) return;
    const mailbox = email.slice(0, split);
    const emailDomain = normalizedHost(email.slice(split + 1));
    if (!emailDomain.includes('.') || excludedMailbox.test(mailbox) || excludedEmailDomains.has(emailDomain)) return;
    const context = contextText.slice(Math.max(0, index - 180), index + email.length + 180);
    if (designerContext.test(context)) return;
    const sameDomain = emailDomain === siteHost || emailDomain.endsWith(`.${siteHost}`) || siteHost.endsWith(`.${emailDomain}`);
    const isFree = freeEmailDomains.has(emailDomain);
    const contactPage = contactHint.test(new URL(pageUrl).pathname);
    if (!sameDomain && !mailto && !contactPage) return;
    if (isFree && !mailto && !contactPage) return;
    const score = (sameDomain ? 100 : 0) + (mailto ? 30 : 0) + (contactPage ? 15 : 0) + (/^(?:contact|hello|info|office|sales|service|support)@/i.test(email) ? 10 : 0);
    const existing = candidates.get(email);
    if (!existing || existing.score < score) candidates.set(email, { email, score });
  }

  return { candidates: [...candidates.values()].sort((a, b) => b.score - a.score), text };
}

async function request(url, state, acceptHtml = true) {
  const interval = Math.max(MIN_REQUEST_INTERVAL_MS, state.crawlDelay || 0);
  const waitFor = state.lastRequestAt + interval - Date.now();
  if (waitFor > 0) await new Promise((resolve) => setTimeout(resolve, waitFor));
  state.lastRequestAt = Date.now();
  const response = await fetch(url, {
    redirect: 'follow',
    headers: { 'user-agent': USER_AGENT, accept: acceptHtml ? 'text/html,application/xhtml+xml' : 'text/plain' },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  if (acceptHtml && !/(?:text\/html|application\/xhtml\+xml)/i.test(response.headers.get('content-type') || '')) {
    throw new Error('Not HTML');
  }
  const contentLength = Number.parseInt(response.headers.get('content-length') || '0', 10);
  if (contentLength > 2_500_000) throw new Error('Page too large');
  const body = (await response.text()).slice(0, 2_500_000);
  return { body, finalUrl: response.url };
}

async function auditHost(host, hostProfiles) {
  const state = { lastRequestAt: 0, crawlDelay: 0 };
  const first = normalizedPageUrl(hostProfiles[0].website);
  if (!first) return hostProfiles.map((profile) => failed(profile, 'invalid_website'));
  const siteRoot = rootUrl(first);
  let policy = { rules: [], crawlDelay: 0 };
  try {
    const robots = await request(new URL('/robots.txt', siteRoot).href, state, false);
    policy = parseRobots(robots.body, 'WhoKnowsAProDirectoryAudit');
    state.crawlDelay = policy.crawlDelay;
  } catch {}
  // A very large Crawl-delay can make even a two-page audit take many minutes.
  // Skip content rather than violating the site's stated preference.
  if (state.crawlDelay > 30_000) {
    return hostProfiles.map((profile) => ({
      ...profile,
      checkedAt: today,
      pagesChecked: [`${siteRoot}robots.txt`],
      status: 'robots_crawl_delay',
      email: null,
      emailSourceUrl: null,
    }));
  }

  const queue = [];
  const queued = new Set();
  const enqueue = (value) => {
    const normalized = normalizedPageUrl(value);
    if (!normalized || queued.has(normalized)) return;
    const parsed = new URL(normalized);
    if (normalizedHost(parsed.hostname) !== host || !robotsAllows(parsed, policy)) return;
    queued.add(normalized);
    queue.push(normalized);
  };
  enqueue(siteRoot);
  for (const profile of hostProfiles) enqueue(profile.website);

  const pages = [];
  while (queue.length && pages.length < MAX_CONTENT_PAGES_PER_SITE) {
    const requestedUrl = queue.shift();
    try {
      const page = await request(requestedUrl, state, true);
      const final = new URL(page.finalUrl);
      if (normalizedHost(final.hostname) !== host) continue;
      const extracted = extractEmailCandidates(page.body, page.finalUrl, host);
      pages.push({ requestedUrl, url: page.finalUrl, ...extracted });
      for (const link of extractLinks(page.body, page.finalUrl, host)) enqueue(link);
    } catch (error) {
      pages.push({ requestedUrl, url: requestedUrl, candidates: [], text: '', error: error instanceof Error ? error.message : String(error) });
    }
  }

  return hostProfiles.map((profile) => {
    const start = normalizedPageUrl(profile.website);
    const isSharedHost = hostProfiles.length > 1;
    const eligiblePages = pages.filter((page) => {
      if (!isSharedHost) return true;
      if (start && (normalizedPageUrl(page.requestedUrl) === start || normalizedPageUrl(page.url) === start)) return true;
      return pageMentionsBusiness(page.text, profile.businessName);
    });
    const choice = eligiblePages
      .flatMap((page) => page.candidates.map((candidate) => ({ ...candidate, sourceUrl: page.url })))
      .sort((a, b) => b.score - a.score)[0];
    return {
      mainSlug: profile.mainSlug,
      businessName: profile.businessName,
      website: profile.website,
      checkedAt: today,
      pagesChecked: pages.map((page) => page.url),
      status: choice ? 'email_found' : pages.some((page) => page.text) ? 'checked_no_email' : 'site_unreachable',
      email: choice?.email ?? null,
      emailSourceUrl: choice?.sourceUrl ?? null,
    };
  });
}

function failed(profile, status) {
  return { ...profile, checkedAt: today, pagesChecked: [], status, email: null, emailSourceUrl: null };
}

async function writeResults(results) {
  const ordered = [...results.values()].sort((a, b) => a.mainSlug.localeCompare(b.mainSlug));
  const evidence = ordered
    .filter((row) => row.email && row.emailSourceUrl)
    .map((row) => ({
      mainSlug: row.mainSlug,
      email: row.email,
      sourceUrl: row.emailSourceUrl,
      verifiedAt: row.checkedAt,
    }));
  await fs.writeFile(auditPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), records: ordered }, null, 2)}\n`);
  await fs.writeFile(evidencePath, `${JSON.stringify({ verifiedAt: today, records: evidence }, null, 2)}\n`);
}

const existing = new Map();
try {
  const parsed = JSON.parse(await fs.readFile(auditPath, 'utf8'));
  for (const record of parsed.records || []) {
    if (record.checkedAt !== today) continue;
    const email = cleanEmail(record.email);
    existing.set(record.mainSlug, {
      ...record,
      email,
      emailSourceUrl: email ? record.emailSourceUrl : null,
      status: record.status === 'email_found' && !email ? 'checked_no_email' : record.status,
    });
  }
} catch {}

const hosts = new Map();
for (const profile of profiles.values()) {
  if (existing.has(profile.mainSlug)) continue;
  try {
    const host = normalizedHost(new URL(profile.website).hostname);
    const list = hosts.get(host) || [];
    list.push(profile);
    hosts.set(host, list);
  } catch {
    existing.set(profile.mainSlug, failed(profile, 'invalid_website'));
  }
}

const queue = [...hosts.entries()];
let completedHosts = 0;
let writeChain = Promise.resolve();
async function worker() {
  while (queue.length) {
    const [host, hostProfiles] = queue.shift();
    let results;
    try { results = await auditHost(host, hostProfiles); }
    catch { results = hostProfiles.map((profile) => failed(profile, 'site_unreachable')); }
    for (const result of results) existing.set(result.mainSlug, result);
    completedHosts += 1;
    if (completedHosts % 20 === 0 || queue.length === 0) {
      writeChain = writeChain.then(() => writeResults(existing));
      await writeChain;
      const found = [...existing.values()].filter((row) => row.email).length;
      console.log(JSON.stringify({ completedHosts, remainingHosts: queue.length, profilesChecked: existing.size, emailsFound: found }));
    }
  }
}

await Promise.all(Array.from({ length: Math.min(CONCURRENCY, queue.length || 1) }, () => worker()));
await writeChain;
await writeResults(existing);
const records = [...existing.values()];
console.log(JSON.stringify({
  profiles: profiles.size,
  profilesChecked: records.length,
  emailsFound: records.filter((row) => row.email).length,
  statusCounts: Object.fromEntries([...new Set(records.map((row) => row.status))].sort().map((status) => [status, records.filter((row) => row.status === status).length])),
}, null, 2));
