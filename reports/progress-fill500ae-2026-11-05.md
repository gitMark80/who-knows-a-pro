# Fill 500ae — local and regional businesses

Fixed run-start baseline: `86c1066f06546c1e8e7dc7ff5d913c73317cff38`. Latest requested target: 500 distinct NEW businesses, counted once across the website after publication and live qualification checks.

## Fourth checkpoint prepared

The third data checkpoint, `946a9e479fa48630f402edba416bacc8fcd77472`, is deployed in `dpl_6TRdATUES4KCnQEbJxG3xzGfy7n1`. All 79 public placements and 64 profiles passed live checks. Of 62 new businesses published, 61 currently pass all checks; All Safe remains pending official-site reconfirmation.

The fourth checkpoint adds Phillips Pool Service to three explicit residential service areas and one Panama City placement for already-listed Splash Pools of NWFL. Cumulative prepared totals: 63 distinct new businesses; 83 placements, split into 80 from new businesses and three from existing businesses. Do not count these four additional placements until deployed and live verified.

| City/category | Added placements vs fixed baseline | Displayed after | Displayed deficit |
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

Current catalog: 40 active cities × 30 visible categories = 1,200 public pages. Ten hidden categories, including handyman, remain hidden. Grayton Beach remains active. No catalog changes. Current prepared counts: 157 pages display 20+, 1,043 display fewer than 20, zero empty pages, displayed deficit 11,378 (baseline 11,461). These are displayed distinct-profile counts, not certified qualifying counts. Historical qualifying counts, verified-at-20 pages, qualifying-empty pages and the exact qualifying deficit remain unknown pending a full residential/category/local/identity audit.

All 14,051 baseline placements are preserved byte-for-value in the generated directory. JSON/schema, active and visible slugs, normalized domains/names, identity aliases, per-placement evidence, exclusion rules and underfilled-page checks pass. The production build passed. No import logic change was needed: the existing qualification gate requires residential, direct-provider, official-identity and specific local evidence; no five-listing cap affects this supplemental import.

## Evidence and blockers

Official source pages were manually reviewed and destination/status checks saved separately. HTTP success alone was never treated as qualification. Browser checks resolve plain-fetch failures for Access, IBS, Kwikey, Arrow, CN USA, The Lock Doc and Pro Locksmith. Pro Locksmith's initial robot screen resolved after one normal reload; its West Palm Beach coverage is explicitly commercial-only and was not added. SunState's challenge remains, so that unpublished candidate stays pending. All Safe's later challenge leaves one published business pending recheck; its public visibility is unchanged. No challenge was solved or bypassed.

The evidence ledger preserves pending identities, rejected candidates, existing-business duplicates and qualified candidates without an underfilled visible page. Crabby's has a valid local residential website, but handyman is hidden and its supported flooring/painting pages already display 20+; it is not published. Fort Walton Beach Insulation's terms disclose a referral service, so it is rejected. Davis Exterminators was acquired by Arrow and is not added as a new independent brand. No new national brands, paid research, Foursquare usage or outreach.

Historical review flags added for the A to Z Appliance directory-style URL/identity mismatch and possible Pinckard duplicate identities. Existing historical visibility is unchanged. Retail Fix It remains excluded by the prior authorized national-brand cleanup; its earlier unsupported residential/geographic/network flags remain in `reports/historical-qualification-flags-2026-11-03.json`.

## Resume safely

Read current main, active runs and catalogs first. Never restore this baseline over newer work. The source JSON and evidence ledger contain business/placement keys; validation JSON contains exact added generated rows; the CSV contains all 1,200 page deficits. Main was rechecked before this checkpoint and still points to the third data commit, `946a9e479fa48630f402edba416bacc8fcd77472`. Publish with compare-and-swap, then verify every new public placement/profile and intended official destination. Continue underfilled priority pages first. The 500-new-business target and full qualifying page completion remain unfinished.

A current review of Retail Fix It’s official commercial-retail maintenance page again found commercial client services through a nationwide provider network, without qualifying local residential evidence. AE Locksmith Tampa is already listed; a possible North Clearwater placement is held because coverage is explicitly limited to the north part of the city. J&J and WittCo were existing businesses and were not counted as new.
