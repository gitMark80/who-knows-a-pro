"""Record current HTTP responses for the selected official websites and evidence URLs."""
import concurrent.futures
import json
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

root = Path(__file__).resolve().parent.parent
records = json.loads((root / 'reports/candidates-fill1000e-2026-10-31.json').read_text())
urls = sorted({url for item in records for url in [item['website'], item['sourceUrl'], *item.get('supplementarySourceUrls', [])]})

def check(url):
    result = {'url': url, 'checkedAt': datetime.now(timezone.utc).isoformat()}
    try:
        request = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(request, timeout=25) as response:
            body = response.read(2000000)
            result.update(httpStatus=response.status, finalUrl=response.url, contentType=response.headers.get('Content-Type'), bytesRead=len(body), accessible=response.status == 200 and len(body) > 100)
    except Exception as error:
        result.update(accessible=False, error=str(error))
    return result

with concurrent.futures.ThreadPoolExecutor(max_workers=6) as executor:
    checks = list(executor.map(check, urls))
report_path = root / 'reports/http-sources-fill1000e-2026-10-31.json'
previous = json.loads(report_path.read_text()) if report_path.exists() else {}
report = {'method': 'Direct GET request, alongside separately reviewed official content from public web retrieval', 'checks': checks, 'previousChecks': previous.get('checks', [])}
report_path.write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps({'total': len(checks), 'accessible': sum(c['accessible'] for c in checks), 'failed': [c for c in checks if not c['accessible']]}, indent=2))
