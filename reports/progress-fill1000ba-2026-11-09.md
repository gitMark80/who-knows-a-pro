# Who Knows a Pro fill1000ba published checkpoint — 2026-11-09

## Run baseline and scope

- Fixed run-start baseline: `0321fe5c75ca37fecae7e1d267d701e56e6d265e` (`main`)
- Baseline placements preserved: 14,501
- Current catalogs: 40 active cities, 28 publicly visible categories, 12 hidden categories
- Public page matrix: 1,120 city/category combinations
- Grayton Beach is present; Pensacola Beach is not an active-city substitute.
- Towing and Locksmith remain hidden with the other hidden categories; no category or city was created, activated, renamed, unhidden or deleted.
- A concurrent `main` change (`4b10e861482a98214e8d6d8ad992d432c2198870`) was reconciled before publication; it changed approval safeguards and did not conflict with directory data.
- No user-submitted, claimed, paid or unrelated record was removed or rewritten.

## Published and live-verified additions

- Distinct new businesses absent from the fixed baseline: **3**
- Placements from those new businesses: **7**
- Placements from businesses already present at baseline: **0**
- New-business target: 1,000
- Exact new-business shortfall: **997**

| City | Category | Baseline displayed | Added | Published displayed | Remaining displayed deficit |
|---|---|---:|---:|---:|---:|
| Destin | Appliance repair | 10 | 1 | 11 | 9 |
| Fort Walton Beach | Appliance repair | 10 | 1 | 11 | 9 |
| Panama City | Appliance repair | 11 | 1 | 12 | 8 |
| Panama City Beach | Appliance repair | 9 | 1 | 10 | 10 |
| Dothan | Irrigation & sprinkler repair | 1 | 1 | 2 | 18 |
| Dothan | Landscaping | 1 | 2 | 3 | 17 |

## Published displayed coverage

- Pages at 20 or more: **197**
- Pages below 20: **923**
- Empty pages: **0**
- Remaining displayed deficit: **9,796**

These are rendered-record counts after identity/domain deduplication, not a certification of every historical record. Historical placements not individually audited in this run remain **unknown**. Unsupported historical records are excluded from verified-completion claims without being deleted.

## Evidence and verification state

- The three published identities and all seven placements have official-site evidence for direct-provider identity, residential category fit and specific city or local service-area coverage.
- JSON parsing, current catalog slugs, placement IDs/slugs, normalized-domain duplicate checks, fixed-baseline preservation, excluded-domain policy, lint and the production build passed.
- Initial publication commit: `e6d3115d7bce4c93d7af1c59924af61f9c70fc2b`.
- Corrective publication commit: `bdf4d29d7c486f0d25145e738ae72384c261f11a`.
- Vercel production deployment `dpl_FLVWj6K3GG7SXzZESxpfbs1P8P5s` reached `READY` for the corrective commit.
- All seven placements were visibly present with the expected counts on the six intended live pages.
- All three live directory website links reached the intended official business identities at `2026-11-09T17:12:53Z`.
- Nothing from this batch remains awaiting deployment or live verification.

## Research, blockers and historical review

- **21 candidates recorded as researched**: 3 published/live-verified, 3 pending or blocked, and 15 rejected as fixed-baseline identities, historical/national duplicates or unreliable identities.
- Prospect Well Drilling was removed before final counting because its official destination returned an upstream connection failure during live verification.
- S & J Irrigation was removed before final counting because its official destination rendered `SITE NOT FOUND` during live verification.
- Tree Huggers Tree Service remains pending explicit official residential-scope evidence.
- GE Appliances Factory Service / Bodewell remains excluded from this run because a separately identifiable qualifying local branch was not established.
- Retail Fix It remains flagged as a commercial facility-maintenance/intermediary network and excluded from verified counts. No historical record was deleted or hidden.

## Resume point

Resume from the current publication state recorded here, re-read `main` before any write, preserve later changes, and continue with the lowest strictly verified deficits in Destin, Fort Walton Beach, Crestview and Panama City, then the other one-business pages nearest Pensacola and outward. The site remains incomplete: 923 displayed pages are below 20 and the displayed deficit is 9,796; unaudited historical coverage remains unknown until placement-specific evidence is checked.
