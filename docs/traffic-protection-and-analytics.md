# Traffic protection, conversion tracking, and indexing

## What protects the public forms

| Layer | Claim form (`/api/claim`) | Quote form (`/api/leads`) |
| --- | --- | --- |
| Same-origin check (blocks cross-site posts and most scripts) | Yes | Yes |
| Honeypot field (silent fake success) | `companyFax` | `companyWebsite` |
| Minimum fill time (silent fake success under 2.5 s) | Yes | Yes |
| Per-connection limits | 5/hour, 15/day | `LEAD_RATE_LIMIT_PER_HOUR` (default 5) |
| Per-recipient / per-listing limits | 4 emails/day per address, 8/day per listing | 6/day per email |
| Cloudflare Turnstile (server-verified, fails closed) | When `TURNSTILE_SECRET_KEY` is set | Same |
| Admin notification cap | 25 review emails/day (queue still records all) | — |

Other endpoints: verification links are scanner-safe (GET shows a confirm page, POST consumes the
single-use token), admin sign-in is rate limited, owner endpoints (profile save, upload, checkout,
billing portal) require same-origin requests, and profile-view counting ignores self-identified bots.
The Stripe webhook is untouched by these checks; it is protected by its signature.

Rate-limit rows store salted hashes only (`rate_limits` table), never raw IPs or emails.

## Claim rules

- A domain-matched business email verifies instantly. Free mailboxes (Gmail, Yahoo, ISP mail) and
  websites on shared hosts (Wix, Squarespace, Facebook pages, etc.) always go to manual review.
- A claim for a listing on an existing website domain attaches to that listing instead of creating a duplicate.
- A listing that already has a verified owner cannot be taken over by domain verification; other
  claimants go to manual review, and approving one transfers ownership and signs the old owner out.
- The verified owner can request a new sign-in link at any time from `/claim` with the same email.

## Featured slot lifecycle (Stripe webhook)

- `active`/`trialing`: slot active (also restored after a payment problem is fixed).
- `past_due`/`unpaid`/`paused`/`incomplete`: slot held but hidden, no leads routed, not sellable to others.
- `canceled`/`incomplete_expired`: slot released.
- A business with any of those live or recoverable statuses cannot start a second checkout; it is sent to Manage billing.

## Conversion dashboard

`/admin/funnel` (admin sign-in required). Events are stored in `analytics_events` without names,
emails, phone numbers, or IP addresses.

| Event | Recorded when |
| --- | --- |
| `pricing_viewed`, `claim_page_viewed`, `claim_started` | Browser beacon after the page loads (bots by user agent skipped; automated browsers flagged) |
| `business_profile_viewed` | Profile view counted (deduplicated per visitor per hour) |
| `claim_submitted` | Server accepted a claim (detail: auto-verify, manual-review, owner-sign-in, …) |
| `claim_verified` | Owner confirmed the email link and the listing was assigned |
| `quote_submitted` | Quote request saved |
| `checkout_initiated` | Stripe Checkout session created |
| `subscription_activated`, `subscription_cancel_scheduled`, `subscription_canceled` | Verified Stripe webhook, on state changes only |
| `form_blocked` | Honeypot, too-fast, rate-limited, or failed Turnstile submission |

Attribution: `utm_source`/`utm_medium`/`utm_campaign` (or the external referrer host) are kept in a
30-day first-party cookie, copied to Stripe Checkout metadata, and reported by source.

## Indexing rules

- City/category pages are indexed and in the sitemap only with at least `MIN_INDEXABLE_LISTINGS` (3) businesses.
- City pages are in the sitemap only when they have listings.
- Business profiles are indexed and in the sitemap only when they contain owner-supplied detail
  (description, phone, address, service area, hours, specialties, year, license, logo, or photos).
  Name-and-website-only profiles are `noindex, follow`.
- `robots.txt` blocks `/claim?…` and `/pricing?…` call-to-action variants, `/api/`, `/admin`, `/dashboard`, `/reel`.

## Vercel checklist when traffic looks wrong

1. **Observability → Logs / Query**: filter `POST /api/claim`. Thousands of `/claim` page views with
   few or no POSTs means page-view-only bots (harmless to data, misleading in analytics).
2. **Firewall → Traffic**: check the top user agents, ASNs, and JA4 fingerprints for `/claim` and `/pricing`.
3. **Firewall → Bot Management**: keep Bot Protection on (log first, then challenge) — it exempts
   verified search crawlers. Do not enable Attack Challenge Mode site-wide unless under attack.
4. If one ASN or fingerprint dominates, add a custom rule scoped to `/claim` and `/pricing` that
   **challenges** (not denies) it. Never challenge `/api/stripe/webhook`.
5. Compare with `/admin/funnel`: claim page views by country, form starts, and blocked submissions.
