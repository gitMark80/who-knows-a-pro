#!/usr/bin/env python3
import csv
import json
from pathlib import Path
from urllib.parse import urlparse

run = "fill500g"
date = "2026-11-01"
before = json.loads(Path("/tmp/fill500g-before/seed.json").read_text())
after = json.loads(Path("/tmp/fill500g-after/seed.json").read_text())
catalog = json.loads(Path("/tmp/fill500g-after/catalog.json").read_text())
source_before = json.loads(Path("/tmp/fill500g-source-before.json").read_text())
source_after = json.loads(Path("data/verified-coverage-2026-09-28.json").read_text())
report = json.loads(Path(f"reports/verified-{run}-{date}.json").read_text())

assert after[:len(before)] == before, "Prior generated listings changed or reordered"
assert source_after[:len(source_before)] == source_before, "Prior raw evidence rows changed or reordered"
new_listings = after[len(before):]
new_source = source_after[len(source_before):]
assert len(new_listings) == report["placementCount"] == 500
assert len(new_source) == report["sourceRecordCount"]

regions = {row["slug"] for row in catalog["activeRegions"]}
trades = {row["slug"] for row in catalog["visibleTrades"]}
assert len(regions) == 40 and len(trades) == 30
assert "grayton-beach-fl" in regions and "pensacola-beach-fl" not in regions
assert "panama-city-fl" in regions and "panama-city-beach-fl" in regions

def domain(value):
    return urlparse(value).hostname.lower().removeprefix("www.")

for row in new_source:
    assert row.get("sourceUrl") and row.get("sourceVerifiedAt") and len(row.get("evidenceNote", "")) > 80
    assert set(row["regions"]) <= regions and set(row["trades"]) <= trades
for row in new_listings:
    assert row["region"] in regions and row["trade"] in trades
    assert row.get("website") and row.get("sourceUrl") and row.get("sourceVerifiedAt")

def unique(field):
    values = [row[field] for row in after]
    assert len(values) == len(set(values)), f"Duplicate {field}"

unique("id")
unique("slug")
domain_keys = [(domain(row["website"]), row["region"], row["trade"]) for row in after]
identity_keys = [(row["name"].casefold(), row["region"], row["trade"]) for row in after]
assert len(domain_keys) == len(set(domain_keys)), "Duplicate normalized-domain placement"
assert len(identity_keys) == len(set(identity_keys)), "Duplicate business-identity placement"
assert len({domain(row["website"]) for row in new_listings}) == report["uniqueBusinessDomains"] == 7

expected = set()
for row in new_source:
    for region in row["regions"]:
        for trade in row["trades"]:
            expected.add((domain(row["website"]), region, trade))
actual = {(domain(row["website"]), row["region"], row["trade"]) for row in new_listings}
assert actual == expected and len(actual) == 500, "Raw evidence expansion mismatch"

counts = {}
for row in after:
    key = (row["region"], row["trade"])
    counts[key] = counts.get(key, 0) + 1
rows = list(csv.DictReader(Path(f"reports/coverage-{run}-prepared-{date}.csv").open()))
assert len(rows) == 1200
for row in rows:
    assert counts.get((row["city_slug"], row["category_slug"]), 0) == int(row["listing_count"])
visible_counts = [counts.get((region, trade), 0) for region in regions for trade in trades]
assert sum(max(0, 20 - value) for value in visible_counts) == report["prepared"]["deficit"] == 9138
assert sum(value >= 20 for value in visible_counts) == report["prepared"]["pairsAt20"] == 347
assert all(value <= 20 for key, value in counts.items() if key in {(row["region"], row["trade"]) for row in new_listings})

result = {
    "priorListingsPreserved": len(before),
    "priorEvidenceRowsPreserved": len(source_before),
    "newListings": len(new_listings),
    "newEvidenceRows": len(new_source),
    "newBusinessDomains": len({domain(row["website"]) for row in new_listings}),
    "pairsAt20": report["prepared"]["pairsAt20"],
    "pairsBelow20": report["prepared"]["pairsBelow20"],
    "deficit": report["prepared"]["deficit"],
    "additions": new_listings,
}
Path(f"reports/validation-{run}-{date}.json").write_text(json.dumps(result, indent=2) + "\n")
print(json.dumps(result, indent=2))
