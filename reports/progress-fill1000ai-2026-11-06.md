# fill1000ai live checkpoint — 2026-11-06

- Run-start baseline: `30c595c623c0bcdf66692dde260137bf7f3593f9` with 14,241 placements.
- Published source commit: `6a3d42b4a21da83de61245b075eecb4cc409ffd9`.
- Production deployment: `dpl_5xYnLt9Li3D441P6MU28cMmyXCq1` (`READY`).
- Distinct new local/regional businesses published and live-verified: **4**.
- Placements for those new businesses: **8**.
- New placements for previously listed local/regional businesses: **1**.
- Total published and live-verified placements: **9**.
- Live verification: **9/9** category cards, contextual profiles and official outbound links passed.
- Shortfall against the 1,000-new-business run target: **996**.

## Public-page coverage after this checkpoint

- Active cities: **40**.
- Visible categories: **30**.
- Public city/category pages: **1,200**.
- Pages displaying at least 20 distinct businesses: **163**.
- Pages below 20: **1,037**.
- Empty pages: **0**.
- Displayed-count deficit: **11,262**.
- Qualification caveat: this is the schema-deduplicated displayed count. Historical records that have not passed the stricter residential/category/geography audit remain unaudited and are not certified by this checkpoint.

## Additions and affected deficits

| City/category | Added | New displayed count | Remaining displayed deficit |
|---|---:|---:|---:|
| Crestview / pool service | Gulf Pool Services, Inc. | 14 | 6 |
| Destin / garage door repair | Affordable Garage Door Repair | 14 | 6 |
| Destin / towing | AutoWorks Towing & Recovery (existing business placement) | 10 | 10 |
| Fort Walton Beach / garage door repair | Affordable Garage Door Repair | 14 | 6 |
| Fort Walton Beach / pool service | Witt Co Pool Pros; Gulf Pool Services, Inc. | 18 | 2 |
| Panama City / towing | All Towed Up LLC | 8 | 12 |
| Panama City Beach / garage door repair | Affordable Garage Door Repair | 14 | 6 |
| Panama City Beach / towing | All Towed Up LLC | 7 | 13 |

## Verification and exclusions

- All 10 supporting official/government URLs returned HTTP 200 after redirect checks; manual evidence records separately establish direct-provider role, residential/customer scope, category match and specific geography.
- No national franchise or large national brand was added in this checkpoint.
- Hometown Garage Doors was researched for additional placements, but the run-start baseline already contained all four candidate placements under the same normalized domain; no duplicate was published or counted.
- Garage Door Guru LLC remains pending because its official site returned HTTP 503 during final verification.
- J&K Better Pools remains pending because the opened official pages did not explicitly establish residential/homeowner scope.
- Hard Core Towing & Recovery remains pending because its official website did not work.
- No records were deleted or hidden. Retail Fix It and DH Pace have zero placements in the run-start baseline.

## Durable artifacts

- Source data: `data/verified-coverage-2026-11-06-fill1000ai.json`
- Placement evidence: `reports/evidence-fill1000ai-2026-11-06.json`
- Source checks: `reports/source-checks-fill1000ai-2026-11-06.json`
- Validation and additions: `reports/validation-fill1000ai-2026-11-06.json`
- Full displayed coverage: `reports/coverage-fill1000ai-2026-11-06.csv`
- Live results: `reports/live-fill1000ai-2026-11-06.json`

Resume from the latest `main`, rebuild a fresh baseline, and continue with the lowest evidence-backed counts. Do not count researched or pending candidates as additions.
