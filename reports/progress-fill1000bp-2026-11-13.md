# Who Knows a Pro fill1000bp published checkpoint — 2026-11-13

## Run baseline and scope

- Fixed run-start baseline: `f9545c3927d3f194792a722ad9aab9d10881ae50` (`main`)
- Baseline placements preserved: 14,663
- Current catalogs: 40 active cities, 28 publicly visible categories, 12 hidden categories
- Public page matrix: 1,120 city/category combinations
- Grayton Beach remains active; Pensacola Beach is not an active-city substitute.
- Hidden categories remain hidden. No city or category was created, activated, renamed, expanded, unhidden or deleted.
- No user-submitted, claimed, paid or unrelated record was removed or rewritten.

## Published additions

- Distinct new businesses absent from the fixed baseline: **3**
- Published and live-verified placements from those new businesses: **9**
- Published and live-verified placements from businesses already present at baseline: **1**
- New-business target: 1,000
- Exact new-business shortfall against the 1,000 target: **997**

| City | Category | Baseline displayed | Added | Live displayed | Remaining displayed deficit |
|---|---|---:|---:|---:|---:|
| Crestview | Auto Body & Collision | 9 | 1 new | 10 | 10 |
| Crestview | Generator Installation | 16 | 1 new | 17 | 3 |
| Crestview | Pool Installation | 16 | 1 existing | 17 | 3 |
| Destin | Auto Body & Collision | 12 | 1 new | 13 | 7 |
| Destin | Pest Control | 18 | 1 new | 19 | 1 |
| Fort Walton Beach | Auto Body & Collision | 19 | 1 new | 20 | 0 |
| Milton | Generator Installation | 14 | 1 new | 15 | 5 |
| Pace | Generator Installation | 14 | 1 new | 15 | 5 |
| Panama City | Pest Control | 14 | 1 new | 15 | 5 |
| Pensacola | Pest Control | 19 | 1 new | 20 | 0 |

## Live displayed coverage

- Pages at 20 or more: **209**
- Pages below 20: **911**
- Empty pages: **0**
- Remaining displayed deficit: **9,631**

These are rendered-record counts after identity and normalized-domain deduplication, not certification of every historical row. Historical placements not individually audited in this run remain **unknown**. Unsupported historical records are excluded from verified-completion claims without deletion.

## Validation and research state

- Candidates researched: **22**; published candidates: **4**; published distinct new businesses: **3**; unresolved pending: **2**; rejected or resolved duplicates: **18**.
- RIDD Pest Control, Carnley Services and Caliber Collision were absent from the fixed baseline. Their nine placements are on pages that were below 20 at run start.
- Neway Pools existed at baseline. Its official Crestview page supports one additional Crestview pool-installation placement; it is not counted as a new business.
- Caliber remains globally excluded by default. Only the exact three city/category placements supported in this run's evidence ledger receive placement-scoped audited exceptions; no domain-wide exclusion was removed.
- Hale Appliance Services and Laser Appliance Repair were rejected for local-operation, intermediary/commercial-scope and geographic-evidence failures. Wright Generator Pros was rejected after a placeholder 555 telephone number undermined the business identity. AJ Electrical Corp and Florida Waterscapes NWF remain pending.
- Retail Fix It has zero current public baseline placements and remains flagged as a commercial maintenance network. The historical WittCo Crestview pool placement remains flagged for unsupported geography. Nothing was deleted or hidden.

## Publication state

- Locally validated: **10 placements**
- Lint: passed
- Production build: passed
- Data commit: `af229c3eaedd066999aa0c8a49c4d2559f134e7d`
- Production deployment: `dpl_2Rqki8sgkk1jUK6XcdDujpMFKtGv` (`READY`)
- Runtime-preservation/checkpoint commit: `7f1abece0303100737fc5e90ab29581b1639e3dc`
- Checkpoint deployment: `dpl_9R1cvVkPQWiuz2aZ6CDKbtsvAmQn` (`READY`); post-fix production requests produced **0** error/fatal runtime log entries.
- Published and live-verified: **10 placements** (**3** distinct new businesses)
- New-business placements: **9**; previously listed-business placements: **1**
- Changes awaiting deployment or live verification: **0**
- All ten affected public pages displayed the intended business; all four profiles resolved; all ten placement-specific official evidence destinations remained working and identified the intended provider.

## Runtime preservation fix

- Production log review found that cold-start initialization built an exclusion-domain `UPDATE` expression beyond SQLite's depth limit. That stopped dynamic claim/override and count reads before they ran, although the static pages still rendered.
- The follow-up change removes the cold-start approval-state mutation. Existing submitted and historical rows are not rewritten or hidden; public exclusion rules continue to be applied at read time.
- Lint and the production build pass with the fix. Publication and post-deployment runtime verification are recorded separately in the final checkpoint commit.

## Resume point

Resume from the fixed baseline and this published checkpoint. Continue with the lowest verified gaps in Destin, Fort Walton Beach, Crestview and Panama City, then work outward. Re-audit the current catalogs and remote `main` before the next publication. Displayed counts remain distinct from verified qualifying coverage; unaudited historical coverage remains unknown.
