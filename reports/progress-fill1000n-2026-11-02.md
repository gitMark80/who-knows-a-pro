# Directory fill1000n — 2026-11-02

Status: prepared and validated; publication and live verification pending.

This run targets 1,000 newly published city/category placements, separate from the recurring 500-placement run target and the completion threshold of 20 qualifying businesses per active combination.

- Latest baseline: `81a33ea422becaf327af895a3d638e1d205245c1`. Research began at `0a147d3c2dc1aab29397c7f9731b20720dcfdd9e`; the intervening profile-layout commit was fast-forwarded and preserved.
- The scheduled fill's last recorded run `d25b0685-88e4-8321-96e7-a9d823e1c07e` is completed. No active scheduled fill was reported at the pre-publication check. Main will be checked again and updated with an expected-head lease.
- Current catalog: 40 active cities × 30 visible categories = 1,200 combinations. Ten hidden categories remain untouched. Grayton Beach is active; Panama City and Panama City Beach remain separate.
- Prepared: 1,000 placements, 241 appended evidence records, 157 business domains. These are placements across cities/categories, not 1,000 unique companies.
- Preservation validation: all 20,748 prior generated listings and 2,680 raw evidence records unchanged; no deletions or user/claimed/paid-record edits.
- Before: 596 combinations at 20+, 604 below 20, count-based deficit 4,638.
- Prepared result: 655 combinations at 20+, 545 below 20, deficit 3,638, zero empty combinations; 59 additional combinations reach 20.
- Historical counts are not a fresh audit of every existing business's category relevance, service area, identity or website. Directory-wide qualifying completion is not claimed.

## Evidence and validation

Each selected addition has an official source URL, retrieval time and concise category/local-coverage evidence. Candidate records also retain explicit residential/homeowner evidence for home services or direct consumer evidence for automotive/marine services. Unknown contact fields are omitted. Working official pages were retrieved through authorized public web research; no paid API calls, Foursquare credits, excluded listing sources or business outreach were used.

Identity checks include normalized domains, renamed/alternate brands and parent-company overlap. Duplicate examples and verification failures are recorded in `research-holds-fill1000n-2026-11-02.json`. The new Alabama Superior Pools entry is geographically qualified in its name to keep the existing Atlanta company's public profile slug unchanged.

The existing import expands appended source records into distinct placements and selects only currently incomplete pairs, stopping each at 20. There is no five-listing cap blocking this run. JSON, schema fields, valid catalog slugs, unique IDs/slugs/domain placements, expansion counts and all prior records passed validation. Production build, TypeScript check, lint and diff whitespace checks passed. Remote CI and deployment results will be recorded with publication.

## Additions by city

| City slug | Prepared additions |
| --- | ---: |
| panama-city-fl | 9 |
| crestview-fl | 11 |
| fort-walton-beach-fl | 4 |
| destin-fl | 4 |
| pensacola-fl | 11 |
| gulf-breeze-fl | 7 |
| pace-fl | 14 |
| perdido-key-fl | 8 |
| milton-fl | 13 |
| navarre-fl | 5 |
| orange-beach-al | 34 |
| gulf-shores-al | 76 |
| foley-al | 75 |
| fairhope-al | 72 |
| daphne-al | 76 |
| grayton-beach-fl | 11 |
| mobile-al | 34 |
| panama-city-beach-fl | 13 |
| biloxi-ms | 30 |
| gulfport-ms | 33 |
| dothan-al | 15 |
| montgomery-al | 20 |
| tallahassee-fl | 17 |
| auburn-al | 15 |
| new-orleans-la | 39 |
| baton-rouge-la | 34 |
| birmingham-al | 21 |
| huntsville-al | 19 |
| atlanta-ga | 18 |
| jacksonville-fl | 27 |
| tampa-fl | 16 |
| clearwater-fl | 19 |
| st-petersburg-fl | 19 |
| orlando-fl | 31 |
| sarasota-fl | 24 |
| fort-myers-fl | 28 |
| naples-fl | 20 |
| west-palm-beach-fl | 21 |
| fort-lauderdale-fl | 25 |
| miami-fl | 32 |

## Resume

Use the current main branch and the latest live audit before any new write. The candidate checkpoint contains 236 research entries; count only the 1,000 selected placements if publication and live verification succeed. At preparation, there are no unselected eligible placements in this pool below the 20-per-pair cap.

Next: publish the append-only source and evidence files, await production deployment/CI, verify every added card and affected business profile, audit all 1,200 live counts, and commit the actual result. Continue with lowest-count priority combinations in Destin, Fort Walton Beach, Crestview and Panama City, then outward from Pensacola. Review hold records before reusing candidates; timeouts and generic nationwide claims are not evidence of genuine market shortages.

