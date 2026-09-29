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

### Coastal pools and windows publication confirmed

- PR #6 merged as `02dee5358573ff1c8e95ea00f10b85599783937a`; Vercel production status succeeded. All 35 additions verified live across 24 public category pages with profile and official website links. Evidence: `reports/live-coastal-pools-windows-2026-09-29.json`.
- Preserved concurrent analytics commit d6349f3. TypeScript and full existing-record preservation checks passed. All 5,584 prior records unchanged; 5,619 total. No paid API calls.
- Next: continue actual remaining gaps in Perdido Key, Grayton Beach and surrounding cities. Pace/Milton card-store shortfalls still require real official websites. Emerald Coast Pools and HydraKlean are deferred pending accessible source pages. Do not fill shortages with referral pages or decorative-shutter companies.

- Complete post-publication audit: **580/1,600 pairs meet five; 1,020 below; 77 empty; 3,766 missing placements.** Six additional pairs completed. A temporary Montgomery HTTP 502 passed on retry. Fresh CSV saved; counts indicate coverage, not independent re-verification of historical entries.

Remaining closest gaps after this batch:

- pace-fl: trading-card-stores=1.
- milton-fl: trading-card-stores=3.
- perdido-key-fl: auto-body-collision=1, garage-door-repair=4, junk-removal=4, mobile-auto-detailing=4, septic-services=4, towing=2.
- destin-fl: auto-body-collision=1, towing=3, trading-card-stores=1, window-tinting=4.
- fort-walton-beach-fl: auto-body-collision=1, screen-enclosures-pool-cages=3, trading-card-stores=1.
- crestview-fl: auto-body-collision=2, flooring=3, generator-installation=4, handyman=4, screen-enclosures-pool-cages=4, towing=3, trading-card-stores=1.
- grayton-beach-fl: appliance-repair=4, auto-body-collision=1, auto-mechanics=0, carpet-cleaning=2, concrete=1, fence-builders=1, flooring=2, generator-installation=1, gutters=2, handyman=3, hurricane-shutters-impact-windows=2, insulation=2, irrigation-sprinkler-repair=4, junk-removal=0, kitchen-bath-remodeling=2, locksmith=2, marine-services=0, mobile-auto-detailing=4, movers=0, pest-control=2, pool-installation=2, pool-service=1, screen-enclosures-pool-cages=2, septic-services=1, towing=0, trading-card-stores=0, tree-service=2, water-damage-mold-remediation=2, window-tinting=0.

## Grayton Beach and Crestview continuation — 2026-09-29, run 1847

- Baseline 770b137 includes concurrent private business-results dashboards and referral tracking. Prepared 44 verified placements across five approved cities; official sources, service limits and exclusions saved in `reports/verified-grayton-crestview-2026-09-29.json`.
- All 5,619 existing generated records unchanged by full-value comparison; 5,663 total. IDs and new canonical domain/city/category keys unique. No paid API calls; no database, billing, claims, tracking or application code changes.
- Expected 9 additional completed city/category pairs. Publication/live verification pending. Refresh main before future writes.

### Grayton/Crestview publication

- PR #7 merged as `52973e33642c51691428904451f246b2d12e902b`. Vercel production status succeeded. All 44 new placements verified live across 24 category pages, with profile and official website links. Initial check preceded deployment and was repeated after success. Evidence: `reports/live-grayton-crestview-2026-09-29.json`.
- TypeScript check passed using the current analytics dependency cache; all 5,619 prior generated records unchanged. No paid API calls. Full live coverage audit follows.

- Complete live audit: **589/1,600 pairs meet five; 1,011 below; 75 empty; 3,722 missing placements.** Nine additional pairs completed. Fairhope returned temporary HTTP 502 twice and then passed. Counts indicate coverage, not independent re-verification of historical entries.

Next run: refresh main and open PRs, preserve concurrent analytics/results changes, and continue nearby gaps using explicit official coverage. Remaining priority gaps:

