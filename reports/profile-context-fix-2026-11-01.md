# Miami locksmith profile navigation correction

Reported: November 1, 2026. Baseline main: `111e6a41604f279dbf5de073c9a6681303be2a5a`.

## Cause and correction

The Miami locksmith page linked DH Pace to `/business/dh-pace`. The shared profile selected its first placement as the primary row and displayed “Locksmith in Panama City, FL,” including Panama City breadcrumbs. The business identity was unchanged, but the selected city/category was lost. Previous fill checks verified HTTP responses, identity links and official website links without checking the profile's displayed city.

Listing cards now include the selected region and trade in their canonical profile link. Profiles accept a pair only when it exists among that business's placements. Breadcrumbs, subtitle, return link and category navigation use that validated pair. Bare canonical profiles use a neutral business overview. Legacy placement URLs redirect to the canonical profile while preserving their placement context. Canonical SEO URLs and analytics continue to use the one shared business identity.

DH Pace's commercial scope is now visible in its cards and profile through an optional public summary in the existing provider importer. Official evidence reviewed on November 1, 2026:

- https://www.dhpace.com/services/commercial-services/locksmith-services/ explicitly describes nationwide lock, key and security services for commercial businesses and organizations.
- The retained source https://www.dhpace.com/brands/national-accounts/ supports the existing commercial door and locksmith placements. No local office or residential locksmith coverage was added or inferred.

## Validation before publication

- Production build, TypeScript and ESLint passed.
- The new integration suite followed all nine Miami locksmith profile links and verified the displayed city/category and return links.
- Tested DH Pace in Panama City and Destin, both listed categories, neutral canonical profile, legacy redirect, invalid/repeated query values, sparse city/category combinations and preservation of claimed owner content and tier.
- All 16,748 generated placements and their IDs, website links and placement order were preserved. Only the summary changed for 79 existing DH Pace placements; all 2,325 source rows remain in order.
- Updated the recurring fill verifier to require the correct city/category parameters on profile links.
- The previous fill automation run was recorded completed; no active fill run was recorded when this change began. Main is updated with an expected-head guard.

No listings were added or deleted.

## First publication and follow-up

Published source `2e920fc6b69ddd021682fc350db77a6f53f916d9`; Vercel deployment `dpl_932Poz4nUUFgVPK4DfYrJrBjhN3x` reached READY and GitHub CI run `41339663340` passed. Following the DH Pace link from the live Miami locksmith page showed “Locksmith serving Miami, FL,” Miami breadcrumbs, the correct return link and the commercial service description.

That browser check also exposed a claim link still using the primary Panama City placement, plus a city chip that could switch to another category. The follow-up keeps the selected placement in the claim link and filters city chips to the selected category's actual placements. The expanded local integration suite, production build, TypeScript and targeted lint passed again. Final live checks will be recorded after this follow-up deploys.
