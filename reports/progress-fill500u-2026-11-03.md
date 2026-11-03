# Directory fill500u progress — 2026-11-03

Status: **validated locally; publication pending**

## Outcome

- Published-run target: 500 placements
- Validated placements ready to publish: **40**
- Exact run shortfall: **460**
- Distinct new normalized business domains: **26**
- Prior generated listings preserved: **23248**
- Prior evidence rows preserved: **3585**
- Current catalog used as source of truth: **40 active cities × 30 visible categories = 1,200 combinations**
- Before: **744** combinations at 20+, **2138** total deficit
- Prepared: **746** combinations at 20+, **2098** total deficit, **0** empty combinations

## Additions by city

- `biloxi-ms`: 1
- `dothan-al`: 1
- `montgomery-al`: 1
- `tallahassee-fl`: 5
- `new-orleans-la`: 1
- `baton-rouge-la`: 1
- `huntsville-al`: 2
- `jacksonville-fl`: 2
- `tampa-fl`: 1
- `st-petersburg-fl`: 1
- `sarasota-fl`: 4
- `fort-myers-fl`: 3
- `naples-fl`: 2
- `west-palm-beach-fl`: 3
- `fort-lauderdale-fl`: 1
- `miami-fl`: 11

## Additions by category

- `auto-mechanics`: 23
- `auto-body-collision`: 7
- `pool-service`: 3
- `home-inspections`: 1
- `garage-door-repair`: 2
- `pest-control`: 1
- `fence-builders`: 1
- `insulation`: 1
- `locksmith`: 1

## Newly completed combinations

- `jacksonville-fl|pool-service`
- `miami-fl|locksmith`

## Priority-city gaps remaining

- `destin-fl`: auto body 18/20; septic 17/20 (deficit 5)
- `fort-walton-beach-fl`: septic 16/20 (deficit 4)
- `crestview-fl`: auto body 17/20; marine 18/20; septic 18/20 (deficit 7)
- `panama-city-fl`: auto body 19/20; septic 16/20 (deficit 5)

## Verification and blockers

- Fresh live audit before work matched the durable checkpoint: 744/1,200 combinations at 20+, deficit 2,138, no empty combinations.
- Candidate checkpoint contains 103 researched records. Only the 40 records that produced distinct validated listings through the existing importer are in the publish set; researched candidates are not counted as listings.
- Miami locksmith reaches 20 with Alvarez Locksmith, whose official site lists its Little Havana storefront and residential, automotive and commercial locksmith services.
- Official Gerber location pages were researched, but `gerbercollision.com` is intentionally excluded by `data/excluded-businesses.ts` and older Gerber raw records already exist. Those pages did not render, so none were counted or published and the exclusion was not altered.
- A similarly named Prime Plumbing site reused the same Florida license as an existing Prime Plumbing identity; it was treated as an alternate identity/domain and excluded.
- National roadside programs, generic facility-maintenance networks, redirected franchise pages, commercial-only providers, directory pages and social-only pages were not counted.
- This run stopped at 40 validated placements because the remaining reviewed pool could not pass both local/category evidence and the repository’s rendering/deduplication rules without lowering standards.

## Resume points

- Continue with genuine local septic providers for Destin, Fort Walton Beach, Crestview and Panama City.
- Continue with non-excluded local collision providers for Destin, Crestview and Panama City.
- Continue marine-service research for Crestview.
- Re-run the live audit from current `main` before the next write and preserve all claimed, paid and user-submitted records.
