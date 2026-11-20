# Directory fill checkpoint — November 19, 2026

The fixed run-start baseline is `34794114b3fb115e09cecd38a3ea0dcc117d9ef8`. No main workflow or competing local fill was found before editing. The current catalog covers 40 active cities, 28 visible categories, 12 hidden categories and 1,120 pages. Grayton Beach is active and Pensacola Beach is absent.

| City | Category | Baseline displayed | Live displayed | New-business placements | Existing-business placements | Displayed deficit |
|---|---|---:|---:|---:|---:|---:|
| fairhope-al | irrigation-sprinkler-repair | 7 | 8 | 1 | 0 | 12 |
| foley-al | irrigation-sprinkler-repair | 7 | 8 | 1 | 0 | 12 |
| grayton-beach-fl | appliance-repair | 9 | 10 | 0 | 1 | 10 |
| gulf-breeze-fl | appliance-repair | 15 | 16 | 1 | 0 | 4 |
| milton-fl | generator-installation | 15 | 16 | 1 | 0 | 4 |
| milton-fl | pool-installation | 13 | 14 | 0 | 1 | 6 |
| milton-fl | pool-service | 12 | 13 | 0 | 1 | 7 |
| mobile-al | irrigation-sprinkler-repair | 3 | 6 | 3 | 0 | 14 |
| navarre-fl | appliance-repair | 13 | 14 | 1 | 0 | 6 |
| navarre-fl | garage-door-repair | 10 | 11 | 0 | 1 | 9 |
| pace-fl | pool-service | 10 | 11 | 0 | 1 | 9 |
| panama-city-fl | tree-service | 17 | 18 | 1 | 0 | 2 |
| pensacola-fl | appliance-repair | 14 | 15 | 1 | 0 | 5 |
| pensacola-fl | pool-installation | 16 | 17 | 0 | 1 | 3 |

Six distinct new local businesses were published and live-verified, contributing ten placements. Previously listed businesses contributed six placements. The exact new-business shortfall is 994. Data commit `135321416d297d63308ef9d8179666ae4a564eb9` reached READY in production deployment `dpl_4Y4HL1HZi1WFoeFZTtwRbGt5pZ1q`. All 16 cards appeared exactly once on their intended pages and linked to the intended official businesses. No placements await deployment or live verification.

Live coverage rose from 13,187 to 13,203 displayed placements. The 14 changes above were the only displayed count changes. Of 1,120 pages, 241 display at least 20 records, 879 display fewer than 20, and zero are empty. The displayed placement deficit is 9,511, down 16. This is a lower bound for the qualification-backed deficit, which remains unknown until historical placements are audited. The number of pages independently verified at 20 also remains unknown. The complete city/category count matrix is in `live-coverage-fill1000co-2026-11-19.csv`. The repository generates 3,955 profiles and 14,788 placements before live display.

The evidence ledger records six new qualifying candidates, 94 matched baseline domains, 13 pending candidate cases, eight ineligible candidates and three alternate domains. One pending case is a baseline match. Priority searches covered Destin, Fort Walton Beach, Crestview and Panama City. Duplicates, inaccessible or unconfirmed official sites, and unsupported local operations or service categories limited eligible additions. The batch also reached nearby Panhandle and Alabama communities. Resume with the thinnest priority pages and the pending cases in the ledger. No local-market shortage was certified.

The historical scan flagged 158 identities across 584 source rows and 8,816 raw placements. Counts overlap by reason. It includes 131 identities with unsupported geography, 55 with unsupported residential service, and five with possible intermediary status. Retail Fix It accounts for 396 raw placements. Its official site describes nationwide facilities management and vendor intake. Its existing suppression passed validation, with historical records retained. The ledger also flags two historical AJ Electrical Corp placements for identity and geography review and a duplicate Hometown Garage Doors identity. Those records were preserved.

Build, JSON schema, catalog slugs, baseline deduplication, data retention, and national-brand visibility checks passed. The reviewed data import accommodates 20 listings and discovery queues candidates for review. The existing approval and non-test gates, claims, billing, and catalog data were preserved.
