# Who Knows a Pro fill1000bq prepared checkpoint — 2026-11-13

## Run identity and baseline

- Fixed run-start baseline: `d4c0ac48f9d625cac2c51afd170c3bbcfafba049` (`main`)
- Baseline directory: 14,673 placements and 3,892 distinct profiles.
- Current catalog: 40 active cities, 28 publicly visible categories, 12 hidden categories and 1,120 public city/category pages.
- Grayton Beach is active; Pensacola Beach is not active. No city or category was created, renamed, activated or unhidden.
- No competing fill process was found at run start.

## Prepared changes

- Distinct new businesses: 3 — Paradise Outdoors, Prospect Well Drilling and P & D Enterprises.
- New-business placements: 5.
- Existing-business placements: 4 — Southland Pool & Lawn LLC (3) and Key Irrigation (1).
- Total placements: 9, all on public pages below 20 at the baseline.
- Status: prepared and validated locally; not yet published, deployed or live-verified.
- Exact shortfall against the run target pending live verification: 997 distinct new businesses.

## Page-level change

| City/category | Baseline | Prepared | Remaining displayed deficit |
|---|---:|---:|---:|
| Crestview / irrigation-sprinkler-repair | 13 | 14 | 6 |
| Destin / irrigation-sprinkler-repair | 17 | 20 | 0 |
| Fort Walton Beach / irrigation-sprinkler-repair | 16 | 20 | 0 |
| Panama City / irrigation-sprinkler-repair | 17 | 18 | 2 |

## Displayed coverage after prepared changes

- Public pages: 1,120.
- Pages displaying at least 20 distinct business identities: 211.
- Pages displaying fewer than 20: 909.
- Empty pages: 0.
- Remaining displayed deficit: 9,622 placements.
- Sitewide evidence-backed completion is **unknown**. These displayed counts are not represented as a fresh qualification audit of historical records.

## Qualification and validation

- Each prepared placement has official-site evidence for provider identity, direct service, residential customer scope, category match and explicit city coverage.
- Normalized name/domain checks separate the three new businesses from the two fixed-baseline identities.
- JSON parsing, active city slugs, visible category slugs, duplicate placement checks, fixed-baseline preservation, underfilled-page checks, qualification-policy validation, ESLint and the production build all pass.
- The live production domain and official-site destinations still require post-deployment verification before any prepared business is counted as completed.

## Research and holds

- 33 candidates researched: 5 prepared, 3 pending and 25 rejected or resolved to baseline identities.
- Pending: Wreck-A-Mended Collision Center and Beach View Irrigation lack verified working official company websites; Lawnworks does not yet have explicit repair-category evidence.
- Retail Fix It remains unsupported for residential locksmith or homeowner work; it has zero current public baseline placements and was neither restored nor counted.
- The historical WittCo Custom Pool and Spa Crestview placement remains flagged for unsupported geography. No historical record was deleted or hidden.

Durable details are in the run evidence ledger, source checks, research holds, validation JSON and coverage CSV. Publication and live-verification identifiers will be added after deployment.
