# Fill 1000ad progress — 2026-11-05

## Run baseline and publication

- Fixed run-start baseline: `af0e2480e716dc5be3364712c853b1234d8ff88c` with 24,390 generated listings.
- Catalog confirmed from current `main`: 40 active cities, 30 publicly visible categories, 1,200 public pages, and ten hidden categories preserved. Grayton Beach is active; Pensacola Beach is not. Panama City and Panama City Beach remain distinct.
- No competing fill or build process was found. `main` was rechecked immediately before publication and remained at the baseline commit, so no concurrent reconciliation was required.
- Published data commit: `9589bad0262a9d615d12074cd454c4428bcb5071`.
- Production deployment: `dpl_FF3fSrr65VAfSzQgP3sDKFWKWb4d`, state `READY`.
- Live verification completed at `2026-11-05T17:01:31.868111+00:00`: 11/11 placements and 9/9 affected profiles passed, including the intended official-business link on every checked page.

## Published additions

| City/category | Business | Run-start identity | Displayed after | Displayed deficit after |
|---|---|---|---:|---:|
| Pace / pool installation | Neway Pools | existing | 20 | 0 |
| Milton / garage door repair | Pinckard Garage Doors | existing | 20 | 0 |
| Navarre / auto body & collision | MAE Collision - Navarre | new | 20 | 0 |
| Orange Beach / garage door repair | Overhead Door Company of Mobile Bay | new | 20 | 0 |
| Fairhope / garage door repair | Overhead Door Company of Mobile Bay | new | 20 | 0 |
| Mobile / garage door repair | Overhead Door Company of Mobile Bay | new | 20 | 0 |
| Daphne / insulation | Happy Home Insulation | existing | 20 | 0 |
| Daphne / pest control | GoPest | existing | 20 | 0 |
| Biloxi / septic services | JLG Septic Services | new | 10 | 10 |
| Dothan / marine services | Dothan Powersports | new | 8 | 12 |
| New Orleans / septic services | Nathan's Septic Service | new | 9 | 11 |

Five distinct businesses were absent from the fixed baseline and are now published and live-verified. They produced seven placements. Four previously listed businesses produced four independently supported placements. The exact shortfall against the 1,000-new-business target is 995.

Eight displayed page targets newly reach 20: Navarre auto body, Milton garage doors, Pace pool installation, Orange Beach garage doors, Fairhope garage doors, Mobile garage doors, Daphne pest control, and Daphne insulation. Displayed totals are not a certification that all historical rows on those pages satisfy the current qualification rules.

## Coverage state

- Before: 840 pages displayed 20+, 360 displayed below 20, zero empty, displayed deficit 1,408.
- Published: 848 pages display 20+, 352 display below 20, zero empty, displayed deficit 1,397.
- The full 1,200-page displayed coverage table is in `reports/coverage-fill1000ad-prepared-2026-11-05.csv`.
- Priority gaps remain: Crestview auto body 18 (missing 2), Crestview marine services 19 (missing 1), Panama City septic services 19 (missing 1), and Pace marine services 19 (missing 1). Destin and Fort Walton Beach have no displayed page below 20.
- The exact qualifying coverage and qualifying deficit remain unknown until the historical directory is completely audited under the current residential, direct-provider, local-coverage, identity and working-site requirements.

## Verification and validation

- JSON parsing, active city and visible category slugs, evidence metadata, normalized-domain placement deduplication, business-identity placement deduplication, source expansion, and coverage math passed.
- All 24,390 baseline generated listings were preserved byte-for-byte and in order. Eleven new generated placements append to the directory, producing 24,401 generated listings.
- The production build completed successfully.
- Twelve of fourteen unique homepage/source URLs passed the direct HTTP checker. The remaining two URLs belong to the same Mobile Bay official site and returned HTTP 403 to the plain checker; a full browser opened the site successfully and visibly confirmed the locally operated provider, residential garage-door service, and the named Orange Beach, Fairhope and Mobile coverage. The live directory links point to that intended official domain.
- RPM Construction Technologies was removed before publication because its official website repeatedly returned HTTP 503. It is recorded in `reports/withheld-fill1000ad-2026-11-05.json` and is not counted.

## Research, blockers and historical review

- Ten formally evaluated evidence candidates reached the shortlist. Nine were selected and published; one was rejected for an invalid official site at verification. No qualified candidate remains awaiting deployment or live verification.
- The priority blocker ledger records why Crestview auto body, Crestview marine, Panama City septic and Pace marine were not padded with duplicates, excluded national chains, non-septic plumbing pages, directory-only businesses or businesses without a working official site.
- Historical unsupported-record flags remain unchanged: 8,816 displayed placements across 158 identities, including 396 Retail Fix It placements. Those historical rows remain publicly visible and were not deleted or hidden, but they are excluded from verified-completion claims.
- The new-business target was not reached: 5 completed, 995 short. The lower count reflects the strict evidence and live-publication requirements, not relaxed standards or duplicate placements.

## Resumption state

- Baseline reference, candidate evidence, source checks, validation, prepared coverage, withheld candidates, live verification and this progress report are committed in the repository.
- Resume from current `main`, re-export a fresh baseline, recheck for concurrent work, and continue on the lowest verified counts without treating displayed historical counts as audited qualifying counts.
