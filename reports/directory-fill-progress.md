# Directory fill checkpoint — 2026-09-29

## This batch

- Baseline: main commit `221d916f16d177f679273964017a8f474dfd5b9d`.
- Prepared 50 new placements across 12 approved cities (46 source records representing 25 business identities).
- Source evidence and verification dates: `reports/verified-gulf-breeze-perdido-2026-09-29.json`.
- Committed and confirmed live: all 50 additions from `77fafdf89302fec5a2155411a740ba49cc18536d`. Vercel reported deployment success. Each added identity's profile link and official website link was found on its live category page (33 category pages checked). Evidence: `reports/live-additions-2026-09-29.json`.
- Existing 5,143 seed entries compared by ID and full serialized value: unchanged. New total: 5,193. No DB, owner, claimed, billing, subscription or paid-tier records modified.
- Registry remains 40 active cities × 40 categories. Grayton Beach retained; Pensacola Beach not added.

## Fresh baseline coverage

- Initial live city-card audit before concurrent 90-placement update: 470/1,600 combinations meet five; 1,130 below; 108 empty; 4,332 missing placements.
- Latest pre-publication live audit after the concurrent update: 495/1,600 meet five; 1,105 below; 101 empty; 4,242 missing placements.
- Post-publication live audit: **504/1,600 combinations meet five; 1,096 below; 99 empty; 4,192 missing placements.** Nine additional combinations reached five in this batch.
- `reports/live-directory-coverage.csv` is the fresh post-publication audit from 2026-09-29.
- City-card counts are coverage indicators, not an independent re-verification of every historical listing.

## Priority cities after this batch (confirmed live counts)

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

1. Read current main and this checkpoint before starting the next batch; check for concurrent work and refresh live coverage when needed.
2. Continue honest research for Pace/Milton trading-card shortfalls, then Perdido Key remaining gaps, then surrounding approved cities outward from Pensacola.
3. Reuse the existing artifact before any new sourcing calls. Other cities still have substantial shortfalls; task is not complete.
4. Refresh main and any open PRs before each write; retain sources, dates and checkpoint updates in the repository. Do not overwrite concurrent additions.

## Continuation batch — Perdido Key and Baldwin County

- Baseline `ee40ca9`; 31 additional placements across eight approved cities. Source evidence: `reports/verified-perdido-baldwin-2026-09-29.json`.
- All 5,193 existing generated records compared by ID and complete value: unchanged. New seed total 5,224. No paid API calls.
- Publication status: merged and confirmed live; see publication confirmation below.
- Expected newly complete pairs: Perdido Key movers, appliance repair, lawn care and irrigation; Gulf Shores movers; Foley movers.
- Pace card-store candidates Necroptik and Fan Cave currently expose Facebook links only in discovery results; no independently verified official business website, so deferred. Milton card-store gap remains.
- Kutter's official pages confirm services but not explicit target-city coverage, so deferred. Moving Partners has template/provider-identity ambiguities, so deferred. Executive irrigation URL still returns 404; Dream Auto contact was blocked.
- Southern Shores explicitly limits junk removal to Mobile County. Added only Mobile for that service. 850 ApplianceCare excludes refrigerators, dishwashers and ice makers. Backflow specialist scope is preserved in evidence.
- Next: verify this batch live and refresh coverage; continue remaining Perdido Key gaps, Orange Beach/Daphne/Fairhope mover gaps and nearby cities. Refresh main before writing.

## Publication confirmation and flooring/restoration continuation

- PR #1 merged as `af1d064aff68b80d49ba81205d5645311a01a61e`. Vercel status success; all 31 placements verified live on 16 category pages. Evidence: `reports/live-perdido-baldwin-2026-09-29.json`.
- Refreshed live audit after that merge: 510/1,600 meet five; 1,090 below; 99 empty; 4,161 missing placements.
- Prepared 11 further placements across seven cities using explicit official city/service coverage from Elite Hardwood and ProClean. Existing business identities preserved. Evidence: `reports/verified-flooring-restoration-continuation-2026-09-29.json`.
- Confirmed completed pair: Perdido Key flooring. All 11 continuation placements are live, verified after Vercel success for `f265923eb7ee9b626fdd0d38be48f23d6484a488`; evidence: `reports/live-flooring-restoration-continuation-2026-09-29.json`.
- Research exclusions: Minard Auto Detailing homepage returns 502; Arete Pensacola URL returns 404. Dually Doors has no explicit Perdido Key coverage on its area page; its named approved-city categories are already complete. Imperial's Perdido Key page contradicts geography (claims roughly 100 miles from Melbourne); excluded. No paid API calls.
- Next: remaining Perdido Key auto body, garage door, junk removal, mobile detailing, septic and towing gaps; preserve Pace/Milton card-store gaps until authentic official websites are found. Continue nearby Baldwin and Emerald Coast gaps with sources.

