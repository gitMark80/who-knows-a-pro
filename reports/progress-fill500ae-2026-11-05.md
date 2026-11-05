# Fill 500ae — local and regional businesses

Fixed run baseline: `86c1066f06546c1e8e7dc7ff5d913c73317cff38`. Target: **500 distinct new businesses**, each counted once across the website after publication and live verification.

## Checkpoint: prepared, awaiting publication

23 new businesses and 27 new placements are prepared. Of those placements, 26 belong to new businesses and one belongs to the previously listed Land's Lawn and Pest. Completed live-verified additions are zero at this preparation checkpoint; the run shortfall is 500 until publication is confirmed.

| City/category | Added placements | Displayed after | Displayed deficit |
|---|---:|---:|---:|
| Orlando / locksmith | 9 | 9 | 11 |
| West Palm Beach / locksmith | 11 | 11 | 9 |
| Fort Lauderdale / locksmith | 3 | 4 | 16 |
| West Palm Beach / appliance repair | 1 | 11 | 9 |
| Crestview / garage door repair | 1 | 14 | 6 |
| Panama City / garage door repair | 1 | 15 | 5 |
| Panama City / pest control | 1 | 8 | 12 |

Catalog: 40 active cities, 30 visible categories, 1,200 public pages; ten hidden categories preserved. Grayton Beach remains active. No catalog changes were made. Displayed baseline: 156 pages at 20+, 1,044 below 20, two empty, deficit 11,461. Prepared: 156 at 20+, 1,044 below 20, no empty pages, deficit 11,434. The exact qualifying historical coverage and deficit remain **unknown**; displayed rows are not certification of residential/local eligibility.

## Evidence, checks and blockers

- The ledger records residential services, direct-provider status, city or county coverage, official identity, URLs and timestamps. County evidence for Access and All Safe is tied to government municipality lists. No nearby-city or statewide inference was used.
- New identity checks cover baseline names/domains and alternate domains. YDG variants and Handyman All Around variants count once. No national brands were added.
- All 14,051 baseline placements are preserved unchanged. JSON, active/visible slugs, existing/new identity handling, placement deduplication, evidence gate and page caps passed. The production build passed.
- The source checker returned 200 for 28/34 source URLs. The other six URLs belong to four sites. A full browser independently opened Access, IBS, Kwikey and Arrow at their intended official URLs and visibly confirmed their identity and residential/local content. No safety interstitial was bypassed.
- The existing import qualification gate was inspected. Candidates lacking residential, direct-provider, identity or specific-geography evidence are rejected. No old five-listing cap affects this supplemental import.
- Three pending identities remain: Fort Walton Locksmith (possible Locksmith Chick identity overlap); Discount Lock (explicit residential scope not established); Advanced Garage Door Repair (shared-brand/domain clues and inaccessible Crestview source). They are not published or counted.
- Sixteen researched existing businesses are listed in the ledger and do not count as new. Priority-city searches repeatedly found these duplicates; no unsupported coverage was added to compensate.
- Retail Fix It remains excluded by the earlier, separately authorized national-brand cleanup. Its historical unsupported-residential/geography/network flags remain in the prior audit. This run changes no historical visibility, claims, submissions or billing data.

## Resumption

Use current main, not this workspace snapshot. The evidence ledger and supplemental data are keyed by business and placement; validation includes exact generated additions; the CSV lists all 1,200 page counts and deficits. Recheck active automation/workflows and main before any further write. Current main was checked at preparation and still matches the fixed baseline. Continue researching underfilled priority pages and then other lowest-count pages. Do not count this checkpoint's 23 businesses until their production listings and official destinations pass live verification.
