import collections
import csv
import json
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parent.parent
BEFORE = Path("/tmp/run1000-cont-before/seed.json")
AFTER = Path("/tmp/run1000-cont-after/seed.json")


def normalized_domain(url):
    host = (urlparse(url).hostname or "").lower()
    return host.removeprefix("www.")


before = json.loads(BEFORE.read_text())
after = json.loads(AFTER.read_text())
catalog = json.loads(Path("/tmp/run1000-cont-before/catalog.json").read_text())
evidence = json.loads(
    (ROOT / "reports/verified-fill1000-cont-2026-10-30.json").read_text()
)

assert len(before) == 8755, f"Unexpected baseline length: {len(before)}"
assert after[: len(before)] == before, "A preexisting generated listing changed"
additions = after[len(before) :]
assert len(additions) == evidence["placementCount"] == 493

active_regions = {item["slug"] for item in catalog["activeRegions"]}
visible_trades = {item["slug"] for item in catalog["visibleTrades"]}
assert len(active_regions) == 40
assert len(visible_trades) == 30

for label, values in {
    "id": [item["id"] for item in after],
    "slug": [item["slug"] for item in after],
    "normalized-domain placement": [
        (normalized_domain(item["website"]), item["region"], item["trade"])
        for item in after
    ],
    "identity placement": [
        (item["mainSlug"], item["region"], item["trade"]) for item in after
    ],
}.items():
    assert len(values) == len(set(values)), f"Duplicate {label}"

expected = {
    (normalized_domain(item["website"]), region, trade)
    for item in evidence["records"]
    for region in item["regions"]
    for trade in item["trades"]
}
actual = {
    (normalized_domain(item["website"]), item["region"], item["trade"])
    for item in additions
}
assert actual == expected, "Generated placements differ from verified evidence expansion"

source_checks = json.loads(
    (ROOT / "reports/source-checks-fill1000-cont-2026-10-30.json").read_text()
)
assert len(source_checks) == evidence["uniqueBusinessDomains"] == 16
assert all(item["accessible"] for item in source_checks)
assert {item["officialDomain"] for item in source_checks} == {
    normalized_domain(item["website"]) for item in evidence["records"]
}

required = {
    "id",
    "slug",
    "mainSlug",
    "name",
    "website",
    "region",
    "trade",
    "source",
    "sourceUrl",
    "sourceVerifiedAt",
}
for item in additions:
    assert required <= item.keys(), f"Missing required fields on {item.get('id')}"
    assert item["region"] in active_regions
    assert item["trade"] in visible_trades
    assert item["source"] == "official_website"
    assert item["sourceUrl"].startswith("https://")
    assert item["sourceVerifiedAt"]
    assert normalized_domain(item["website"]) == normalized_domain(item["sourceUrl"])

for item in evidence["records"]:
    assert item["sourceUrl"].startswith("https://")
    assert item["sourceVerifiedAt"]
    assert item["evidenceNote"].strip()

coverage = list(
    csv.DictReader(
        (ROOT / "reports/coverage-fill1000-cont-before-2026-10-30.csv").open()
    )
)
assert len(coverage) == len(active_regions) * len(visible_trades) == 1200
deltas = collections.Counter((item["region"], item["trade"]) for item in additions)
assert sum(deltas.values()) == 493

for row in coverage:
    old_count = int(row["listing_count"])
    delta = deltas[row["city_slug"], row["category_slug"]]
    new_count = old_count + delta
    if old_count >= 20:
        assert delta == 0, (
            f"Selection added to complete pair {row['city_slug']}/"
            f"{row['category_slug']}: {old_count}+{delta}"
        )
    else:
        assert new_count <= 20, (
            f"Selection exceeded 20 for {row['city_slug']}/"
            f"{row['category_slug']}: {old_count}+{delta}"
        )
    row.update(
        listing_count=new_count,
        missing=max(0, 20 - new_count),
        meets_minimum=str(new_count >= 20).lower(),
    )

prepared_path = ROOT / "reports/coverage-fill1000-cont-prepared-2026-10-30.csv"
with prepared_path.open("w", newline="") as handle:
    writer = csv.DictWriter(handle, fieldnames=coverage[0].keys())
    writer.writeheader()
    writer.writerows(coverage)

report = {
    "baselineCommit": evidence["baselineCommit"],
    "previousListingsPreserved": len(before),
    "newPlacements": len(additions),
    "totalListings": len(after),
    "uniqueBusinessDomains": len(
        {normalized_domain(item["website"]) for item in additions}
    ),
    "activeCities": len(active_regions),
    "visibleCategories": len(visible_trades),
    "activePairs": len(coverage),
    "duplicateKeys": 0,
    "pairsAt20": sum(int(row["listing_count"]) >= 20 for row in coverage),
    "remainingDeficit": sum(int(row["missing"]) for row in coverage),
    "emptyPairs": sum(int(row["listing_count"]) == 0 for row in coverage),
    "additions": additions,
}
assert report["remainingDeficit"] == 16138
assert report["emptyPairs"] == 0

(ROOT / "reports/validation-fill1000-cont-2026-10-30.json").write_text(
    json.dumps(report, indent=2) + "\n"
)
print(json.dumps({key: value for key, value in report.items() if key != "additions"}, indent=2))
