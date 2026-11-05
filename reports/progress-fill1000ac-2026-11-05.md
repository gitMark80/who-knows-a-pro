# Fill 1000ac progress — 2026-11-05

## Run baseline and published checkpoint

- Fixed run-start baseline: `ab450b6c6588d8444579b99194b5cbfb879d4526` (24,372 generated listings).
- Catalog confirmed unchanged: 40 active cities, 30 publicly visible categories, 1,200 public pages and ten hidden categories preserved. Grayton Beach is active; Pensacola Beach is not active. Panama City and Panama City Beach remain distinct.
- No competing fill or build process was found before research. The baseline was exported from current `main`, and validation confirms all 24,372 prior generated listings are byte-for-byte preserved and retain their order in the prepared snapshot.
- Published and live-verified change: eleven distinct businesses absent from the fixed baseline and one previously listed identity, producing seventeen qualifying placements. The exact new-business shortfall against 1,000 is 989.

## Published additions

| City/category | Business | Baseline identity | Displayed after | Displayed deficit after |
|---|---|---|---:|---:|
| Pace / auto mechanics | Auto Air and Repair of Milton | new | 20 | 0 |
| Pace / auto mechanics | G&L Auto Repair | new | 20 | 0 |
| Pace / marine services | G&L Auto Repair | new | 19 | 1 |
| Milton / auto mechanics | Auto Air and Repair of Milton | new | 20 | 0 |
| Milton / auto mechanics | G&L Auto Repair | new | 20 | 0 |
| Milton / auto mechanics | All Pro Tune Up | new | 20 | 0 |
| Milton / auto mechanics | Florida Stores Automotive | new | 20 | 0 |
| Milton / marine services | G&L Auto Repair | new | 20 | 0 |
| Milton / marine services | 2 Gauge Marine & Trailer | new | 20 | 0 |
| Milton / marine services | Livingston Mobile Marine | new | 20 | 0 |
| Milton / hurricane shutters & impact windows | Shelby Sash & Door | new | 20 | 0 |
| Perdido Key / auto mechanics | Evans Automotive - Pensacola | new | 20 | 0 |
| Foley / auto mechanics | Goodyear Auto Service - Foley | new | 20 | 0 |
| Panama City Beach / appliance repair | Bodewell (GE Appliances Factory Service) | existing | 20 | 0 |
| Biloxi / pest control | Insecteco Pest Company | new | 20 | 0 |
| Gulfport / pest control | Insecteco Pest Company | new | 20 | 0 |
| Gulfport / pest control | Southern Pest Control | new | 20 | 0 |

Nine displayed page targets reach 20 in the published snapshot. These page totals are not certified as twenty qualifying businesses because the historical records on those pages have not all been re-audited under the current residential, direct-provider, geography and identity rules.

## Coverage state

- Before this checkpoint: 831 pages displayed 20+, 369 displayed below 20, zero empty, displayed deficit 1,426.
- Published after this checkpoint: 840 pages display 20+, 360 display below 20, zero empty, displayed deficit 1,409.
- Complete remaining displayed deficits for all 1,200 public city/category combinations are recorded in `reports/coverage-fill1000ac-prepared-2026-11-05.csv`.
- Priority pages: Destin and Fort Walton Beach still have no displayed page below 20. Crestview auto body and marine services remain at 18. Panama City septic remains at 19 because no additional candidate passed every residential and live-source requirement. Pace auto mechanics reaches 20 and marine services rises to 19. Milton auto mechanics, marine services and hurricane protection reach 20.
- The fresh qualifying total and qualifying remaining deficit remain unknown until all historical displayed records are audited. Displayed counts are not substituted for qualifying counts.

## Verification and validation

- All fourteen selected homepage/source URLs passed direct HTTP verification after redirects. The final domains match the intended businesses.
- JSON parsing, source metadata, evidence length, active city and visible category slugs, normalized-domain placement deduplication, business-identity placement deduplication and source-to-generated expansion checks passed.
- The published generated directory has 24,389 listings. The seventeen additions append after all 24,372 baseline listings; no earlier record changed or moved.
- `pnpm lint` and the production `pnpm build` completed successfully.
- Production deployment `dpl_7f6BAEDAjR9pWv4v1HUkEV5omjpB` reached `READY`. Live verification passed all seventeen placements on ten affected category pages and all twelve affected business profiles, including the intended official-site link on every checked page.

## Candidates and blockers

- Fourteen evidence candidates were researched. Thirteen source rows were selected for seventeen underfilled-page placements; Panhandle Platforms and Marine Repairs passed research but was not selected because Milton marine services reached 20 first.
- Three candidates are in the withheld ledger. Veteran Septic lacks explicit residential-customer evidence on its official site. OGD Mobile's former local domain redirects to a generic corporate page and current official location data no longer lists Mobile. ACE Garage Door has relevant official content but both its homepage and city page repeatedly returned HTTP 406 during the publication source check.
- The exact shortfall against the 1,000-new-business run target is 989. No candidate was loosened, duplicated or broadly projected to reduce that shortfall.
- The existing unsupported-history flag remains unchanged: the prior conservative audit flags 8,816 displayed placements across 158 identities, including 396 Retail Fix It placements from 22 source rows. Those records are excluded from verified-completion claims and were not deleted or hidden.

## Publication status

- GitHub data commit: `c8f0555a46c04426ae69014d9eca98232ce9a632` on `main`.
- Vercel production deployment: `dpl_7f6BAEDAjR9pWv4v1HUkEV5omjpB`, `READY`.
- Live verification: passed at `2026-11-05T11:15:50.295816+00:00`; 17/17 placements and 12/12 profiles passed. The eleven new businesses are counted as published and live-verified. Detailed results are in `reports/live-fill1000ac-2026-11-05.json`.

## Supplemental priority checkpoint

- A continuation from the same fixed run-start baseline added Seffens Mobile Mechanic LLC to Crestview marine services. Its official site offers boat and jet-ski engine repair at the customer's dock or home, explicitly names Crestview and Okaloosa County, identifies the operating mechanic and direct quote process, and passed the working-site check.
- Supplemental data commit: `e9031eb9d8928c3358e169e18a2b66282d2cebe4`; production deployment `dpl_14WXqvpM1vdZBndHJGe8cMumZUcX` reached `READY`.
- Supplemental live verification passed at `2026-11-05T11:31:23.880414+00:00`: 1/1 placement and 1/1 profile passed, including the intended official-site link.
- Combined run total: twelve distinct new businesses published and live-verified; eighteen placements, comprising seventeen from newly added businesses and one from a business already present at the fixed baseline. The exact new-business shortfall against 1,000 is 988.
- Combined rendered coverage: 840 pages display 20+, 360 display below 20, zero are empty, and the displayed deficit is 1,408. Crestview marine services is now 19; Crestview auto body remains 18; Panama City septic remains 19.
- The supplemental research also reviewed Gerber Collision & Glass — Crestview, Vettes Unlimited, Hall Septic Tank Service/Disposal Services, A1 Septic Worx, Dr Pumper Septic and the already-listed Mr. Rooter Panama City operation. Gerber met the branch evidence rules but remains withheld under the repository's national-chain exclusion; Vettes returned HTTP 503; Hall's current official site does not offer septic work; A1's published official domain returned 404; Dr Pumper lacked a working official business site; and Mr. Rooter was already counted in the baseline.
- The qualifying total and qualifying deficit remain unknown because historical records have not been completely re-audited. The combined displayed deficit of 1,408 is not a certification that the historical listings qualify.
