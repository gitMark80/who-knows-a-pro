#!/usr/bin/env python3
"""Audit every active city/category page against the five-business minimum."""
import argparse
import concurrent.futures
import csv
import html
import json
import re
import sys
import urllib.request
from pathlib import Path

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--base-url', default='https://whoknowsapro.com')
parser.add_argument('--minimum', type=int, default=5)
parser.add_argument('--output', default='reports/live-directory-coverage.csv')
args = parser.parse_args()
root = Path(__file__).resolve().parent.parent
catalog = (root / 'data/catalog.ts').read_text()
regions = re.findall(r"slug: '([^']+)', name: '([^']+)', state: '[^']+', batch: '(?:existing|batch1)'", catalog)
trade_section = catalog.split('export const trades =', 1)[1].split('] as const', 1)[0]
trades = dict(re.findall(r"slug: '([^']+)', name: '([^']+)'", trade_section))
if not regions or not trades:
    raise RuntimeError('Could not read the active directory catalog')


def audit_city(region):
    region_slug, city = region
    request = urllib.request.Request(args.base_url.rstrip('/') + '/' + region_slug,
                                     headers={'User-Agent': 'WhoKnowsAPro-CoverageAudit/1.0'})
    with urllib.request.urlopen(request, timeout=45) as response:
        page = response.read().decode()
    counts = {}
    for href, body in re.findall(r'<a[^>]*href="([^"]+)"[^>]*>(.*?)</a>', page, re.S):
        if not href.startswith('/' + region_slug + '/'):
            continue
        trade = href.split('/')[-1]
        if trade not in trades:
            continue
        text = html.unescape(re.sub('<[^>]*>', ' ', body))
        match = re.search(r'(\d+) business', text)
        if not match and 'No listings yet' not in text:
            raise RuntimeError(f'Unrecognized count for {region_slug}/{trade}')
        count = int(match[1]) if match else 0
        if trade in counts and counts[trade] != count:
            raise RuntimeError(f'Conflicting counts for {region_slug}/{trade}')
        counts[trade] = count
    if set(counts) != set(trades):
        raise RuntimeError(f'Missing category cards for {region_slug}: {set(trades) - set(counts)}')
    return [dict(city=city, city_slug=region_slug, category=trades[trade],
                 category_slug=trade, listing_count=count, minimum=args.minimum,
                 missing=max(0, args.minimum-count), meets_minimum=count >= args.minimum)
            for trade, count in counts.items()]


with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
    rows = [row for city_rows in executor.map(audit_city, regions) for row in city_rows]
rows.sort(key=lambda row: (row['city_slug'], row['category_slug']))
output = Path(args.output)
if not output.is_absolute():
    output = root / output
output.parent.mkdir(parents=True, exist_ok=True)
with output.open('w', newline='') as file:
    writer = csv.DictWriter(file, fieldnames=list(rows[0]))
    writer.writeheader()
    writer.writerows(rows)
below = sum(not row['meets_minimum'] for row in rows)
print(json.dumps(dict(cities=len(regions), categories=len(trades), pairs=len(rows),
                      meets_minimum=len(rows)-below, below_minimum=below,
                      empty=sum(row['listing_count'] == 0 for row in rows),
                      missing_placements=sum(row['missing'] for row in rows)), indent=2))
sys.exit(1 if below else 0)
