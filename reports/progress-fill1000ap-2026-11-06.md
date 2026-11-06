# fill1000ap published checkpoint — 2026-11-06

## Baseline and validation

- Fixed run-start baseline commit: `5efb4d6366ccc9f50055bd26b7f1cdfd9c71d5ac`
- Baseline placements preserved: **14,318 / 14,318**
- Active cities read from the current catalog: **40**
- Visible categories read from the current catalog: **30**
- Public pages: **1,200**
- Hidden categories remain unchanged and receive no placements.
- No open pull request or competing GitHub write was found at run start.
- JSON/schema, active-city slugs, visible-category slugs, fixed-baseline preservation, qualification evidence and normalized-domain/name deduplication passed.
- ESLint, TypeScript and the production build passed.
- Official-source review passed **13/13** retrieved official pages.

## Published and live-verified additions

- Distinct new local businesses: **3**
- Placements from new businesses: **13**
- Placements from businesses already in the fixed baseline: **15**
- Total new city/category placements: **28**
- Exact shortfall against the 1,000-new-business run target: **997**

### New local businesses

1. Cordova Lock and Safe — residential locksmith coverage in Pensacola and the qualifying Escambia/Santa Rosa County cities.
2. Sure Locksmith — residential locksmith service from its Pace mobile office.
3. Lords Appliance Repair — residential household-appliance repair in Pensacola, Perdido Key, Gulf Breeze, Navarre, Pace and Milton.

No national brand, commercial maintenance network, directory, lead seller or contractor-matching intermediary was added.

## Page-level impact

| City/category | Before | Added | After | Remaining displayed deficit |
|---|---:|---:|---:|---:|
| Gulf Breeze / Appliance repair | 9 | 5 | 14 | 6 |
| Gulf Breeze / Locksmith | 6 | 2 | 8 | 12 |
| Milton / Appliance repair | 9 | 2 | 11 | 9 |
| Milton / Locksmith | 7 | 1 | 8 | 12 |
| Navarre / Appliance repair | 9 | 3 | 12 | 8 |
| Navarre / Locksmith | 7 | 2 | 9 | 11 |
| Pace / Appliance repair | 9 | 2 | 11 | 9 |
| Pace / Locksmith | 6 | 2 | 8 | 12 |
| Pensacola / Appliance repair | 9 | 4 | 13 | 7 |
| Pensacola / Locksmith | 6 | 2 | 8 | 12 |
| Perdido Key / Appliance repair | 9 | 2 | 11 | 9 |
| Perdido Key / Locksmith | 5 | 1 | 6 | 14 |

No page crosses 20 in this batch. The priority Destin/Fort Walton Beach/Crestview/Panama City searches returned only already-covered identities, unsupported candidates or national brands, so the run continued outward from Pensacola as instructed.

## Coverage after the published additions

These are displayed distinct-business counts, not a certification that every historical record has passed the current residential/category/geography standard.

- Pages displaying 20 or more: **174**
- Pages displaying fewer than 20: **1,026**
- Empty pages: **0**
- Displayed remaining deficit: **11,166**
- Fully qualification-audited page coverage: **unknown** pending the historical-record audit.

The complete post-batch displayed coverage and every remaining city/category deficit are recorded in `reports/coverage-fill1000ap-2026-11-06.csv`.

## Research dispositions and historical review

- Fully supported records: **9 provider identities** — **3 new** and **6 existing**.
- Withheld pending stronger evidence: **3** — J&K Better Pools, Deep Blue Key and Budget Appliance Repair.
- Duplicate excluded: **1** — Oceanside Service Co. was already present under its current domain; its former domain and rebrand were not counted as a new business or new placement.
- Retail Fix It / `retailfixit.com` remains excluded from current directory placements and verified-completion claims.
- No existing listing was deleted or hidden. No newly discovered historical listing was certified solely because it renders.

## Publication status

- Data commit on GitHub main: `53c2232eb86394a1761db9175a2d9221ca1f5918`.
- Production deployment: `dpl_CCaPcqJXrWLTiakQpPiJi13uWhAM` reached READY.
- Production browser verification: **28 / 28 placements passed** card, profile, city/category-context and intended official-domain checks.
- Distinct new businesses published and live-verified: **3**.
- New placements published and live-verified: **28** — **13** from new businesses and **15** from fixed-baseline businesses.
- The exact remaining run shortfall is **997 distinct new businesses**.

The live-verification ledger is `reports/live-fill1000ap-2026-11-06.json`. The overall directory target is not complete; the fully qualification-audited historical coverage remains unknown.
