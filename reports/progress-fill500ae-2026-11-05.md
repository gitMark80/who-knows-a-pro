# Fill 500ae — published checkpoint, target unfinished

Fixed run-start baseline: `86c1066f06546c1e8e7dc7ff5d913c73317cff38`. Target: 500 distinct NEW businesses, counted once across the website only after qualification, publication and live verification.

## Actual published result

**62 distinct NEW businesses are fully qualified, published and live verified. Exact shortfall against 500: 438.** A total of 63 new businesses were committed and deployed. All Safe Security & Lock initially passed, but a later official-site recheck hit a persistent robot screen; it remains publicly listed and is excluded from the current completed count pending reconfirmation.

**83 new city/category placements are public:** 80 from new businesses and three from previously listed businesses (Land’s Lawn and Pest, Southern Tide Pools and Splash Pools of NWFL). Of these, 82 currently pass all checks: 79 from new businesses plus three from existing businesses. Repeated city placements do not increase the new-business count.

Data commits: `222c6a08eebe23a1e04f74511de15e27683c4140`, `1754a72826158cc6f473a787086ec297c3bd699b`, `946a9e479fa48630f402edba416bacc8fcd77472`, and final data commit `15a6bed72d7565a14cce516dd7f958160ae38fce`. Final data deployment: `dpl_G1Jm7RjoL2pJbkFRJGh5bo9gqWZU`, production READY. All 83 cards across 19 affected category pages and all 66 business profiles passed public visibility, official-link and contextual profile-link checks. Official destination/content evidence is recorded separately; a rendering record alone is not qualification.

## Additions and remaining displayed gaps

| City/category | New placements | Displayed after | Displayed deficit |
|---|---:|---:|---:|
| pensacola-fl / pest-control | 1 | 15 | 5 |
| destin-fl / pool-service | 2 | 20 | 0 |
| fort-walton-beach-fl / pest-control | 1 | 12 | 8 |
| fort-walton-beach-fl / pool-service | 1 | 14 | 6 |
| panama-city-beach-fl / pool-service | 1 | 15 | 5 |
| crestview-fl / pest-control | 1 | 11 | 9 |
| crestview-fl / garage-door-repair | 1 | 14 | 6 |
| crestview-fl / pool-service | 3 | 13 | 7 |
| orlando-fl / locksmith | 14 | 14 | 6 |
| st-petersburg-fl / locksmith | 8 | 9 | 11 |
| clearwater-fl / locksmith | 10 | 11 | 9 |
| miami-fl / locksmith | 8 | 10 | 10 |
| fort-lauderdale-fl / locksmith | 12 | 13 | 7 |
| west-palm-beach-fl / locksmith | 14 | 14 | 6 |
| west-palm-beach-fl / appliance-repair | 1 | 11 | 9 |
| panama-city-fl / electrical | 1 | 19 | 1 |
| panama-city-fl / pest-control | 1 | 8 | 12 |
| panama-city-fl / garage-door-repair | 1 | 15 | 5 |
| panama-city-fl / pool-service | 2 | 13 | 7 |

## Coverage and validation

Current catalogs: 40 active cities × 30 visible categories = 1,200 public pages; all ten hidden categories remain hidden. Grayton Beach remains active. No cities or categories were created, activated or renamed.

157 pages display 20 or more distinct profiles, 1,043 display fewer than 20, and no page is display-empty. Displayed deficit is 11,378, down 83 from baseline 11,461. Destin pool service now displays 20. **These displayed counts are not certified qualifying counts.** Historical qualifying counts, the number of verified pages at or below 20, qualifying-empty pages, and the exact qualifying deficit remain unknown pending a full placement-level audit. The CSV records all 1,200 page counts and unknown historical qualification, not only this run’s affected pages.

All 14,051 baseline placements are preserved byte-for-value in the generated directory. JSON/schema, active-city and visible-category slugs, normalized domains/names, aliases, exclusion rules, per-placement qualification evidence and underfilled-page validation passed. The production build passed; final data-only changes passed the importer validation and deployed successfully. Existing import qualification checks already require residential, direct-provider, official-identity and specific geographic evidence. No five-listing cap affects this supplemental import, and no import logic change was necessary.

## Research, blockers and historical review

66 business identities are represented in this run’s published source, including three previously listed businesses. 21 unpublished candidates or proposed placements remain pending; six candidates were rejected; one qualified candidate has no suitable underfilled visible page. 51 existing-candidate names were identified and not counted as new; these discovery records may overlap the three published existing-business placements and must not be summed as distinct new businesses. No additions await deployment. One published new business awaits official-site reconfirmation.

Official source content was manually reviewed for actual residential services, local coverage and business identity. Source checks record final destinations, status, titles and hashes. Browser checks resolved simple-fetch failures for Access, IBS, Kwikey, Arrow, CN USA, The Lock Doc, Pro Locksmith, Sunshine Locksmith Team and E2 Anderson. SunState’s official site remains blocked, so it was not published. All Safe’s later robot screen leaves one published record pending; no challenge was solved or bypassed. AE Locksmith Tampa already exists; its proposed extra placement is held because coverage is explicitly limited to North Clearwater. No city-wide coverage is inferred.

Other pending reasons include alias/ownership uncertainty, insufficient residential service evidence, inaccessible official sites, intermediary status and missing official websites. Crabby’s supported handyman category is hidden and its supported painting/flooring pages already display 20+, so it was not published. Fort Walton Beach Insulation disclosed referral terms; Davis Exterminators was acquired by Arrow; Strongbox and Lou’s raised national-brand concerns and were excluded. No paid research, Foursquare credits, banned listing sources, purchases or outreach were used.

Historical A to Z Appliance’s directory-style URL/identity mismatch and possible duplicate Pinckard identities remain flagged without visibility changes. Retail Fix It’s official commercial-retail maintenance page was rechecked: it describes commercial clients and a nationwide provider network, not qualifying local residential locksmith work. It remains excluded by the separately authorized prior national-brand cleanup. Earlier unsupported residential/geographic/network flags remain in `reports/historical-qualification-flags-2026-11-03.json`; this run did not delete or hide historical records or certify questionable ones because they render.

The target was not reached within this execution session’s research and verification capacity. Publishing access worked. This is not evidence that 438 qualifying businesses cannot be found, and it is not a claim of completed coverage. Pending source and identity checks were not bypassed to meet a number.

## Resume safely

Read current main, active runs, progress and catalogs first; never restore the run-start snapshot over newer work. Main was rechecked before each data publication and updated with compare-and-swap. Resume only underfilled public pages, prioritizing Destin, Fort Walton Beach, Crestview and Panama City, then closest-to-Pensacola gaps. Keep Panama City and Panama City Beach separate. Preserve local/regional-only eligibility and national-brand exclusions.

The source JSON and evidence ledger hold business and placement keys, URLs, dates, residential/provider/geographic evidence, pending candidates, disposition and publication status. The validation JSON records added generated rows and baseline preservation. The live report records all final public checks. Recover the fixed baseline from its commit if `/tmp/fill500ae-baseline-directory.json` is absent; do not use a newer baseline to inflate this run’s new-business total. For a future run, establish a new fixed run-start baseline from latest main. Full qualifying page completion remains unfinished; do not pause the automation as complete.
