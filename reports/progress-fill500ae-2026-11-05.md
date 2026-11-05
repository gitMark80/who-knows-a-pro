# Fill 500ae — local and regional businesses

Fixed run-start baseline: `86c1066f06546c1e8e7dc7ff5d913c73317cff38`. Target: 500 distinct NEW businesses, counted once across the website only after publication and live qualification checks.

## Second checkpoint prepared

The first checkpoint, `222c6a08eebe23a1e04f74511de15e27683c4140`, published 23 new businesses and 27 placements. All listing/profile checks passed. A later official-site recheck of All Safe Security & Lock hit a robot challenge, so the conservative current all-checks-complete total is 22, with one published business pending website reconfirmation. Current completed-business shortfall: 478.

This checkpoint prepares another 25 new businesses and 28 placements. Cumulative prepared/published source: 48 new businesses, 55 placements (54 from new businesses; one from the previously listed Land's Lawn and Pest). Do not count the second checkpoint until deployed and live verified.

| City/category | Added placements vs fixed baseline | Displayed after | Displayed deficit |
|---|---:|---:|---:|
| fort-walton-beach-fl / pest-control | 1 | 12 | 8 |
| crestview-fl / pest-control | 1 | 11 | 9 |
| crestview-fl / garage-door-repair | 1 | 14 | 6 |
| crestview-fl / pool-service | 1 | 11 | 9 |
| orlando-fl / locksmith | 14 | 14 | 6 |
| miami-fl / locksmith | 8 | 10 | 10 |
| fort-lauderdale-fl / locksmith | 12 | 13 | 7 |
| west-palm-beach-fl / locksmith | 14 | 14 | 6 |
| west-palm-beach-fl / appliance-repair | 1 | 11 | 9 |
| panama-city-fl / pest-control | 1 | 8 | 12 |
| panama-city-fl / garage-door-repair | 1 | 15 | 5 |

## Coverage and validation

Current catalog: 40 active cities × 30 visible categories = 1,200 public pages. Ten hidden categories, including handyman, remain hidden. Grayton Beach remains active. No catalog changes. Prepared counts: 156 pages display 20+, 1,044 display fewer than 20, zero empty pages, displayed deficit 11,406 (baseline 11,461). These are displayed distinct-profile counts, not certified qualifying counts. Historical qualifying counts, verified-at-20 pages, qualifying-empty pages and the exact qualifying deficit remain unknown pending a full residential/category/local/identity audit.

All 14,051 baseline placements are preserved byte-for-value in the generated directory. JSON/schema, active and visible slugs, normalized domains/names, identity aliases, per-placement evidence, exclusion rules and underfilled-page checks pass. The production build passed. No import logic change was needed: the existing qualification gate requires residential, direct-provider, official-identity and specific local evidence; no five-listing cap affects this supplemental import.

## Evidence and blockers

Official source pages were manually reviewed and destination/status checks saved separately. HTTP success alone was never treated as qualification. Browser checks resolve plain-fetch failures for Access, IBS, Kwikey, Arrow, CN USA, The Lock Doc and Pro Locksmith. Pro Locksmith's initial robot screen resolved after one normal reload; its West Palm Beach coverage is explicitly commercial-only and was not added. SunState's challenge remains, so that unpublished candidate stays pending. All Safe's later challenge leaves one published business pending recheck; its public visibility is unchanged. No challenge was solved or bypassed.

The evidence ledger preserves pending identities, rejected candidates, existing-business duplicates and qualified candidates without an underfilled visible page. Crabby's has a valid local residential website, but handyman is hidden and its supported flooring/painting pages already display 20+; it is not published. Fort Walton Beach Insulation's terms disclose a referral service, so it is rejected. Davis Exterminators was acquired by Arrow and is not added as a new independent brand. No new national brands, paid research, Foursquare usage or outreach.

Historical review flags added for the A to Z Appliance directory-style URL/identity mismatch and possible Pinckard duplicate identities. Existing historical visibility is unchanged. Retail Fix It remains excluded by the prior authorized national-brand cleanup; its earlier unsupported residential/geographic/network flags remain in `reports/historical-qualification-flags-2026-11-03.json`.

## Resume safely

Read current main, active runs and catalogs first. Never restore this baseline over newer work. The source JSON and evidence ledger contain business/placement keys; validation JSON contains exact added generated rows; the CSV contains all 1,200 page deficits. Main was rechecked before this checkpoint and still points to the first data commit. Publish with compare-and-swap, then verify every new public placement/profile and intended official destination. Continue underfilled priority pages first. The 500-new-business target and full qualifying page completion remain unfinished.
