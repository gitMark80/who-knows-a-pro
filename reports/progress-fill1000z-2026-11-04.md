# Fill 1000z progress — 2026-11-04

## Published checkpoint

- Fixed run-start baseline: `b89fbca04d486769e67467087399dad8e16e9c69` (24,328 generated listings; 3,784 normalized domains).
- Published data commit: `766f089f566a31bf0fa4922365bddac7a1bf7f4f`.
- Production deployment: `dpl_HtK4ZWQbgcbBsfFRUvZpP9tFZ9o6` (`READY`).
- Four distinct businesses absent from the fixed baseline were published and live-verified. Exact shortfall against 1,000 new businesses: 996.
- Ten city/category placements were published and live-verified: nine from the four new businesses and one from the previously listed DC Mechanics Auto Repair identity.
- All ten cards passed across nine live category pages; all five business profiles and intended official-site links passed.

## Additions and rendered deficits

| City/category | Added | Rendered after | Rendered deficit after |
|---|---:|---:|---:|
| Destin / septic services | 1 | 20 | 0 |
| Fort Walton Beach / septic services | 1 | 19 | 1 |
| Panama City / septic services | 1 | 18 | 2 |
| Panama City Beach / septic services | 1 | 13 | 7 |
| Foley / auto mechanics | 1 | 18 | 2 |
| Fairhope / auto mechanics | 2 | 16 | 4 |
| Fairhope / auto body & collision | 1 | 15 | 5 |
| Biloxi / septic services | 1 | 9 | 11 |
| Gulfport / septic services | 1 | 10 | 10 |

The Destin septic-services page reached 20 displayed records. It is not certified at 20 qualifying businesses because all historical records on that page have not yet been re-audited under the current requirements.

## Coverage state

- Catalog unchanged: 40 active cities, 30 visible categories, 1,200 public pages; ten hidden categories were preserved. Grayton Beach remains active and Pensacola Beach is not active.
- Rendered counts after this checkpoint: 812 pages at 20+, 388 below 20, zero empty, rendered deficit 1,460.
- Fresh qualifying totals and the qualifying remaining deficit remain unknown until all historical records are audited for residential scope, direct-provider status, category match, specific local geography and official identity.
- The prior conservative audit still flags 8,816 displayed placements across 158 business identities. Retail Fix It accounts for 396 placements from 22 source rows. No existing record was deleted or hidden.

## Research, validation and blockers

- Twelve candidate identities were durably tracked: five published identities and seven withheld or pending identities.
- JLG Septic was withheld because its Milton operation and nationwide claims did not establish a credible Biloxi or Gulfport local operation. Quick Fix Septic was withheld as a quote-comparison lead intermediary.
- Ashley Marine was withheld because its official pages established boat sales locations but not the proposed repair service. A+ Dent Medic remains pending because its verified PDR offering is narrower than the public auto-body/collision category.
- Paul Camp Pool Builders and GSBP Automotive remain pending because their official sites returned HTTP 503; Dothan Prop Shop remains pending because its site returned HTTP 403.
- All ten official source URLs passed direct accessibility checks. JSON/catalog/schema/duplicate checks, TypeScript and the production build passed; all 24,328 baseline listings were preserved.
- No candidates remain awaiting deployment or live verification from this checkpoint.

## Durable continuation state

- Published placement data: `data/verified-coverage-2026-11-04-fill1000z.json`.
- Qualification evidence: `reports/candidates-fill1000z-2026-11-04.json`.
- Withheld and pending candidates: `reports/withheld-fill1000z-2026-11-04.json`.
- Prepared coverage matrix: `reports/coverage-fill1000z-prepared-2026-11-04.csv`.
- Source accessibility: `reports/http-sources-fill1000z-2026-11-04.json`.
- Live verification: `reports/live-fill1000z-2026-11-04.json`.
- Final run summary: `reports/run-fill1000z-2026-11-04.json`.
