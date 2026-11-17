# Who Knows a Pro fill checkpoint fill1000cc — November 16, 2026

## Baseline and catalog

- Fixed run-start baseline: `25233ba4973fd3a367497eb1da5f70159808352c` on `main`.
- Baseline public directory: 14,667 placements and 3,898 profiles.
- Current catalog: 40 active cities, 28 visible categories and 12 hidden categories, producing 1,120 public city/category pages. Grayton Beach is active; Pensacola Beach is not. No catalog state changed.
- No concurrent fill or build process was found before work began.

## Prepared changes

- Tri-State Appliance Repair — researched but not completed. Although indexed content described household services and Dothan coverage, fresh production browser verification rendered SITE NOT FOUND at `/services`; the retained source row is suppressed again.
- Buds N' Blossoms Nursery & Landscaping — one Dothan irrigation placement and one Dothan landscaping placement. Official pages expressly document residential service throughout Dothan and the Wiregrass.
- A to Z Appliance Repair — official-link correction for the existing Destin and Fort Walton Beach appliance-repair placements. Counts do not change.
- This run completes **1 distinct new business**, **2 new-business placements**, **0 existing-business placements**, and **2 official-link corrections** after the correction deploys and passes live verification. The exact shortfall against the 1,000-new-business run target is **999**.

## Coverage

After suppressing the failed Tri-State destination, displayed coverage is 236 pages at 20+, 884 below 20, 0 empty, and a displayed deficit of 9,630. Dothan appliance repair remains at 8, irrigation changes from 3 to 4, and landscaping from 6 to 7. The directory contains 14,669 placements and 3,899 profiles.

Validation and the full page-level snapshot are in `validation-fill1000cc-2026-11-16.json` and `coverage-fill1000cc-2026-11-16.csv`. Displayed counts are not a substitute for a complete qualification audit of historical rows; evidence-backed historical coverage remains unknown.

## Research, holds and historical flags

Priority research covered the lowest auto-body and appliance gaps in Crestview, Panama City, Destin and Fort Walton Beach before moving outward. Most qualifying results were already baseline identities. Precision Auto Body and Wreck-A-Mended still lack qualifying working official-site evidence. Tri-State and four other promising local candidates remain held for official-site failures. National collision chains and Mr. Appliance were rejected under Mark's local/regional-only policy.

The historical Crestview A to Z row remains flagged for unsupported geography and an obsolete third-party website; it was not deleted or hidden. Retail Fix It remains suppressed as a commercial maintenance/vendor network. No source record was deleted, no claim or billing data changed, and the existing approval and non-test public gates remain intact.

## Publication state

- Initial data commit `ba0173627a19a6c55cec8c67315d1d14d93c17f9` deployed READY, but live verification found Tri-State's official destination invalid.
- A corrective suppression commit is pending publication and deployment; completed totals are not final until that correction is live-verified.
