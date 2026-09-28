# Five business websites per city/category

The completion requirement is 40 cities × 40 categories × at least five distinct businesses with official websites. The existing directory is below that requirement. A successful collection run is not a completion result: only the published coverage audit establishes whether every combination meets five.

## Prepared collection workflow

`scripts/collect-directory-candidates.py` reads every underfilled pair from the live audit, searches Foursquare Places for website-bearing candidates, and saves a review queue with source URLs, actual reported locations, categories, and retrieval timestamps. It uses the new Places API and its `2025-06-17` version header. It requests Pro fields only and never writes credentials to files.

The collector excludes missing websites, known directory/social URLs, recorded closures, flagged records, and repeated company names/domains within a result set. A different city remains explicitly marked as requiring service-area verification. Search relevance is not proof of a category match. Candidates must still be checked against existing listings and the company's official service/coverage information before being imported. Do not manufacture five results where source evidence is insufficient.

No Foursquare credential was available in the execution environment when this workflow was prepared. No billable Foursquare requests have been made, and no new listings were published by this collector.

## Activate without sharing a secret in chat

1. In the Foursquare developer console, create a Service API Key for the Places API.
2. In GitHub → `gitMark80/who-knows-a-pro` → Settings → Secrets and variables → Actions, add a repository secret named `FOURSQUARE_API_KEY`.
3. Open Actions → **Collect directory website candidates** → Run workflow. `max_requests=0` runs a coverage/dry-run check; a positive number sets the maximum number of new API searches. Start with 10 to validate the account and results. API charges, if any, depend on the Foursquare account's plan and usage.
4. Download the workflow artifact containing the coverage CSV and candidate JSON. Cached responses are reused on subsequent runs; the request ceiling applies only to new requests. Rate-limit or authentication failures stop the run without automatic retries.
5. Verify candidates, import only supported business/category/city placements, deploy, and rerun the coverage audit. Every one of the 1,600 combinations must have at least five distinct business websites before claiming completion.

The workflow has read-only repository permissions and does not publish or alter live listings.

## Local commands

```sh
python scripts/audit-live-directory.py --allow-shortfalls
python scripts/collect-directory-candidates.py
# With FOURSQUARE_API_KEY supplied through a secure environment:
python scripts/collect-directory-candidates.py --max-requests 10
```

Run the audit without `--allow-shortfalls` as the completion check; it returns nonzero while any page remains under five. The override does not suppress network or parsing errors.

Official references:
- https://docs.foursquare.com/fsq-developers-places/reference/place-search
- https://docs.foursquare.com/fsq-developers-places/reference/response-fields
- https://docs.foursquare.com/developer/docs/manage-service-api-keys
