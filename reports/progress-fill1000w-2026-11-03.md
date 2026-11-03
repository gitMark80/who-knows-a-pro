# Directory qualification checkpoint — fill1000w — 2026-11-03

## Fixed run baseline

- Git main: `e1b31884693adacbcc982b6c93c9dfae075cd096`.
- Catalog: 40 active cities, 30 visible categories, 1,200 public city/category pages. Grayton Beach is active; Pensacola Beach is not. Hidden categories were unchanged.
- Generated directory: 24,288 displayed placements across 3,752 normalized domains.
- Display-only coverage: 808 pages at 20+, 392 below 20, zero empty, displayed deficit 1,491. These numbers are not a qualifying residential-service audit.

## Prepared additions

- 14 distinct new business domains absent from the fixed baseline.
- 19 qualifying city/category placements, all from those new businesses; zero placements from baseline businesses.
- Cities: Baton Rouge 2, Destin 1, Fort Walton Beach 2, Tampa 3, Sarasota 3, Fort Myers 4, Naples 4.
- Categories: auto body/collision 1, auto mechanics 3, locksmith 1, screen enclosures/pool cages 4, marine services 6, septic services 2, hurricane shutters/impact windows 2.
- All 19 unique official website/source URLs returned successfully. The only cross-domain redirect was the documented Germain Yachts to SI Yachts transition; the qualifying Naples service page belongs to the final SI Yachts identity.
- Two additional national-brand candidate domains (Gerber Collision and ASP) were withheld because the repository intentionally excludes those domains. Shared brand URLs were not counted as separate franchise businesses.
- Published checkpoints: `a5b9b0220f502c74049b7734bcb4d6fa7f7db43c` and `73affa86be3c443407c0f9fc619ec6d68e1739b1`; both production deployments reached `READY`.
- All 19 placements passed on 15 live category pages; all 14 profiles and intended official-site links passed. Live evidence: `reports/live-fill1000w-2026-11-03.json` and `reports/live-fill1000w2-2026-11-03.json`.
- Run target shortfall: 986 distinct new businesses.

## Qualification controls

- The active import path now requires explicit direct-provider, residential/consumer, specific-geography, official-identity, and joint evidence fields.
- Commercial-only evidence, vendor/contractor-network evidence, broad nationwide geography without a specific local connection, inactive cities, and hidden categories are rejected.
- The candidate ledger is `reports/candidates-qualified-new-businesses-2026-11-03.json`; URL results are `reports/http-sources-qualified-new-businesses-2026-11-03.json`.

## Historical records requiring review

- `reports/historical-qualification-flags-2026-11-03.json` flags 8,816 displayed placements across 158 identities for one or more of: unsupported residential service, intermediary/managed-network status, or unsupported specific geography.
- Retail Fix It accounts for 396 flagged placements in 22 evidence rows. Its saved evidence explicitly describes commercial facility work and managed networks; none of those placements count toward qualifying residential coverage.
- Public visibility was not changed and no historical record was deleted.

## Coverage status

- A fresh complete qualification audit of all 24,288 displayed placements is not complete. Therefore the exact qualifying page count and qualifying deficit remain unknown.
- The 808/392/1,491 figures above are display counts only. No page is certified complete merely because it renders 20 records.
- Current-run reviewed evidence adds 19 qualifying placements across 15 pages; none of those pages is independently certified at 20 by this run alone.

## Validation

- Prior 24,288 generated listings and 4,153 raw evidence rows are preserved byte-for-byte and in order.
- JSON expansion, active city/category slugs, unique IDs/slugs, normalized-domain placement deduplication, and business-identity placement deduplication passed.
- TypeScript and the production build passed.
- Main was rechecked immediately before the commit. Committed, deployed, and live-verified states are recorded separately in `reports/run-fill1000w-2026-11-03.json`.
