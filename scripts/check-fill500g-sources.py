#!/usr/bin/env python3
import datetime as dt
import concurrent.futures
import json
import os
import ssl
import time
import urllib.request
from pathlib import Path

run = os.environ.get("FILL_RUN", "fill500g")
date = os.environ.get("FILL_DATE", "2026-11-01")
timeout = int(os.environ.get("FILL_HTTP_TIMEOUT", "45"))
retries = int(os.environ.get("FILL_HTTP_RETRIES", "3"))
workers = int(os.environ.get("FILL_HTTP_WORKERS", "8"))
records_path = os.environ.get("FILL_SOURCE_RECORDS")
if records_path:
    payload = json.loads(Path(records_path).read_text())
    candidates = payload if isinstance(payload, list) else payload["records"]
else:
    candidates = json.loads(Path(f"reports/candidates-{run}-{date}.json").read_text())
urls = []
for candidate in candidates:
    urls.extend([candidate["website"], candidate["sourceUrl"]])
urls = list(dict.fromkeys(urls))
def check(url):
    errors = []
    for attempt in range(1, retries + 1):
        try:
            request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(request, timeout=timeout, context=ssl.create_default_context()) as response:
                return {
                    "url": url,
                    "status": response.status,
                    "finalUrl": response.geturl(),
                    "ok": 200 <= response.status < 400,
                    "attempt": attempt,
                    "priorErrors": errors,
                }
        except Exception as error:
            errors.append(f"{type(error).__name__}: {error}")
            if attempt < retries:
                time.sleep(2 * attempt)
    return {"url": url, "ok": False, "errors": errors}

with concurrent.futures.ThreadPoolExecutor(max_workers=workers) as pool:
    results = list(pool.map(check, urls))
report = {"checkedAt": dt.datetime.now(dt.timezone.utc).isoformat(), "results": results}
Path(f"reports/http-sources-{run}-{date}.json").write_text(json.dumps(report, indent=2) + "\n")
failed = [row for row in results if not row["ok"]]
print(json.dumps({"checked": len(results), "passed": len(results) - len(failed), "failed": failed}, indent=2))
raise SystemExit(1 if failed else 0)
