"""Fetch each affected category page once, then verify every new card and profile."""

import collections
import concurrent.futures
import html
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASE = "https://whoknowsapro.com"
RUN = "fill500g"
DATE = "2026-11-01"
additions = json.loads((ROOT / f"reports/validation-{RUN}-{DATE}.json").read_text())["additions"]

def host(url):
    return (urllib.parse.urlparse(html.unescape(url)).hostname or "").lower().removeprefix("www.")

groups = collections.defaultdict(list)
for item in additions:
    groups[f"/{item['region']}/{item['trade']}"].append(item)
profiles = {item["mainSlug"]: item for item in additions}

def check(item, profile=False):
    path, rows = item
    for attempt in range(3):
        try:
            request = urllib.request.Request(BASE + path, headers={"User-Agent": "WhoKnowsAPro-LiveVerification/1.0"})
            with urllib.request.urlopen(request, timeout=45) as response:
                status = response.status
                page = response.read().decode()
            cards = re.findall(r"<article\b[^>]*>.*?</article>", page, re.S)
            results = []
            for row in rows:
                matched = [page] if profile else [card for card in cards if f'href="/business/{row["mainSlug"]}"' in card]
                linked = any(host(url) == host(row["website"]) for card in matched for url in re.findall(r'href="([^"]+)"', card))
                results.append({
                    "url": BASE + path,
                    "name": row["name"],
                    "mainSlug": row["mainSlug"],
                    "domain": host(row["website"]),
                    "httpStatus": status,
                    "matchingCards": len(matched),
                    "officialLinkFound": linked,
                    "passed": status == 200 and len(matched) == 1 and linked,
                })
            return results
        except Exception as error:
            failure = str(error)
            if attempt < 2:
                time.sleep(2 * (attempt + 1))
    return [{"url": BASE + path, "name": row["name"], "passed": False, "error": failure} for row in rows]

checkpoint_path = ROOT / f"reports/live-{RUN}-partial-{DATE}.json"
completed = {"placements": {}, "profiles": {}}
if checkpoint_path.exists():
    previous = json.loads(checkpoint_path.read_text())
    if previous.get("sourceCommit") == sys.argv[1]:
        completed = previous["completed"]

def verify_batch(items, kind, profile=False):
    pending = [(path, rows) for path, rows in items if path not in completed[kind] or not all(row["passed"] for row in completed[kind][path])]
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        futures = {pool.submit(check, item, profile): item[0] for item in pending}
        for future in concurrent.futures.as_completed(futures):
            path = futures[future]
            completed[kind][path] = future.result()
            checkpoint_path.write_text(json.dumps({"sourceCommit": sys.argv[1], "completed": completed}, indent=2) + "\n")
            count = len(completed[kind])
            if count % 10 == 0 or count == len(items):
                print(f"{kind}: {count}/{len(items)} pages checked", flush=True)
    return [result for results in completed[kind].values() for result in results]

placements = verify_batch(list(groups.items()), "placements")
profile_items = [(f"/business/{slug}", [item]) for slug, item in profiles.items()]
profile_results = verify_batch(profile_items, "profiles", True)
report = {
    "sourceCommit": sys.argv[1],
    "deploymentId": sys.argv[2],
    "checkedAt": datetime.now(timezone.utc).isoformat(),
    "categoryPages": len(groups),
    "placementCount": len(placements),
    "placementsPassed": sum(item["passed"] for item in placements),
    "profileCount": len(profile_results),
    "profilesPassed": sum(item["passed"] for item in profile_results),
    "placements": placements,
    "profiles": profile_results,
}
(ROOT / f"reports/live-{RUN}-{DATE}.json").write_text(json.dumps(report, indent=2) + "\n")
print(json.dumps({key: value for key, value in report.items() if key not in ("placements", "profiles")}, indent=2))
failures = [item for item in placements + profile_results if not item["passed"]]
if failures:
    print(json.dumps(failures, indent=2))
sys.exit(bool(failures))
