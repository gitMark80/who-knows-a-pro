"""Check official destinations after manual content qualification; HTTP alone is not eligibility."""
import concurrent.futures, hashlib, html, json, re, time, urllib.request
from datetime import datetime, timezone
from pathlib import Path

root = Path(__file__).resolve().parent.parent
ledger = json.loads((root/'reports/evidence-fill1000ai-2026-11-06.json').read_text())
urls = sorted({url for record in ledger['records'] for url in record['supportingUrls']})

def check(url):
    attempts = []
    for attempt in range(1, 4):
        result = {'url': url, 'checkedAt': datetime.now(timezone.utc).isoformat(), 'attempt': attempt}
        try:
            request = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(request, timeout=35) as response:
                data = response.read()
                text = data.decode('utf-8', errors='replace')
                title = re.search(r'<title[^>]*>(.*?)</title>', text, re.I | re.S)
                result.update(httpStatus=response.status, finalUrl=response.url, bytes=len(data), sha256=hashlib.sha256(data).hexdigest(), title=html.unescape(title.group(1)).strip() if title else None)
        except Exception as error:
            result['error'] = str(error)
        attempts.append(result)
        if result.get('httpStatus') == 200:
            return {**result, 'attempts': [dict(item) for item in attempts]}
        time.sleep(attempt)
    return {**result, 'attempts': [dict(item) for item in attempts]}

with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
    results = list(pool.map(check, urls))
report = {'checkedAt': datetime.now(timezone.utc).isoformat(), 'manualContentEvidence': 'reports/evidence-fill1000ai-2026-11-06.json', 'urls': results}
(root/'reports/source-checks-fill1000ai-2026-11-06.json').write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps({'checked': len(results), 'http200': sum(item.get('httpStatus') == 200 for item in results), 'failures': [item for item in results if item.get('httpStatus') != 200]}))
