# Who Knows a Pro fill1000bs published checkpoint — 2026-11-14

## Run identity and baseline

- Fixed run-start baseline: `96d380083a91efcd77ca88d5034f36d10f991c8b` (`main`).
- Baseline directory: 14,682 placements and 3,896 distinct profiles.
- Current catalog: 40 active cities, 28 publicly visible categories, 12 hidden categories and 1,120 public city/category pages.
- Grayton Beach is active; Pensacola Beach is not active. No city or category was created, renamed, activated or unhidden.
- No competing fill process was found at run start.

## Prepared changes

- Distinct new businesses: 1 — Sears Home Services.
- New-business placements: 4.
- Existing-business placements: 3 — Massey Services, Terminix and Orkin.
- All seven placements target underfilled public pages in Crestview, Destin, Fort Walton Beach or Panama City.
- Status: published, deployed and live-verified.
- Published `main` data commit: `ca73949944dc3d32e1ffb9a542ad5cf985c689a6`.
- Production deployment: `dpl_2uRYT8XNN2hVMrguU7mYasGZdY6r` (`READY`).
- Published and live-verified: 1 distinct new business, 4 new-business placements and 3 existing-business placements.
- Exact shortfall against the run target: 999 distinct new businesses.
- Changes awaiting deployment or live verification: 0.

## Page-level change

| City/category | Baseline displayed | Prepared displayed | Remaining displayed deficit |
|---|---:|---:|---:|
| Crestview / appliance repair | 9 | 10 live | 10 |
| Destin / appliance repair | 12 | 13 live | 7 |
| Fort Walton Beach / appliance repair | 11 | 12 live | 8 |
| Panama City / appliance repair | 13 | 14 live | 6 |
| Crestview / pest control | 18 | 20 live | 0 |
| Panama City / pest control | 15 | 16 live | 4 |

## Displayed coverage after prepared changes

- Public pages: 1,120.
- Pages displaying at least 20 distinct business identities: 211.
- Pages displaying fewer than 20: 909.
- Empty pages: 0.
- Remaining displayed deficit: 9,615 placements.
- Sitewide evidence-backed completion is **unknown**. Displayed counts are not represented as a fresh qualification audit of historical records.

## Qualification and validation

- Sears' official residential appliance-repair page and four exact official city pages establish direct home-appliance repair in Crestview, Destin, Fort Walton Beach and Panama City. Four placements remain one new identity.
- Massey's official Panama City page establishes direct residential pest control and explicit Panama City service.
- Terminix's official Niceville-area branch page establishes home pest control and explicitly lists Crestview.
- Orkin's official Pensacola service-area page establishes local home pest control and explicitly lists Crestview. The earlier branch-number page no longer displayed Crestview, so the record was switched to the current service-area URL before publication.
- Placement-scoped exceptions were added for excluded national-brand domains; the global exclusion list remains unchanged.
- Fixed-baseline preservation, catalog slugs, duplicate identity handling, qualification-policy checks, displayed coverage assertions, ESLint and the production build pass.
- Production browser verification confirmed the six affected pages display the expected counts, all seven placements render, and each directory website link matches the intended working official destination.

## Research and holds

- 27 candidates researched: 4 prepared, 2 pending and 21 rejected or resolved.
- Southern Home Appliance Services and Precision Auto Body of Crestview remain pending working official websites.
- Greenview Services and Prospect Well Drilling remain rejected because their purported official destinations failed live verification in the preceding run.
- Retail Fix It remains unsupported for residential locksmith or homeowner work and was neither restored nor counted.
- The historical WittCo Custom Pool and Spa Crestview placement remains flagged for unsupported geography. No historical record was deleted or hidden.

Durable details are in the run evidence ledger, source checks, research holds, live-verification record, validation JSON and coverage CSV.
