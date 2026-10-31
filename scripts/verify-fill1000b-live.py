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
additions = json.loads(
    (ROOT / "reports/validation-fill1000b-2026-10-31.json").read_text()
)["additions"]


def host(url):
    return (
        urllib.parse.urlparse(html.unescape(url)).hostname or ""
    ).lower().removeprefix("www.")


groups = collections.defaultdict(list)
for item in additions:
    groups[f"/{item['region']}/{item['trade']}"].append(item)
profiles = {item["mainSlug"]: item for item in additions}


def check(item, profile=False):
    path, rows = item
    results = []
    for attempt in range(3):
        try:
            request = urllib.request.Request(
                BASE + path,
                headers={"User-Agent": "WhoKnowsAPro-LiveVerification/1.0"},
            )
            with urllib.request.urlopen(request, timeout=45) as response:
                status = response.status
                page = response.read().decode()
            cards = re.findall(r"<article\b[^>]*>.*?</article>", page, re.S)
            for row in rows:
                matched = (
                    [page]
                    if profile
                    else [
                        card
                        for card in cards
                        if f'href="/business/{row["mainSlug"]}"' in card
                    ]
                )
                linked = any(
                    host(url) == host(row["website"])
                    for card in matched
                    for url in re.findall(r'href="([^"]+)"', card)
                )
                results.append(
                    {
                        "url": BASE + path,
                        "name": row["name"],
                        "mainSlug": row["mainSlug"],
                        "domain": host(row["website"]),
                        "httpStatus": status,
                        "matchingCards": len(matched),
                        "officialLinkFound": linked,
                        "passed": status == 200 and len(matched) == 1 and linked,
                    }
                )
            return results
        except Exception as error:
            failure = str(error)
            if attempt < 2:
                time.sleep(1)
    return [
        {"url": BASE + path, "name": row["name"], "passed": False, "error": failure}
        for row in rows
    ]


with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    placements = [
        result
        for page_results in pool.map(check, groups.items())
        for result in page_results
    ]

profile_items = [(f"/business/{slug}", [item]) for slug, item in profiles.items()]
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    profile_results = [
        result
        for page_results in pool.map(lambda item: check(item, True), profile_items)
        for result in page_results
    ]

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
(ROOT / "reports/live-fill1000b-2026-10-31.json").write_text(
    json.dumps(report, indent=2) + "\n"
)
print(
    json.dumps(
        {
            key: value
            for key, value in report.items()
            if key not in ("placements", "profiles")
        },
        indent=2,
    )
)
failures = [item for item in placements + profile_results if not item["passed"]]
if failures:
    print(json.dumps(failures, indent=2))
sys.exit(bool(failures))
