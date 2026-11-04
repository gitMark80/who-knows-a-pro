# Fill 1000y progress — 2026-11-04

## Published checkpoint

- Fixed run-start baseline: `b0f91cb2f4fff982ccd5e39551e9b21e175c7bde` (24,318 generated listings; 3,775 normalized domains).
- Published data commit: `03e4af4d1f1ec08200fb45743400ee2afc0b8443`.
- Production deployment: `dpl_6CjGziyGMwqNFTWrtFCjyP8NsNjH` (`READY`).
- Seven distinct businesses absent from the fixed baseline were published and live-verified. Exact shortfall against 1,000 new businesses: 993.
- Eight city/category placements were published and live-verified, all from the seven new businesses. No previously listed business received a new placement in this checkpoint.
- All eight cards passed across seven live category pages; all seven business profiles and intended official-site links passed.

## Additions and rendered deficits

| City/category | Added | Rendered after | Rendered deficit after |
|---|---:|---:|---:|
| Gulf Shores / auto mechanics | 1 | 12 | 8 |
| Fairhope / auto mechanics | 1 | 14 | 6 |
| Grayton Beach / auto mechanics | 1 | 14 | 6 |
| Dothan / screen enclosures & pool cages | 1 | 12 | 8 |
| Birmingham / marine services | 1 | 11 | 9 |
| Birmingham / pool installation | 2 | 20 | 0 |
| Birmingham / pool service | 1 | 18 | 2 |

The Birmingham pool-installation page reached 20 displayed records. It is not certified at 20 qualifying businesses because historical records on that page have not all been re-audited under the current requirements.

## Coverage state

- Catalog unchanged: 40 active cities, 30 visible categories, 1,200 public pages; ten hidden categories were preserved. Grayton Beach remains active and Pensacola Beach is not active.
- Rendered counts after this checkpoint: 809 pages at 20+, 391 below 20, zero empty, rendered deficit 1,472.
- Fresh qualifying totals and the qualifying remaining deficit remain unknown until all historical records are audited for residential scope, direct-provider status, category match, specific local geography and official identity.
- The prior conservative audit still flags 8,816 displayed placements across 158 business identities. Retail Fix It accounts for 396 placements from 22 source rows. No existing record was deleted or hidden.

## Research, validation and blockers

- Twenty-one candidate identities were durably tracked: seven published and live-verified; fourteen withheld or pending.
- Eleven candidates were withheld because their supported services map only to categories currently hidden from the public catalog.
- Blue Haven and Gerber were withheld because their domains are intentionally excluded by repository policy; that policy was not changed to inflate output.
- Paul Camp Pool Builders remains pending because its official site returned 503 or timed out during current live checks.
- Alabama Trolling Motors returned 403 to the simple scripted checker, but the official Birmingham marine-service pages were retrieved through the authorized browser, and the production category card, business profile and official-link target all passed.
- JSON/catalog/schema/duplicate checks passed; all 24,318 baseline listings were preserved. TypeScript and the production build passed.
- No candidates remain awaiting deployment or live verification from this checkpoint.

## Durable continuation state

- Published placement data: `data/verified-coverage-2026-11-04-fill1000y.json`.
- Qualification evidence: `reports/candidates-fill1000y-visible-2026-11-04.json`.
- Broader researched-candidate ledger: `reports/candidates-fill1000y-2026-11-04.json`.
- Withheld and pending candidates: `reports/withheld-fill1000y-2026-11-04.json`.
- Prepared coverage matrix: `reports/coverage-fill1000y-prepared-2026-11-04.csv`.
- Live verification: `reports/live-fill1000y-2026-11-04.json`.
- Final run summary: `reports/run-fill1000y-2026-11-04.json`.
