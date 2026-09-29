# Directory fill checkpoint — 2026-09-29

## This batch

- Baseline: main commit `221d916f16d177f679273964017a8f474dfd5b9d`.
- Prepared 50 new placements across 12 approved cities (46 source records representing 25 business identities).
- Source evidence and verification dates: `reports/verified-gulf-breeze-perdido-2026-09-29.json`.
- Publication status at commit creation: validated entries included in this commit; live confirmation pending. Do not treat candidate collection or this statement as live confirmation.
- Existing 5,143 seed entries compared by ID and full serialized value: unchanged. New total: 5,193. No DB, owner, claimed, billing, subscription or paid-tier records modified.
- Registry remains 40 active cities × 40 categories. Grayton Beach retained; Pensacola Beach not added.

## Fresh baseline coverage

- Initial live city-card audit before concurrent 90-placement update: 470/1,600 combinations meet five; 1,130 below; 108 empty; 4,332 missing placements.
- Latest pre-publication live audit after the concurrent update: 495/1,600 meet five; 1,105 below; 101 empty; 4,242 missing placements.
- `reports/live-directory-coverage.csv` will be refreshed after publication; historical committed counts must not be treated as current.
- City-card counts are coverage indicators, not an independent re-verification of every historical listing.

## Priority cities after this batch (source counts; verify live)

- pace-fl: trading-card-stores=1
- milton-fl: trading-card-stores=3
- navarre-fl: all 40 categories at or above five.
- gulf-breeze-fl: all 40 categories at or above five.
- perdido-key-fl: appliance-repair=4, auto-body-collision=1, flooring=4, garage-door-repair=3, irrigation-sprinkler-repair=2, junk-removal=4, lawn-care=4, mobile-auto-detailing=3, movers=3, septic-services=4, towing=2

## Candidate artifacts and rejected/deferred research

- Inspected GitHub workflow run 36559444099, artifact 11029098206 (expires 2026-10-29). Archive includes 501 JSON files; cached priority-city results were limited to irrigation/detailing queries and did not supply relevant new store candidates. No new paid API requests made; no recurring paid API budget exists.
- No open PRs; branch listing contains main and codex/revenue-test-mode. Detected concurrent 90-placement commit 221d916 during pre-write refresh; fast-forwarded and re-deduplicated this batch on that commit. Refresh again before future writes.
- Pace card-store gap: PokeShop 850 already exists. Milton: Cade's Dice & Decanters and Fan2Fan already exist; added one GameStop Santa Rosa Commons entry using its official Milton address and card catalog. Do not invent extra stores or spread nearby shops across towns without evidence.
- `bfhappyservices.com` displays expired hosting: excluded.
- Dream Auto Mobile Detail service page returned 404 and service-area evidence was inconsistent: deferred.
- Executive Landscaping irrigation article returned 404 on recheck: deferred.
- Gulf Coast Home Remodel Perdido page reported temporarily down: deferred.
- Into Gutters explicitly limits Florida work to gutter cleaning; evidence records preserve that limit. S.E. Tradesmen offers septic installation/repair, not pumping. Specialized service placements do not imply all services in a category.
- Gulf State's existing website identity was preserved; pensacolainspectors.com and gulfstatehomeinspections.com identify the same business and phone. No duplicate business identity introduced.

## Validation

- TypeScript check and production build passed against the combined final data.
- Prior 5,143 seed records are byte-for-byte equal as serialized business values, including IDs and mainSlugs.

## Next actions

1. Confirm this data commit deployed and verify every added identity on its live category page; refresh the full 1,600-combination audit.
2. Continue honest research for Pace/Milton trading-card shortfalls, then Perdido Key remaining gaps, then surrounding approved cities outward from Pensacola.
3. Reuse the existing artifact before any new sourcing calls. Other cities still have substantial shortfalls; task is not complete.
4. Refresh main and any open PRs before each write; retain sources, dates and checkpoint updates in the repository. Do not overwrite concurrent additions.
