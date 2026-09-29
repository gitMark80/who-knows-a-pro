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

## Baldwin and coastal continuation — pending PR #2

- Refreshed against current main `c822e9b`, including all 144 confirmed-live Emerald Coast additions. Reconciled the earlier 19 pending PR #2 placements without changing existing data.
- Added 72 more official-site-backed placements this run; combined pending total 91 across 18 active cities. New sources: `reports/verified-baldwin-services-2026-09-29.json`; earlier 19: `reports/verified-coastal-services-continuation-2026-09-29.json`.
- All 5,379 published generated records unchanged by complete-value comparison; combined total 5,470. Unique IDs and canonical domain/city/category checks pass. TypeScript passed. Evidence: `reports/validation-baldwin-services-2026-09-29.json`.
- Expected 16 additional pairs reach five after publication: six appliance-repair pairs (Daphne, Fairhope, Foley, Gulf Shores, Orange Beach, Mobile), three garage-door pairs (Fairhope, Foley, Gulf Shores), four junk-removal pairs (Daphne, Fairhope, Foley, Gulf Shores), three mobile-detailing pairs (Orange Beach, Foley, Gulf Shores).
- Not published or live-verified. Prior automatic approval review requires explicit approval to merge/publish; expanded PR #2 is prepared for review. Last confirmed live coverage remains 531/1,600. No paid API calls; no billing/claims/DB/registry changes.
- Next: publish approved PR #2 and verify all additions, then refresh live counts. Remaining nearby gaps include Perdido Key categories, Daphne/Orange Beach garage doors, Orange Beach junk removal, and broader Baldwin service categories. Pace/Milton card-store gaps still need genuine official websites.

## PR #2 publication confirmation — 2026-09-29

- PR #2 merged as `8d897cd1b74bd4af3b29add7a2e968f9a11df1c0`. Vercel production status succeeded.
- All 91 placements verified live across 40 category pages: both business-profile and official-website links present. Initial check verified 90; Gulfport appliance repair returned HTTP 502, then the targeted retry verified the final placement.
- Complete live coverage audit encountered HTTP 502. A retry was interrupted when the execution connection ended with `network approval was cancelled before a decision was returned`; no new full-audit count claimed. Last complete audit remains 531/1,600 before this batch; 16 additional completed pairs are expected from validated seed counts.
- Total generated records 5,470; all 5,379 previous records unchanged. No paid API calls. These 91 additions no longer await approval.
- Next run: refresh full live coverage first, then continue remaining gaps. ProLift Garage Doors of South Alabama officially lists Daphne on https://www.proliftdoors.com/south-alabama/areas-we-serve/baldwin-county/ and is a candidate for its remaining garage-door gap. Baldwin Junk Removal /service-areas returned a soft 404; do not rely on search snippets for Orange Beach coverage. No new candidate from this follow-up was added.

## Baldwin trades continuation — 2026-09-29

- Full live audit before this batch succeeded: 547/1,600 pairs meet five, 1,053 below, 85 empty, 3,915 missing placements. CSV refreshed.
- Added 36 official-site-backed placements across Daphne, Fairhope, Foley and Gulf Shores, with source URLs, dates and evidence notes.
- All 5,470 prior records unchanged; new total 5,506. Nine pairs newly reach five: HVAC and plumbing in all four cities, plus Daphne garage doors.
- Evidence and complete-value validation saved in the corresponding baldwin-trades reports. Publication/live verification follows. No paid API calls.

### Baldwin trades publication confirmed

- PR #4 merged as `9d5972ebd651a8bdad6f023015c2d76056fd3536`; Vercel production status succeeded.
- All 36 additions verified live on 24 category pages, including both profile and official-website links. Report: `reports/live-baldwin-trades-2026-09-29.json`.
- Full live audit: **556/1,600 pairs meet five; 1,044 below; 85 empty; 3,879 missing placements.** A transient Dothan 502 passed on targeted retry. Updated CSV persisted. Nine additional pairs completed.
- All 5,470 previous records unchanged; 5,506 total generated records. TypeScript and canonical domain/city/category duplicate checks passed.
- Continue nearby gaps. Sexton officially offers Mobile irrigation repair at https://www.sextonlandscapes.com/service/irrigation-services/ ; Mobile currently has zero irrigation listings, and this verified candidate was not included in this 36-placement batch.

## Emerald services continuation — 2026-09-29, run 1811