- pace-fl: trading-card-stores=1.
- milton-fl: trading-card-stores=3.
- perdido-key-fl: auto-body-collision=1, garage-door-repair=4, junk-removal=4, mobile-auto-detailing=4, septic-services=4, towing=2.
- destin-fl: auto-body-collision=1, towing=3, trading-card-stores=1, window-tinting=4.
- fort-walton-beach-fl: auto-body-collision=1, trading-card-stores=1.
- crestview-fl: auto-body-collision=2, handyman=4, towing=3, trading-card-stores=1.
- grayton-beach-fl: appliance-repair=4, auto-body-collision=1, auto-mechanics=0, carpet-cleaning=2, concrete=2, fence-builders=3, generator-installation=2, gutters=4, handyman=4, hurricane-shutters-impact-windows=2, insulation=2, irrigation-sprinkler-repair=4, kitchen-bath-remodeling=2, locksmith=2, marine-services=0, mobile-auto-detailing=4, movers=2, pest-control=2, pool-installation=2, pool-service=1, screen-enclosures-pool-cages=3, septic-services=1, towing=0, trading-card-stores=0, water-damage-mold-remediation=2, window-tinting=0.
- panama-city-beach-fl: appliance-repair=2, auto-body-collision=1, auto-mechanics=1, carpet-cleaning=1, concrete=2, fence-builders=2, garage-door-repair=2, generator-installation=3, gutters=1, handyman=3, home-inspections=2, house-cleaning=2, hurricane-shutters-impact-windows=3, hvac=3, insulation=2, irrigation-sprinkler-repair=0, kitchen-bath-remodeling=3, landscaping=2, lawn-care=2, locksmith=4, marine-services=1, mobile-auto-detailing=0, movers=4, painting=3, pest-control=1, plumbing=3, pool-installation=2, pool-service=1, pressure-washing=2, roofing=2, screen-enclosures-pool-cages=3, septic-services=1, towing=2, trading-card-stores=1, tree-service=3, water-damage-mold-remediation=2, window-tinting=1.
- panama-city-fl: appliance-repair=1, auto-body-collision=0, concrete=2, flooring=3, generator-installation=2, gutters=0, handyman=0, hurricane-shutters-impact-windows=1, insulation=1, irrigation-sprinkler-repair=3, kitchen-bath-remodeling=0, locksmith=0, movers=2, painting=2, pool-installation=0, pool-service=1, screen-enclosures-pool-cages=4, septic-services=1, trading-card-stores=0, window-tinting=0.

## Coastal collision, pools and home services — 2026-09-29

- Refreshed main at `b984b01579110c6b43701777fc7a69c3060f11e6`. Every local tracked file was matched against GitHub's current tree before editing; refreshed the coverage CSV from that exact commit. No open PRs. Existing local worktrees left untouched.
- Prepared 35 new placements across seven approved cities: Grayton Beach 17, Panama City Beach 6, Fort Walton Beach 4, Crestview 3, Panama City 3, Foley 1, Dothan 1. Official URLs, verification dates, service limitations and rejected candidates: `reports/verified-coastal-auto-pools-2026-09-29.json`.
- Reused cached artifact 11029098206 from workflow run 36559444099 before research. No new Foursquare or other paid API requests. Cached results included unrelated shops, parts retailers and duplicate identities; those were excluded.
- All 5,663 prior generated records unchanged by complete-value comparison; total 5,698. New IDs and canonical domain/city/category keys unique. TypeScript and production build passed; final identity-only normalization retained the existing Emerald Coast Carpet Floor Window Cleaning Services name/site after the alternate website matched phone 850-460-0580.
- Five additional pairs expected to meet five after publication: Crestview auto body, Fort Walton Beach auto body, Grayton Beach gutters, handyman and pool service. This would bring coverage to 594/1,600 if live counts match the unchanged baseline. This is a projection, not a live audit.
- Publication status: prepared for established GitHub PR/Vercel process; not yet committed or confirmed live when this section was written. No paid/claimed, database, billing, analytics, application or catalog changes.
- Verification access limitation: direct public-site requests timed out in this run; web retrieval could not access whoknowsapro.com. Connected Vercel access returned 403 for Restless Faith Media scope (`restless-faith-media`). GitHub commit deployment statuses remain readable. Do not claim a new full live audit or live placements without successful public checks.
- Pace/Milton card-store shortages remain honest gaps; fresh discovery only found already-listed stores, coin dealers, or unrelated businesses. Navarre remains complete by last recorded live count.
- Next: publish through the existing authorized PR process, inspect GitHub Vercel status, and retry public live checks. Refresh main before further work. Continue nearby gaps; unresolved Grayton categories include mechanics, appliance repair, carpet cleaning, concrete, fences, generators, hurricane protection, insulation, irrigation, locksmiths, marine services, mobile detailing, movers, pest control, pool construction, screen enclosures, septic, towing, card stores, restoration and tinting. No city outside the approved catalog added; Pensacola Beach not added.

### Coastal collision, pools and home services publication

