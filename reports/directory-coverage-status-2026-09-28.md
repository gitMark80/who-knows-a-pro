# Directory coverage audit — 2026-09-28

Requested minimum: five distinct business listings for each of 40 categories in all 40 active cities (1,600 combinations).

Status: **NOT COMPLETE**.

| Measure | Before additions | Published after additions |
| --- | ---: | ---: |
| Business placements | 3,657 | 3,904 |
| Combinations with at least five listings | 192 | 229 |
| Combinations below five | 1,408 | 1,371 |
| Empty combinations | 268 | 219 |
| Additional placements needed to reach five | 5,668 | 5,425 |

Added 247 net placements supported by official business sources. Each source record is in `data/verified-coverage-2026-09-28.json`. Multiple placements may represent the same business in different supported categories or service areas. Source evidence is not an endorsement, licensing check, or confirmation of appointment availability.

Auburn now has 182 placements. 33 of its 40 categories meet the minimum. Its remaining gaps:

| Category | Current count | Still needed |
| --- | ---: | ---: |
| Appliance repair | 3 | 2 |
| Hurricane shutters & impact windows | 0 | 5 |
| Insulation | 4 | 1 |
| Locksmith | 3 | 2 |
| Marine services | 3 | 2 |
| Septic services | 4 | 1 |
| Trading card stores | 0 | 5 |

The full 1,600-combination audit is in `reports/live-directory-coverage.csv`. These are observed public city-card counts after deployment of commit `6990c9559f7640e961fee28ac518b3e0282695c0`; empty categories remain recorded as zero, without fallback businesses from unsupported areas.

Run `python scripts/audit-live-directory.py` to refresh the report. It exits with status 1 while any combination remains below five, and fails rather than silently treating a fetch or parsing error as zero. The audit does not automatically discover or publish additional businesses. Remaining combinations require further sourcing; no directory-wide completion claim is warranted.
