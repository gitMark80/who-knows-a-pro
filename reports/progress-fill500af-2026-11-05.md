# Fill 500 continuation checkpoint

Continues fill500ae's unfinished 500-business request. Fixed continuation baseline: b99bbdac114dbe96ec342f554e4d580c428b551f. Its 14,134 existing placements are preserved unchanged. Prior run reported 62 fully qualified new businesses; the earlier published All Safe Security & Lock remains excluded from the qualified count pending official-site reconfirmation.

## Current status

18 additional businesses and 26 placements are published and live verified at commit 236137a17f1e7943c8e131e47128256478ffcbb1, production deployment dpl_GiFD3qP2SZPtoe5SRebD9m4zA5H3 READY. Cumulative qualified count is 80, with 420 remaining against 500.

18 more businesses with 30 placements are prepared, not yet counted as complete. They bring this continuation's prepared total to 36 businesses and 56 placements. All are new business identities, not repeat counts for multiple placements. No existing-business extra placements are included.

## Checks and evidence

Duplicate/domain/name, active-city/visible-category, direct-provider/residential/geographic evidence, baseline-preservation and per-page under-20 validation passed. Official site content reviewed: 60 source URLs returned HTTP 200; two returned 406 and one timed out in direct requests but matching official content opened through the web reader. These alternate checks are recorded, not silently treated as HTTP successes.

Local type checking and lint passed. The first production build and all integration suites passed on GitHub after updating an obsolete test fixture that expected excluded national brand DH Pace. That test now uses an isolated database fixture and asserts DH Pace remains absent. No application behavior was changed by this test repair.

Prepared displayed coverage: 40 active cities, 30 visible categories, 1,200 pages, 160 at 20+, 1,040 below 20, none empty, displayed deficit 11,322. Historical qualifying coverage and deficit remain unknown pending a full audit. These are not certified qualifying totals. Hidden categories and above-target historical pages remain unchanged.

Chorus Pest and Seaside Appliance World remain unpublished pending regional-boundary/current service-page checks. Witt Co Pool Pros was excluded as a likely existing WittCo identity. No outreach, paid API use, category activation, schedule changes, or historical deletions were performed. Final published candidates use official website evidence. Additional discovery candidates with weak identity evidence were withheld.

## Resume

Read latest main and active runs, preserve concurrent work, and continue only underfilled public pages. The evidence ledger, source checks, validation additions and coverage CSV contain durable keys and links. To recreate the baseline, load data/directory.ts from the fixed baseline commit, not the current expanded seed. The 500-business goal remains unfinished; do not mark it complete or pause its automation.
