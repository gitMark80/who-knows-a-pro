#!/usr/bin/env python3
"""Check all 58 new live listing cards and the affected business profiles."""
import concurrent.futures
from datetime import datetime, timezone
import html
import json
from pathlib import Path
import re
import sys
import urllib.parse
import urllib.request

ROOT = Path(__file__).resolve().parent.parent
BASE = 'https://whoknowsapro.com'
ADDITIONS = json.loads((ROOT / 'reports/validation-empty58-2026-10-30.json').read_text())['additions']

def host(url):
    return (urllib.parse.urlparse(html.unescape(url)).hostname or '').lower().removeprefix('www.')

def fetch(path):
    request = urllib.request.Request(BASE + path, headers={'User-Agent': 'WhoKnowsAPro-LiveVerification/1.0'})
    with urllib.request.urlopen(request, timeout=45) as response:
        return response.status, response.read().decode()

def check(row, profile=False):
    path = '/business/' + row['mainSlug'] if profile else '/' + row['region'] + '/' + row['trade']
    result = {'url': BASE+path, 'name': row['name'], 'domain': host(row['website']), 'checkedAt':datetime.now(timezone.utc).isoformat()}
    try:
        status, page = fetch(path)
        if profile:
            matches = [page]
        else:
            matches = [card for card in re.findall(r'<article\b[^>]*>.*?</article>', page, re.S) if f'href="/business/{row["mainSlug"]}"' in card]
        result['httpStatus'] = status
        result['matchingCards'] = len(matches)
        result['officialLinkFound'] = any(host(link) == result['domain'] for card in matches for link in re.findall(r'href="([^"]+)"',card))
        result['passed'] = status == 200 and len(matches) == 1 and result['officialLinkFound']
    except Exception as error:
        result.update(passed=False,error=str(error))
    return result

with concurrent.futures.ThreadPoolExecutor(max_workers=6) as executor:
    placements = list(executor.map(check, ADDITIONS))
profiles_by_slug = {row['mainSlug']:row for row in ADDITIONS}
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as executor:
    profiles = list(executor.map(lambda row: check(row, True), profiles_by_slug.values()))
report = {'sourceCommit':sys.argv[1] if len(sys.argv)>1 else None, 'checkedAt':datetime.now(timezone.utc).isoformat(), 'placementCount':len(placements), 'placementsPassed':sum(row['passed'] for row in placements), 'profileCount':len(profiles), 'profilesPassed':sum(row['passed'] for row in profiles), 'placements':placements, 'profiles':profiles}
(ROOT / 'reports/live-empty58-2026-10-30.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({key:value for key,value in report.items() if key not in ('placements','profiles')},indent=2))
failures = [row for row in placements+profiles if not row['passed']]
if failures: print(json.dumps(failures, indent=2))
sys.exit(1 if failures else 0)
