# Fill 1000aa progress — 2026-11-04

## Published checkpoint

- Fixed run-start baseline: `84d0979f0a4e9f96661448f8294920dcf5e0838d` (24,338 generated listings).
- Published data commit: `be206deacd91cc049ecd07a74506f7ab68e7c0c2`.
- Production deployment: `dpl_DLwiF9YBd8WNgnK9oDvoE3p4Uxv5` (`READY`).
- Nine distinct businesses absent from the fixed baseline were published and live-verified. Exact shortfall against 1,000 new businesses: 991.
- Twenty city/category placements were published and live-verified: sixteen from the nine new businesses and four from three previously listed business identities.
- All twenty cards passed across sixteen live category pages; all twelve affected business profiles and intended official-site links passed.

## Additions and rendered deficits

| City/category | Added | Rendered after | Rendered deficit after |
|---|---:|---:|---:|
| Fort Walton Beach / septic services | 1 | 20 | 0 |
| Pensacola / septic services | 2 | 20 | 0 |
| Pace / septic services | 2 | 20 | 0 |
| Pace / auto body & collision | 1 | 17 | 3 |
| Pace / pool installation | 2 | 19 | 1 |
| Perdido Key / septic services | 1 | 14 | 6 |
| Milton / pool installation | 2 | 20 | 0 |
| Navarre / septic services | 1 | 20 | 0 |
| Grayton Beach / marine services | 1 | 20 | 0 |
| Grayton Beach / pool installation | 1 | 20 | 0 |
| Dothan / fence builders | 1 | 15 | 5 |
| Montgomery / home inspections | 1 | 14 | 6 |
| Montgomery / hurricane shutters & impact windows | 1 | 5 | 15 |
| Auburn / hurricane shutters & impact windows | 1 | 4 | 16 |
| Birmingham / screen enclosures & pool cages | 1 | 13 | 7 |
| Huntsville / screen enclosures & pool cages | 1 | 13 | 7 |

Seven page-level rendered targets reached 20: Pensacola septic services, Navarre septic services, Fort Walton Beach septic services, Milton pool installation, Pace septic services, Grayton Beach pool installation and Grayton Beach marine services. These pages are not certified at twenty qualifying businesses because their historical records have not all been re-audited under the current rules.

## Coverage state

- Catalog unchanged: 40 active cities, 30 visible categories, 1,200 public pages; ten hidden categories were preserved. Grayton Beach remains active and Pensacola Beach is not active.
- Rendered counts after this checkpoint: 819 pages at 20+, 381 below 20, zero empty, rendered deficit 1,440.
- Fresh qualifying totals and the qualifying remaining deficit remain unknown until all historical records are audited for residential scope, direct-provider status, category match, specific local geography and official identity.
- The prior conservative audit still flags 8,816 displayed placements across 158 business identities. Retail Fix It accounts for 396 placements from 22 source rows and remains unsupported for residential-local locksmith counting. No existing record was deleted or hidden.

## Research, validation and blockers

- Twenty distinct candidate identities were durably tracked: twelve published identities and eight withheld or pending identities. Nine of the published identities were new relative to the fixed baseline.
- Paul Camp Pool Builders, Blue Haven Pools Dothan, Bear Creek Pools and RPM Strong were withheld because direct checks returned HTTP 503, 403, 406 and 503 respectively. Sunbelt Deck & Patio was withheld because its official homepage returned HTTP 404.
- Gerber Collision & Glass, ASP Birmingham and Window World of River Region had useful fresh official evidence but were withheld because their normalized domains are on the repository exclusion list; the exclusions were not bypassed or changed in this run.
- Eighteen unique official website/source URLs passed direct accessibility and final-destination checks. JSON/catalog/schema/duplicate checks, TypeScript and the production build passed; all 24,338 baseline listings were preserved.
- No candidates remain awaiting deployment or live verification from this checkpoint.

## Durable continuation state

- Published placement data: `data/verified-coverage-2026-11-04-fill1000aa.json`.
- Qualification evidence: `reports/candidates-fill1000aa-2026-11-04.json`.
- Withheld and pending candidates: `reports/withheld-fill1000aa-2026-11-04.json`.
- Prepared coverage matrix: `reports/coverage-fill1000aa-prepared-2026-11-04.csv`.
- Source accessibility: `reports/http-sources-fill1000aa-2026-11-04.json`.
- Live verification: `reports/live-fill1000aa-2026-11-04.json`.
- Final run summary: `reports/run-fill1000aa-2026-11-04.json`.
