# Who Knows a Pro fill1000as checkpoint — 2026-11-07

## Run baseline and scope

- Fixed run-start baseline: `b3be5e18103e366b54399d52095397278e0e1e66` (`main`)
- Baseline placements preserved: 14,393
- Current catalogs: 40 active cities, 30 publicly visible categories, 10 hidden categories
- Public page matrix: 1,200 city/category combinations
- Grayton Beach is present; Pensacola Beach is not an active-city substitute.
- No cities or categories were created, activated, renamed, or unhidden.
- No user-submitted, claimed, paid, or unrelated records were removed or rewritten.

## Prepared additions

- Distinct new businesses absent from the fixed baseline: **5**
- Placements from those new businesses: **8**
- New placements from 2 businesses already present at baseline: **15**
- Total prepared city/category placements: **23**
- New-business target: 1,000
- Exact shortfall pending publication and live verification: **995**

| City | Category | Baseline displayed | Added | Prepared displayed | Remaining displayed deficit |
|---|---|---:|---:|---:|---:|
| Crestview | Pool Installation | 13 | 2 | 15 | 5 |
| Crestview | Pool Service | 14 | 2 | 16 | 4 |
| Destin | Pool Installation | 16 | 2 | 18 | 2 |
| Fort Walton Beach | Auto Body & Collision | 13 | 2 | 15 | 5 |
| Fort Walton Beach | Pest Control | 16 | 1 | 17 | 3 |
| Fort Walton Beach | Pool Installation | 17 | 2 | 19 | 1 |
| Fort Walton Beach | Pool Service | 19 | 1 | 20 | 0 |
| Gulf Breeze | Pest Control | 17 | 1 | 18 | 2 |
| Milton | Pool Installation | 11 | 2 | 13 | 7 |
| Milton | Pool Service | 10 | 2 | 12 | 8 |
| Pace | Pool Installation | 11 | 1 | 12 | 8 |
| Pace | Pool Service | 9 | 1 | 10 | 10 |
| Panama City Beach | Auto Body & Collision | 2 | 1 | 3 | 17 |
| Panama City | Auto Body & Collision | 7 | 1 | 8 | 12 |
| Pensacola | Pest Control | 15 | 1 | 16 | 4 |
| Pensacola | Pool Service | 19 | 1 | 20 | 0 |

## Prepared displayed coverage

- Pages at 20 or more: **191**
- Pages below 20: **1,009**
- Empty pages: **0**
- Remaining displayed deficit: **11,096**

These are rendered-record counts after identity/domain deduplication, not a certification of every historical record. Historical placements not individually audited in this run remain **unknown**, and unsupported records are excluded from verified-completion claims without being deleted.

## Evidence and verification state

- Each prepared placement has official-site evidence for direct provider identity, residential/consumer category fit, and specific city, county, or local-operation coverage.
- National chains, lead generators, directories, social-only profiles, and candidates lacking a working official site were excluded.
- JSON parsing, catalog slugs, placement IDs/slugs, normalized-domain duplicate checks, and fixed-baseline preservation passed.
- `pnpm lint` passed.
- `pnpm build` passed.
- Publication and live verification are still pending at this checkpoint; prepared records are not yet counted as published additions.

## Pending and historical-review notes

- Murphy's Home Services: pending; official pages were blocked by Cloudflare verification.
- Gary Smith Honda Collision Center: pending; official collision page returned 404.
- J&K Better Pools: pending; official pages did not expressly establish residential scope.
- Precision Auto Body of Crestview: pending; no working official website found.
- Retail Fix It: no active fixed-baseline placement found. Its commercial maintenance-network model remains excluded from residential completion claims.
- No historical record was deleted or hidden in this run.

## Resume point

Publish only after re-fetching `main` and confirming it still matches the fixed baseline or safely reconciling any concurrent change. After deployment, verify all 23 directory placements and the five new businesses' official website destinations, then update the evidence ledger and this report with committed, deployed, and live-verified status separately.
