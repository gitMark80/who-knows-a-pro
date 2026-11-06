"""Verify every fill1000aj card, contextual profile and official destination."""
import concurrent.futures, html, json, os, re, urllib.parse, urllib.request, sys
from datetime import datetime, timezone
from pathlib import Path

root = Path(__file__).resolve().parent.parent
run = os.environ.get('FILL_RUN', 'fill1000aj')
rows = json.loads((root / f'reports/validation-{run}-2026-11-06.json').read_text())['additions']
base = 'https://whoknowsapro.com'

def host(url):
    return (urllib.parse.urlparse(html.unescape(url)).hostname or '').removeprefix('www.').lower()

def get(url):
    request = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(request, timeout=35) as response:
        return response.status, response.url, response.read().decode()

def check(pair):
    region, trade = pair
    url = f'{base}/{region}/{trade}'
    group = [row for row in rows if row['region'] == region and row['trade'] == trade]
    try:
        status, _, page = get(url)
        cards = re.findall(r'<article\b[^>]*>.*?</article>', page, re.S)
        output = []
        for row in group:
            found = []
            for card in cards:
                links = [html.unescape(item) for item in re.findall(r'href="([^"]+)"', card)]
                if any(urllib.parse.urlparse(item).path == f'/business/{row["mainSlug"]}' for item in links):
                    found.append((card, links))
            result = {'name': row['name'], 'region': region, 'trade': trade, 'url': url, 'cards': len(found), 'httpStatus': status}
            if len(found) == 1:
                links = found[0][1]
                official = any(host(item) == host(row['website']) for item in links)
                profile = next(item for item in links if urllib.parse.urlparse(item).path == f'/business/{row["mainSlug"]}')
                context = urllib.parse.parse_qs(urllib.parse.urlparse(profile).query) == {'region': [region], 'trade': [trade]}
                profile_status, profile_final, profile_page = get(urllib.parse.urljoin(base, profile))
                profile_link = any(host(item) == host(row['website']) for item in re.findall(r'href="([^"]+)"', profile_page))
                result.update(officialLinkFound=official, contextCorrect=context, profileStatus=profile_status, profileOfficialLinkFound=profile_link, profileUrl=profile_final, passed=status == 200 and official and context and profile_status == 200 and profile_link)
            else:
                result['passed'] = False
            output.append(result)
        return output
    except Exception as error:
        return [{'url': url, 'passed': False, 'error': str(error)}]

with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    results = [item for group in pool.map(check, sorted({(row['region'], row['trade']) for row in rows})) for item in group]
report = {
    'checkedAt': datetime.now(timezone.utc).isoformat(),
    'sourceCommit': sys.argv[1] if len(sys.argv) > 1 else None,
    'deploymentId': sys.argv[2] if len(sys.argv) > 2 else None,
    'placements': results,
    'total': len(rows),
    'passed': sum(item['passed'] for item in results),
    'allPassed': len(results) == len(rows) and all(item['passed'] for item in results),
}
(root / f'reports/live-{run}-2026-11-06.json').write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps({key: value for key, value in report.items() if key != 'placements'}))
print(json.dumps([item for item in results if not item['passed']]))