- PR #8 (https://github.com/gitMark80/who-knows-a-pro/pull/8) merged as `eacb202ff33465e5ec8ab06f50f81391713b072b`. All 35 placements are committed on main; Vercel production status reported success at 2026-09-29 19:18:43 UTC. Deployment: https://vercel.com/gitmark80s-projects/who-knows-a-pro/CGUBEKuKDfWihc5DL2gPXrFfz3sn . Preview deployment also passed before merge.
- Live confirmation remains pending: public requests again failed at proxy CONNECT, and the connected Vercel account cannot access Restless Faith Media. Deployment success is not a page-level coverage audit. The previous CSV and confirmed 589/1,600 coverage remain unchanged; 594/1,600 is still only projected. Do not count these 35 as confirmed live until public page/profile/website checks succeed.
- Next run: first refresh main/open PRs and verify these 35 placements from the evidence report on their public category pages, then rerun the full live audit when access works. Continue official-site research and additions meanwhile; useful authorized work remains, so continuation is not paused for this verification-only limitation.
- Additional unimported candidates for research: Walmart Fort Walton Beach #919 official local game page https://www.walmart.com/store/919-fort-walton-beach-fl/game-store confirms 748 Beal Pkwy NW; GameStop SWM Crestview https://www.gamestop.com/store/us/fl/crestview/6710/swm-crestview-gamestop confirms 3381 S Ferdon Blvd. Both retrieved 2026-09-29. Their global navigation advertises trading cards, but establish local card offerings and category suitability before adding; no placement was made on navigation evidence alone.
- Existing records, paid/claimed data and application behavior preserved. No paid API calls or purchases. The overall task remains incomplete; priority Pace and Milton card-store shortfalls remain documented rather than fabricated.

## Grayton core services publication — 2026-09-29

- Refreshed main at `eb6f0e57f8dcfa6fdb6be54bb3ac8c07629d8aa2` and confirmed no open PRs before writing. Re-read the current instructions, catalog, seed, research artifacts, coverage reports and checkpoint. The cached Foursquare artifact did not provide usable additional candidates for these targeted gaps; no paid API request was made.
- Added 45 official-site-verified source records expanding to 59 city/category placements. PR #9 (https://github.com/gitMark80/who-knows-a-pro/pull/9) merged as `44931e393c2c17b1a3277638cf8f3269efd5d514`; preview and production Vercel statuses succeeded.
- Evidence: `reports/verified-grayton-core-services-2026-09-29.json`. Validation: `reports/validation-grayton-core-services-2026-09-29.json`. Every added source record includes an official source URL, verification date, category evidence and actual location or explicitly supported service area. Missing contact fields remain omitted.
- Duplicate control: Gulf Coast Roadside Assistance and Panama City Roadside share phone 850-328-3898 and were counted once. Existing identities/canonical websites were retained for service-area extensions. No new city/category/domain duplicate was introduced; paid and claimed records were not changed.
- Generated seed now contains 5,757 placements and 2,521 unique profiles. Validated coverage is 614/1,600 city/category pages at five or more, up from 594 before this batch. Twenty pages newly reached the target: 17 in Grayton Beach, two in Panama City Beach and one in Panama City.
- Browser verification after production deployment passed on all 20 newly completed pages. It also passed on the five PR #8 pages whose public verification was previously pending (Crestview and Fort Walton Beach auto body; Grayton Beach gutters, handyman and pool service). Thus the cumulative completed-page count is 614/1,600 from the last full 589-page audit plus 25 individually verified completions; this was not a fresh 1,600-page regression audit.
- Production build passed. Repository-wide lint remains blocked by 11 pre-existing errors in `app/admin/page.tsx` and `scripts/verify-private-billing-fixture.cjs`; this directory-only batch did not alter those files.
- Grayton Beach now has 34/40 categories at five or more. Honest remaining gaps: trading-card-stores=0, auto-body-collision=1, pest-control=2, fence-builders=3, irrigation-sprinkler-repair=4 and mobile-auto-detailing=4.
- Priority-city status remains pace-fl trading-card-stores=1, milton-fl trading-card-stores=3, and navarre-fl all 40 categories at five or more. Fresh official-site research still did not justify additional Pace or Milton card-store entries; no nearby store was copied into those cities without location/service evidence.
- Other useful gains: Panama City Beach movers and screen enclosures reached five; Panama City screen enclosures reached six. Current Panama City Beach seed coverage is 5/40 pages and Panama City is 21/40, so substantial legitimate research remains.
- No Google Maps, Google Places, Yelp or Angi sourcing; no paid API calls or purchases; no city/catalog/application-code changes. Grayton Beach remains approved and Pensacola Beach was not added.

Next actions:

1. Refresh main, open PRs, current seed and reports before writing. Continue genuine Pace/Milton card-store research, then the six remaining Grayton gaps; document shortfalls rather than padding them.
2. Work outward through Panama City Beach and Panama City, prioritizing categories already at four, then nearby categories at two or three with explicit official location/service-area support.
3. Reuse cached candidate artifacts before new sourcing; preserve deduplication, verification dates, claimed/paid listings and generated reports. No new paid Foursquare/API request without an explicit remaining budget.
4. A future full public audit should recheck all 1,600 pages when practical; 614/1,600 is supported by the last full audit plus individually verified completed pages, not by a new full-site regression sweep.