## Latest live checkpoint

- Both batches confirmed live: 31 + 11 = 42 placements this continuation. Total generated seed records: 5,235. All 5,224 records predating the second batch are unchanged. TypeScript passed.
- Latest full live audit: **511/1,600 meet five; 1,089 below; 99 empty; 4,150 missing placements.** Updated `reports/live-directory-coverage.csv`.
- Data commit: `f265923eb7ee9b626fdd0d38be48f23d6484a488`. No open publication approval remains for these batches. Refresh current main and coverage before next write.

## Emerald Coast continuation — 2026-09-29

- Baseline `c2bb2bd`; fresh live audit: 511/1,600 pairs meet five, 1,089 below, 99 empty, 4,150 missing placements.
- Prepared 144 verified placements from 22 business identities across 12 cities. Destin +34, Fort Walton Beach +34, Crestview +29; other additions cover Grayton Beach, Panama City/Beach and documented neighboring service areas. Exact sources, service limits, selected pairs and candidate exclusions: `reports/verified-emerald-coast-2026-09-29.json`.
- All 5,235 prior generated seed records unchanged by full serialized comparison; 5,379 final records, unique IDs, 144 additions. No DB, paid/claimed, subscriptions, routing or application code changed. No paid API calls.
- Read cached Foursquare artifact 11029098206 from workflow run 36559444099 first. Many matches were unrelated suppliers, restaurants or existing businesses; official-site checks determined category and geography. Pace/Milton trading-card gaps remain; Navarre remains complete by live count.
- Detected an unfinished local Perdido/Baldwin batch in `fill-hourly`; left it untouched and excluded its source identities. Main advanced from f265923 to c2bb2bd during research; refreshed before edits. No open PRs at prepublication check.
- Status: PR #3 merged as `50a0ca34023771470e092ea154da22a34e9df7ac`; production deployment succeeded. All 144 additions confirmed live on 65 category pages with profile and official-website links. Evidence: `reports/live-emerald-coast-2026-09-29.json`. Duplicate/preservation checks, TypeScript and production build passed.
- Expected newly completed pairs in this batch: 20. Coverage counts are indicators, not an independent re-verification of historical entries.
- Next: continue remaining Emerald Coast and nearby gaps below; refresh main and PR #2 before writing. PR #2 contains 19 different garage-door/detailing placements and remains open; it was not merged or modified. Its shared JSON/checkpoint additions will require reconciliation against current main.

### Confirmed live coverage after Emerald Coast publication

- Full live audit: **531/1,600 pairs meet five; 1,069 below; 88 empty; 4,006 missing placements.** This batch completed 20 more pairs and filled 11 previously empty pairs. Audit was retried successfully after a transient 502. Fresh counts are saved in `reports/live-directory-coverage.csv`.
- 144 published placements: Destin 34, Fort Walton Beach 34, Crestview 29, Grayton Beach 18, Panama City Beach 10, Panama City 4, Gulf Shores 4, Fairhope 4, Daphne 4, Orange Beach 1, Foley 1, Dothan 1.
- No paid API calls or purchases. Existing paid/claimed data untouched. Overall task remains incomplete; continue future runs.

Remaining nearby gaps (current live count):

- pace-fl: trading-card-stores=1.
- milton-fl: trading-card-stores=3.
- navarre-fl: all 40 categories meet the count target.
- perdido-key-fl: auto-body-collision=1, garage-door-repair=3, junk-removal=4, mobile-auto-detailing=3, septic-services=4, towing=2.
- destin-fl: appliance-repair=2, auto-body-collision=1, concrete=4, generator-installation=2, hurricane-shutters-impact-windows=2, locksmith=1, pool-installation=4, screen-enclosures-pool-cages=3, septic-services=2, towing=1, trading-card-stores=1, window-tinting=2.
- fort-walton-beach-fl: appliance-repair=2, auto-body-collision=1, concrete=4, generator-installation=2, hurricane-shutters-impact-windows=2, locksmith=1, pool-installation=4, screen-enclosures-pool-cages=2, septic-services=2, towing=1, trading-card-stores=1, window-tinting=2.
- crestview-fl: appliance-repair=1, auto-body-collision=2, concrete=4, flooring=3, generator-installation=1, handyman=4, hurricane-shutters-impact-windows=1, locksmith=1, pool-installation=3, screen-enclosures-pool-cages=2, septic-services=2, towing=2, trading-card-stores=1, window-tinting=2.
