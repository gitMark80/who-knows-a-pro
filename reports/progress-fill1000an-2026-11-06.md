# fill1000an live checkpoint — 2026-11-06

## Publication

- Fixed baseline commit: `9d13b0c9e2ff0926a05f6194071a8dcc57bc5b31`
- Data commit: `aed2fa243fe71c2298c1136b057d0c1b59b2374f`
- Production deployment: `dpl_GJTkiDhoaRfncheFAMQQzanD2i8g` (`READY`)
- Live verification: **9/9** placements passed public page-card, contextual-profile and intended official-domain link checks.
- Source verification: **6/6** supporting official-site URLs passed HTTP and final-destination checks.
- Validation: JSON, schema, active city slugs, visible-category slugs, duplicate identity/domain handling, fixed-baseline preservation, lint, type checking and production build all passed.

## Completed additions

- Distinct new businesses published and live-verified: **3**
- New placements from those new businesses: **9**
- New placements from businesses already in the baseline: **0**
- New-business shortfall against this checkpoint's 1,000 target: **997**

### New local businesses

1. Wittenburg Handyman Service — Panama City Beach kitchen/bath remodeling and screen enclosures.
2. NAILED IT! Handyman Services of Panama City — Panama City Beach landscaping and fence building.
3. My Bay Services — Panama City and Panama City Beach irrigation repair; Panama City Beach landscaping, kitchen/bath remodeling and fence building.

All three were absent from the fixed run-start baseline by normalized identity and domain. All are locally operated direct providers; no national brand was added.

## Page-level impact

| City/category | Before | Added | After | Remaining displayed deficit |
|---|---:|---:|---:|---:|
| Panama City / Irrigation & Sprinkler Repair | 16 | 1 | 17 | 3 |
| Panama City Beach / Fence Builders | 14 | 2 | 16 | 4 |
| Panama City Beach / Irrigation & Sprinkler Repair | 9 | 1 | 10 | 10 |
| Panama City Beach / Kitchen & Bath Remodeling | 18 | 2 | 20 | 0 |
| Panama City Beach / Landscaping | 11 | 2 | 13 | 7 |
| Panama City Beach / Screen Enclosures & Pool Cages | 19 | 1 | 20 | 0 |

Two additional pages reached the displayed 20-business threshold: Panama City Beach kitchen/bath remodeling and screen enclosures/pool cages.

## Coverage after publication

These are **displayed distinct-business counts**, not a certification that every historical listing has passed the current residential/category/geography evidence standard.

- Active cities: **40**
- Visible categories: **30**
- Public city/category pages: **1,200**
- Pages displaying 20 or more distinct businesses: **174**
- Pages displaying fewer than 20: **1,026**
- Empty public pages: **0**
- Displayed remaining deficit: **11,208**
- Freshly evidence-backed additions in this checkpoint: **9 placements**
- Full qualification-audited page counts: **unknown** until historical rows are audited; unsupported or unaudited historical rows are not treated as verified-completion evidence.

## Research dispositions and blockers

- Ten non-baseline candidate identities reached a disposition in this checkpoint: **3 published**, **5 supported but withheld because their only relevant categories are currently hidden**, and **2 pending**.
- Home Fix-It Crew was withheld because the website renders but the matching Florida entity appears inactive or administratively dissolved.
- The Honey Do Service of Panama City was held pending a clearer determination that the shared multi-state brand fits the local/regional-only policy.
- The catalog validator rejected hidden categories before publication; no handyman, movers, lawn care, junk removal or pressure-washing placement was committed.
- Retail Fix It / `retailfixit.com` has zero current directory placements and remains on the exclusion list. It was not counted, restored or deleted in this checkpoint.
- Existing national-brand and historical records were not deleted because the current task says to ask before deletion. No new national brand was added.

## Resume point

Start from GitHub `main` after data commit `aed2fa243fe71c2298c1136b057d0c1b59b2374f`, rebuild a fresh baseline, and recheck for concurrent work before editing. Continue the lowest qualifying visible-page counts in Destin, Fort Walton Beach, Crestview and Panama City, then expand outward. Keep hidden categories untouched and keep displayed coverage separate from fully qualification-audited coverage.
