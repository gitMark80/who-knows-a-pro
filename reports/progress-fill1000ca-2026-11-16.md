# Who Knows a Pro fill checkpoint fill1000ca — November 16, 2026

## Baseline and catalog

- Fixed run-start baseline: `bbccd9cdbca8d2a4b73c403e53097e4b23903ba3` on `main`.
- Baseline public directory: 14,664 placements and 3,898 profiles.
- Current catalog: 40 active cities, 28 visible categories and 12 hidden categories, producing 1,120 public city/category pages. Grayton Beach is active; Pensacola Beach is not. No catalog state changed.
- No concurrent fill process was found before work began.

## Prepared changes

- Paul Camp Pool Builders — proposed local Dothan residential pool-installation business, then suppressed after its official domain failed the production-time working-site check.
- Tri-State Appliance Repair — proposed local Dothan residential appliance-repair business, then suppressed after its official homepage failed the production-time working-site check.
- 24-7 Pump Out — one independently supported Miami septic-services placement for an existing regional business already represented at the fixed baseline.

The initial deployment exposed working-site failures that disqualify both proposed new businesses: Paul Camp's official domain returned HTTP 503, and Tri-State's homepage returned HTTP 404. Both source records remain intact, while their public placements are being suppressed. The only completed candidate after live verification is **1 existing-business placement** for 24-7 Pump Out in Miami; **0 distinct new businesses** qualify for this run.

## Coverage

Validation and the full page-level snapshot are in `validation-fill1000ca-2026-11-16.json` and `coverage-fill1000ca-2026-11-16.csv`. Displayed counts are not a substitute for a complete qualification audit of historical rows; evidence-backed historical coverage remains unknown.

## Research and holds

Priority searches began with Destin, Fort Walton Beach, Crestview and Panama City. The strongest returned businesses were fixed-baseline identities, national chains, or lacked working official sites. Precision Auto Body, R&C Auto Body and The Paint and Body Shop of Pensacola remain held for official-site/category-evidence failures. Bama Pool Services and Dream Pools of Dothan have corroborating public records but no qualifying working official business site. Panhandle Platforms was rejected after its Florida LLC was found voluntarily dissolved in March 2026.

Retail Fix It remains suppressed as a commercial maintenance/vendor network. No source record was deleted, no claim or billing data changed, and the existing approval and non-test public gates remain intact.

## Publication state

- Initial data commit `cf3ee3cbbe40512f7f439f2c5493e7c7c206c49b` deployed READY as `dpl_4TrfEXhdAjqKUndfms472rFqo2vL`.
- Production confirmed the three intended directory placements were visible, including 24-7 Pump Out on Miami septic services.
- Production-time outbound checks disqualified Paul Camp Pool Builders and Tri-State Appliance Repair because their official sites were not working. A source-retaining public-suppression correction is prepared and must deploy before final completion is recorded.
- Corrected displayed coverage is expected to be 236 pages at 20+, 884 below 20, 0 empty, and a displayed deficit of 9,634. Full evidence-backed sitewide coverage remains unknown because historical pages are not fully audited.
