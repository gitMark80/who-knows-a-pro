# Who Knows a Pro fill1000bq published checkpoint — 2026-11-13

## Run identity and baseline

- Fixed run-start baseline: `d4c0ac48f9d625cac2c51afd170c3bbcfafba049` (`main`)
- Baseline directory: 14,673 placements and 3,892 distinct profiles.
- Current catalog: 40 active cities, 28 publicly visible categories, 12 hidden categories and 1,120 public city/category pages.
- Grayton Beach is active; Pensacola Beach is not active. No city or category was created, renamed, activated or unhidden.
- No competing fill process was found at run start.

## Prepared changes

- Distinct new businesses: 2 — Paradise Outdoors and P & D Enterprises.
- New-business placements: 3.
- Existing-business placements: 4 — Southland Pool & Lawn LLC (3) and Key Irrigation (1).
- Total placements: 7, all on public pages below 20 at the baseline.
- Status: published, deployed and live-verified.
- Published `main` data commit: `360840c7cc7bf9e4c37d2078f854006d15c0b659`.
- Production deployment: `dpl_AZXPiNRy7tfVy2Pua2dQxb33GKR7` (`READY`).
- Published and live-verified: 2 distinct new businesses, 3 new-business placements and 4 existing-business placements.
- Exact shortfall against the run target: 998 distinct new businesses.
- Changes awaiting deployment or live verification: 0.

## Page-level change

| City/category | Baseline | Live | Remaining displayed deficit |
|---|---:|---:|---:|
| Crestview / irrigation-sprinkler-repair | 13 | 14 | 6 |
| Destin / irrigation-sprinkler-repair | 17 | 19 | 1 |
| Fort Walton Beach / irrigation-sprinkler-repair | 16 | 19 | 1 |
| Panama City / irrigation-sprinkler-repair | 17 | 18 | 2 |

## Displayed coverage after prepared changes

- Public pages: 1,120.
- Pages displaying at least 20 distinct business identities: 209.
- Pages displaying fewer than 20: 911.
- Empty pages: 0.
- Remaining displayed deficit: 9,624 placements.
- Sitewide evidence-backed completion is **unknown**. These displayed counts are not represented as a fresh qualification audit of historical records.

## Qualification and validation

- Each published placement has official-site evidence for provider identity, direct service, residential customer scope, category match and explicit city coverage.
- Normalized name/domain checks separate the three new businesses from the two fixed-baseline identities.
- JSON parsing, active city slugs, visible category slugs, duplicate placement checks, fixed-baseline preservation, underfilled-page checks, qualification-policy validation, ESLint and the production build all pass.
- Production browser verification confirmed all seven retained placements and their page counts. The four official destinations resolved to the intended businesses and displayed the supporting residential irrigation and geographic content.

## Research and holds

- 33 candidates researched: 4 prepared, 3 pending and 26 rejected or resolved to baseline identities.
- Pending: Wreck-A-Mended Collision Center and Beach View Irrigation lack verified working official company websites; Lawnworks does not yet have explicit repair-category evidence.
- Prospect Well Drilling was removed after its official destination failed production browser verification with `net::ERR_HTTP2_PROTOCOL_ERROR`; its two temporary placements are excluded from completed counts.
- Retail Fix It remains unsupported for residential locksmith or homeowner work; it has zero current public baseline placements and was neither restored nor counted.
- The historical WittCo Custom Pool and Spa Crestview placement remains flagged for unsupported geography. No historical record was deleted or hidden.

Durable details are in the run evidence ledger, source checks, research holds, validation JSON and coverage CSV. Publication and live-verification identifiers will be added after deployment.