- Refreshed main to `33ce051` after concurrent PR #4 merged; no open PRs at the pre-write check. Left concurrent working directories untouched.
- Fresh live audit: 556/1,600 pairs meet five, 1,044 below, 85 empty, 3,879 missing placements. Pace trading cards remains 1; Milton 3; Navarre all 40 meet the count target. Rechecked official-site discovery without fabricating extra stores.
- Prepared 78 verified placements across nine approved cities: Fort Walton Beach 21, Crestview 20, Destin 19, Panama City Beach 6, Panama City 4, Grayton Beach 3, Foley 2, Gulf Shores 2, Orange Beach 1.
- Evidence, verification dates, service limitations and rejected candidates: `reports/verified-emerald-services-2026-09-29-1811.json`. Existing Foursquare artifact 11029098206 (run 36559444099) reused; inspected 95 relevant cached queries containing 556 candidate results. No new API calls or purchases.
- All 5,506 prior generated records unchanged by full-value comparison; final total 5,584. Unique IDs and new canonical domain/city/category keys passed. Validation: `reports/validation-emerald-services-2026-09-29-1811.json`. Expected 18 more pairs reach five.
- Duplicate identities withheld: Superior Septic/Crown Plumbing share a phone; the two Prime Plumbing sites share a license; AutoWorks Towing/Destin Auto Center share premises; Resorts/A to Z and Derl/Knox/Ben Marshalls are associated. Beach2Bay excluded for unrelated gambling content.
- Publication status: PR #5 merged; all 78 placements confirmed live. TypeScript and production build passed. No database, paid/claimed records, billing, application code or city/category definitions changed.
- Next: finish production checks, publish through existing GitHub/Vercel workflow, verify all additions on live pages, refresh coverage. Remaining east gaps include towing, auto body, hurricane protection, pools, and card stores. Continue closest approved cities outward; do not add Pensacola Beach.

### Emerald services publication confirmation

- PR #5 merged as `d85b0e773bdf9feb2b71e93395f7398aeafe9436`; Vercel production deployment succeeded. All 78 new placements confirmed on 39 public category pages with both profile and official website links. Two temporary HTTP 502 pages passed on targeted retry. Evidence: `reports/live-emerald-services-2026-09-29-1811.json`.
- Complete post-publication live audit: **574/1,600 pairs meet five; 1,026 below; 81 empty; 3,801 missing placements.** This batch completed 18 additional pairs and filled four previously empty pairs. Updated `reports/live-directory-coverage.csv`. City-card counts are coverage indicators, not a new independent verification of historical listings.
- No paid API requests, purchases or paid/claimed record changes. Total generated records: 5,584; all 5,506 prior records unchanged.
- Next run: refresh main, open PRs, cached candidates and coverage. Priority card-store gaps remain in Pace and Milton; Navarre meets the count target. Continue the genuine nearby gaps below, with explicit official service-area evidence. Do not add uncertain businesses merely to reach five.

Remaining nearby gaps (confirmed live count):

- pace-fl: trading-card-stores=1.
- milton-fl: trading-card-stores=3.
- navarre-fl: all 40 categories meet the count target.
- perdido-key-fl: auto-body-collision=1, garage-door-repair=3, junk-removal=4, mobile-auto-detailing=4, septic-services=4, towing=2.
- destin-fl: auto-body-collision=1, hurricane-shutters-impact-windows=2, pool-installation=4, towing=3, trading-card-stores=1, window-tinting=4.
- fort-walton-beach-fl: auto-body-collision=1, hurricane-shutters-impact-windows=2, pool-installation=4, screen-enclosures-pool-cages=3, trading-card-stores=1.
- crestview-fl: auto-body-collision=2, flooring=3, generator-installation=4, handyman=4, hurricane-shutters-impact-windows=1, pool-installation=3, screen-enclosures-pool-cages=4, towing=3, trading-card-stores=1.
- grayton-beach-fl: appliance-repair=4, auto-body-collision=1, auto-mechanics=0, carpet-cleaning=0, concrete=1, fence-builders=1, flooring=2, generator-installation=1, gutters=2, handyman=3, hurricane-shutters-impact-windows=0, insulation=2, irrigation-sprinkler-repair=4, junk-removal=0, kitchen-bath-remodeling=2, locksmith=2, marine-services=0, mobile-auto-detailing=4, movers=0, pest-control=2, pool-installation=1, pool-service=1, screen-enclosures-pool-cages=1, septic-services=1, towing=0, trading-card-stores=0, tree-service=2, water-damage-mold-remediation=0, window-tinting=0.

## Coastal pools and windows continuation — 2026-09-29, run 1828

- Baseline 4ff7a51; prepared 35 placements across 11 approved cities using explicit official city and service evidence. Source records and exclusions: `reports/verified-coastal-pools-windows-2026-09-29.json`.
- All 5,584 existing seed records unchanged by complete-value comparison; 5,619 total. Unique IDs and canonical domain/city/category checks passed. No paid API calls, billing, claimed records or application code changes.
- Expected six more pairs reach five, including pool installation and hurricane protection in Destin, Fort Walton Beach and Crestview. Grayton Beach gains first carpet cleaning and water-damage entries.
- Publication and live verification pending. Refresh current main before subsequent writes.
