# Who Knows a Pro fill1000br published checkpoint — 2026-11-14

## Run identity and baseline

- Fixed run-start baseline: `76325b998ed86a0fd9e694b76c832da69809ad2f` (`main`).
- Baseline directory: 14,680 placements and 3,894 distinct profiles.
- Current catalog: 40 active cities, 28 publicly visible categories, 12 hidden categories and 1,120 public city/category pages.
- Grayton Beach is active; Pensacola Beach is not active. No city or category was created, renamed, activated or unhidden.
- No competing fill process was found at run start.

## Prepared changes

- Distinct new businesses: 2 — Lee's Lawn Care Inc. and Goforth Lawn Care.
- New-business placements: 2.
- Existing-business placements: 0.
- All placements target the underfilled Crestview landscaping page.
- Status: published, deployed and live-verified.
- Published `main` data commit: `e50029620ed9a441de0b8d5873de704f6a01431c`.
- Production deployment: `dpl_DALMvfgH4R39uhkAqQabnmNd1NUv` (`READY`).
- Published and live-verified: 2 distinct new businesses, 2 new-business placements and 0 existing-business placements.
- Exact shortfall against the run target: 998 distinct new businesses.
- Changes awaiting deployment or live verification: 0.

## Page-level change

| City/category | Baseline | Prepared | Remaining displayed deficit |
|---|---:|---:|---:|
| Crestview / landscaping | 18 | 20 live | 0 |

## Displayed coverage after prepared changes

- Public pages: 1,120.
- Pages displaying at least 20 distinct business identities: 210.
- Pages displaying fewer than 20: 910.
- Empty pages: 0.
- Remaining displayed deficit: 9,622 placements.
- Sitewide evidence-backed completion is **unknown**. These displayed counts are not represented as a fresh qualification audit of historical records.

## Qualification and validation

- Both published providers have official-site evidence for direct provider identity, residential yard or homeowner scope, landscaping category match and explicit Crestview service.
- Both normalized identities and domains are absent from the fixed baseline.
- JSON parsing, active city slugs, visible category slugs, duplicate placement checks, fixed-baseline preservation, underfilled-page checks, qualification-policy validation, ESLint and the production build all pass.
- Production browser verification confirmed the Crestview landscaping page displays 20 businesses, both retained listings render, and both official destinations show the intended business with the supporting residential landscaping and Crestview content.

## Research and holds

- 32 candidates researched: 2 prepared, 2 pending and 28 rejected or resolved to fixed-baseline identities.
- Greenview Services was removed after its purported official domain redirected to a registrar and hosting sales page during production verification.
- Williams Landscaping & Outdoor and Perfectionists Lawn & Landscape remain pending official-site verification.
- Prospect Well Drilling remains disqualified after the preceding production browser failure.
- Retail Fix It remains unsupported for residential locksmith or homeowner work and was neither restored nor counted.
- The historical WittCo Custom Pool and Spa Crestview placement remains flagged for unsupported geography. No historical record was deleted or hidden.

Durable details are in the run evidence ledger, source checks, research holds, validation JSON and coverage CSV. Publication and live-verification identifiers will be added after deployment.
