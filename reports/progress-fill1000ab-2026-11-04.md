# Fill 1000ab progress — 2026-11-04

## Run baseline and prepared checkpoint

- Fixed run-start baseline: `f1e20046679e1dc84d7b36cf1e3787364176aa00` (24,358 generated listings).
- Catalog confirmed unchanged: 40 active cities, 30 publicly visible categories, 1,200 public pages and ten hidden categories preserved. Grayton Beach is active; Pensacola Beach is not active. Panama City and Panama City Beach remain distinct.
- No competing fill process was found before research. The baseline was exported from current `main`, and all 24,358 prior generated listings are byte-for-byte preserved and retain their order in the prepared snapshot.
- Published change: twelve distinct businesses absent from the fixed baseline and one previously listed identity, producing fourteen qualifying placements. The exact published new-business shortfall against 1,000 is 988.
- Data commit `dd2ad669597afc12b577a56daf76d6c9304898ff` deployed successfully to production as Vercel deployment `dpl_DFhU3jeP2LA6vjqk3W56MeD88t8z` (`READY`). All fourteen category-page cards and all thirteen affected business profiles passed live verification.

## Prepared additions

| City/category | Business | Baseline identity | Displayed after | Displayed deficit after |
|---|---|---|---:|---:|
| Panama City / septic services | Yoder Septic Service | new | 19 | 1 |
| Destin / auto body & collision | Mullins Auto Body | new | 20 | 0 |
| Pace / appliance repair | All Brand Appliance Repair | new | 20 | 0 |
| Milton / appliance repair | All Brand Appliance Repair | new | 20 | 0 |
| Gulf Shores / insulation | Harzo Inc. | new | 20 | 0 |
| Gulf Shores / irrigation & sprinkler repair | Southscapes LLC | new | 20 | 0 |
| Gulf Shores / pest control | Sandman Pest Control | existing | 20 | 0 |
| Foley / auto mechanics | Full Motors USA | new | 19 | 1 |
| Foley / hurricane shutters & impact windows | One Cut Glass | new | 20 | 0 |
| Foley / irrigation & sprinkler repair | Dalton's Sprinkler, Drainage & Lighting | new | 20 | 0 |
| Foley / screen enclosures & pool cages | Bluewater Exteriors | new | 20 | 0 |
| Mobile / towing | Casher's Wrecker Service | new | 20 | 0 |
| Panama City Beach / irrigation & sprinkler repair | Key Irrigation | new | 20 | 0 |
| Panama City Beach / screen enclosures & pool cages | Coastal Aluminum Screen and Patio | new | 20 | 0 |

Twelve rendered page targets reach 20 in the prepared snapshot. These page totals are not certified as twenty qualifying businesses because the historical records on those pages have not all been re-audited under the current residential, direct-provider, geography and identity rules.

## Coverage state

- Before this checkpoint: 819 pages displayed 20+, 381 displayed below 20, zero empty, displayed deficit 1,440.
- Published after this checkpoint: 831 pages display 20+, 369 display below 20, zero empty, displayed deficit 1,426.
- Complete remaining displayed deficits for all 1,200 public city/category combinations are recorded in `reports/coverage-fill1000ab-live-2026-11-04.csv`. This file is the resumable city/category gap ledger.
- Priority pages after the prepared batch: Destin auto body reaches 20; Panama City septic rises to 19; Panama City Beach irrigation and screen enclosures reach 20. Crestview auto body remains 18 and Crestview marine services remains 18. Fort Walton Beach has no rendered page below 20.
- The fresh qualifying total and qualifying remaining deficit remain unknown until all historical displayed records are audited. Displayed counts are not substituted for qualifying counts.

## Verification and validation

- All nineteen distinct selected homepage/source URLs passed direct HTTP verification after redirects. The final domains match the intended businesses.
- Live verification found every intended business exactly once on each of the fourteen affected category pages, found the intended official-domain link on every card, and preserved the city/category context in every profile link. All thirteen affected business profiles returned HTTP 200 and linked to the intended official domain.
- JSON parsing, source metadata, evidence length, active city and visible category slugs, normalized-domain placement deduplication, business-identity placement deduplication and source-to-generated expansion checks passed.
- The generated directory has 24,372 listings. The fourteen additions append after all 24,358 baseline listings; no earlier record changed or moved.
- `pnpm lint` and the production `pnpm build` completed successfully.

## Candidates and blockers

- Eighteen evidence records were researched in the qualified-candidate ledger. Thirteen source rows were selected for fourteen underfilled-page placements. Five researched records represented already-present exact placements and produced no addition.
- Six candidates are in the withheld ledger. Hall Septic failed official identity because its domain resolved to unrelated content. Thompson Marine showed commercial-vessel scope without homeowner evidence. Professional Collision and Foley Auto & RV Repair failed live official-site checks. Gerber remains on the repository exclusion list. Overhead Door Company of Mobile Bay had strong content evidence but repeatedly returned HTTP 403 during direct checks and was withheld.
- The exact shortfall against the 1,000-new-business run target is 988 at the prepared stage. No candidate was loosened or multiplied to reduce that shortfall.
- The existing unsupported-history flag remains unchanged: the prior conservative audit flags 8,816 displayed placements across 158 identities, including 396 Retail Fix It placements from 22 source rows. Those records are excluded from verified-completion claims and were not deleted or hidden.

## Publication status

- GitHub data commit: `dd2ad669597afc12b577a56daf76d6c9304898ff` on `main`.
- Vercel production deployment: `dpl_DFhU3jeP2LA6vjqk3W56MeD88t8z`, state `READY`.
- Live verification: fourteen of fourteen placements passed; thirteen of thirteen affected profiles passed.
