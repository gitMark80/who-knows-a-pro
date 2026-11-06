"""Check every supporting URL for the fill1000aj evidence ledger."""
import json, os, time, urllib.request
from datetime import datetime, timezone
from pathlib import Path

root = Path(__file__).resolve().parent.parent
run = os.environ.get('FILL_RUN', 'fill1000aj')
ledger = json.loads((root / f'reports/evidence-{run}-2026-11-06.json').read_text())
urls = sorted({url for record in ledger['records'] for url in record['supportingUrls']})

def check(url):
    last = None
    for attempt in range(3):
        try:
            request = urllib.request.Request(url, headers={
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
            })
            with urllib.request.urlopen(request, timeout=35) as response:
                return {'url': url, 'status': response.status, 'finalUrl': response.url, 'passed': response.status == 200}
        except Exception as error:
            last = str(error)
            time.sleep(attempt + 1)
    return {'url': url, 'status': None, 'finalUrl': None, 'passed': False, 'error': last}

results = [check(url) for url in urls]
report = {
    'checkedAt': datetime.now(timezone.utc).isoformat(),
    'manualContentEvidence': f'reports/evidence-{run}-2026-11-06.json',
    'urls': results,
}
(root / f'reports/source-checks-{run}-2026-11-06.json').write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps({'total': len(results), 'passed': sum(item['passed'] for item in results), 'failed': [item for item in results if not item['passed']]}))
