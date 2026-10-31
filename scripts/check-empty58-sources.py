#!/usr/bin/env python3
"""Fetch the explicitly researched official URLs; never scrape listing services."""
import concurrent.futures
import hashlib
from html.parser import HTMLParser
import json
from datetime import datetime, timezone
from pathlib import Path
import sys
import urllib.request

ROOT = Path(__file__).resolve().parent.parent
CANDIDATES = ROOT / 'reports/candidates-empty58-2026-10-30.json'
CACHE = Path('/tmp/empty58-official-pages')
CACHE.mkdir(exist_ok=True)

class Text(HTMLParser):
    def __init__(self):
        super().__init__()
        self.skip = 0
        self.parts = []
    def handle_starttag(self, tag, attrs):
        if tag in ('script', 'style', 'noscript'): self.skip += 1
    def handle_endtag(self, tag):
        if tag in ('script', 'style', 'noscript'): self.skip = max(0, self.skip-1)
    def handle_data(self, data):
        if not self.skip and data.strip(): self.parts.append(data.strip())

def check(url):
    result = {'url': url}
    for attempt in range(2):
        try:
            request = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0' if attempt else 'Mozilla/5.0 (compatible; WhoKnowsAProSourceVerification/1.0)'})
            with urllib.request.urlopen(request, timeout=35) as response:
                page = response.read().decode('utf-8', errors='replace')
                result.update(status=response.status, finalUrl=response.url, checkedAt=datetime.now(timezone.utc).isoformat())
            parser = Text()
            parser.feed(page)
            visible = '\n'.join(parser.parts)
            digest = hashlib.sha256(page.encode()).hexdigest()
            result.update(textCharacters=len(visible), contentSha256=digest)
            (CACHE / (hashlib.sha256(url.encode()).hexdigest()+'.txt')).write_text(visible)
            result.pop('error', None)
            break
        except Exception as error:
            result['error'] = str(error)
    return result

if __name__ == '__main__':
    rows = json.loads(CANDIDATES.read_text())
    urls = sorted({url for row in rows for url in [row['website'], row['sourceUrl'], *row.get('additionalSourceUrls', [])]})
    report = ROOT / 'reports/source-checks-empty58-2026-10-30.json'
    prior = {row['url']:row for row in json.loads(report.read_text())} if '--retry-failed' in sys.argv and report.exists() else {}
    pending = [url for url in urls if prior.get(url, {}).get('status') != 200]
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
        fresh = {row['url']:row for row in executor.map(check, pending)}
    results = [fresh.get(url, prior.get(url)) for url in urls]
    report.write_text(json.dumps(results, indent=2)+'\n')
    print(json.dumps({'urls': len(results), 'http200': sum(r.get('status')==200 for r in results), 'failures':[r for r in results if r.get('status')!=200]}, indent=2))
