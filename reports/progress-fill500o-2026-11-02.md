# Directory fill500o — 2026-11-02

Status: published and live-verified. Run target: 500/500 placements; shortfall: 0.

Source changes are in [`400dbf97924902fe366c3921cae3e9cac1dc797f`](https://github.com/gitMark80/who-knows-a-pro/commit/400dbf97924902fe366c3921cae3e9cac1dc797f), with the byte-identical large-JSON transfer correction in [`8abbaeca7f95aef6f8dd68c263fd963318a8b456`](https://github.com/gitMark80/who-knows-a-pro/commit/8abbaeca7f95aef6f8dd68c263fd963318a8b456). Production deployment `dpl_6FF5mGwSEfiKmWP3q9eYypG6Syc9` is READY. [GitHub CI passed](https://github.com/gitMark80/who-knows-a-pro/actions/runs/41558186106), including type check, lint, production build and integration suites.

At 2026-11-03 01:15 UTC, all 500 added listing cards passed across 150 live city/category pages, including official-domain links and preserved city/category context in profile URLs. All 23 affected profiles passed official-link checks. A fresh audit of all 1,200 active combinations exactly matched the prepared counts: 682 at 20+, 518 below 20, deficit 3,138, zero empty; the live count increase is exactly 500.

- Starting main: `225b720567a4a75bc7edfa7d2899ac40b24684b8`. Main was rechecked immediately before publication and updated with an expected-head lease; no newer repository work was overwritten.
- Current catalog: 40 active cities × 30 visible categories = 1,200 combinations. Ten hidden categories remain untouched. Grayton Beach is active; Panama City and Panama City Beach remain separate.
- Published: 500 placements, 27 appended evidence records, 22 business domains. Placements are city/category listing cards, not 500 unique companies.
- Preservation validation: all 21,748 prior generated listings and 2,921 raw evidence records are unchanged; no deletion or user/claimed/paid-record edit occurred.
- Before: 655 combinations at 20+, 545 below 20, count-based deficit 3,638.
- Live result: 682 combinations at 20+, 518 below 20, deficit 3,138, zero empty combinations; 27 additional combinations reached 20.
- Historical counts are not a fresh audit of every existing business's category relevance, service area, identity or website. Directory-wide qualifying completion is not claimed.

## Evidence and validation

Every selected addition has a working official website, an official service/coverage source, retrieval time and concise evidence note. Candidate records retain direct consumer evidence for towing, automotive and marine services and residential evidence for garage-door, pest, irrigation and home-inspection services. Unknown contact fields are omitted.

The selected pool uses official nationwide consumer dispatch coverage only where the business explicitly states U.S. coverage; local franchises and shops use official location or city service-area pages. State licensing was not treated as statewide coverage. No Google Maps, Google Places, Yelp, Angi, paid API, Foursquare credit, outreach or purchase was used.

Normalized-domain, business-identity, catalog-slug, schema, unique ID/slug, prior-record preservation and 20-per-pair cap checks passed. Local TypeScript, lint and production build passed. The production build initially exposed a connector transfer truncation in the 1.9 MB JSON blob; the next commit replaced it with a blob whose Git object hash exactly matches the validated local file, after which Vercel and CI passed.

Fifteen eligible placements remained in the researched pool after the exact 500 target was selected. They are candidates only and are not included in any published/live count for this run.

## Additions by category

| Category slug | Published additions |
| --- | ---: |
| towing | 302 |
| marine-services | 85 |
| auto-mechanics | 31 |
| garage-door-repair | 27 |
| home-inspections | 24 |
| pest-control | 21 |
| irrigation-sprinkler-repair | 10 |

## Additions by city

| City slug | Published additions |
| --- | ---: |
| destin-fl | 4 |
| fort-walton-beach-fl | 0 |
| crestview-fl | 8 |
| panama-city-fl | 6 |
| pensacola-fl | 3 |
| gulf-breeze-fl | 5 |
| pace-fl | 11 |
| perdido-key-fl | 8 |
| milton-fl | 10 |
| navarre-fl | 6 |
| orange-beach-al | 8 |
| gulf-shores-al | 11 |
| foley-al | 12 |
| fairhope-al | 12 |
| daphne-al | 14 |
| grayton-beach-fl | 9 |
| mobile-al | 10 |
| panama-city-beach-fl | 8 |
| biloxi-ms | 14 |
| gulfport-ms | 14 |
| dothan-al | 15 |
| montgomery-al | 16 |
| tallahassee-fl | 17 |
| auburn-al | 13 |
| new-orleans-la | 15 |
| baton-rouge-la | 14 |
| birmingham-al | 17 |
| huntsville-al | 17 |
| atlanta-ga | 15 |
| jacksonville-fl | 20 |
| tampa-fl | 12 |
| clearwater-fl | 21 |
| st-petersburg-fl | 19 |
| orlando-fl | 19 |
| sarasota-fl | 21 |
| fort-myers-fl | 18 |
| naples-fl | 18 |
| west-palm-beach-fl | 19 |
| fort-lauderdale-fl | 17 |
| miami-fl | 4 |

## Newly at 20

Twenty-seven combinations newly reached the threshold: towing in Pensacola, Gulf Breeze, Navarre, Perdido Key, Orange Beach, Destin, Panama City Beach, Crestview, Milton, Pace, Gulf Shores, Foley, Fairhope, Daphne, Grayton Beach, Panama City and Auburn; marine services in Panama City Beach, Fort Myers and Naples; home inspections in Daphne, Orlando and Grayton Beach; pest control in Clearwater, Fort Myers and Naples; and garage-door repair in Clearwater.

## Resume

Start from current main and repeat the live audit before writing. Resume the 15 unselected eligible placements only after checking that their target pairs still remain below 20; do not count this 500-placement batch again.

The four priority-city deficits are now:

- Destin: septic services 17/20 and auto body/collision 18/20; total deficit 5.
- Fort Walton Beach: septic services 16/20; total deficit 4. No newly researched business in this run had sufficiently explicit residential septic coverage for Fort Walton Beach, so no entry was padded into that gap.
- Crestview: auto body/collision 17/20, septic services 17/20 and marine services 18/20; total deficit 8.
- Panama City: septic services 16/20 and auto body/collision 19/20; total deficit 5.

Largest remaining category deficits are septic services 370, auto body/collision 227, hurricane protection 212, auto mechanics 206, screen enclosures 194, marine services 163 and garage-door repair 160. Continue strict official-site/local-coverage research in the priority cities first, then outward from Pensacola. The recurring fill remains enabled because directory-wide completion is outstanding.
