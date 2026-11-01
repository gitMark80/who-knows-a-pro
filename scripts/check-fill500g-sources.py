#!/usr/bin/env python3
import datetime as dt
import json
import ssl
import time
import urllib.request
from pathlib import Path

run = "fill500g"
date = "2026-11-01"
candidates = json.loads(Path(f"reports/candidates-{run}-{date}.json").read_text())
urls = []
for candidate in candidates:
    urls.extend([candidate["website"], candidate["sourceUrl"]])
urls = list(dict.fromkeys(urls))
results = []
for url in urls:
    errors = []
    for attempt in range(1, 4):
        try:
            request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(request, timeout=45, context=ssl.create_default_context()) as response:
                results.append({
                    "url": url,
                    "status": response.status,
                    "finalUrl": response.geturl(),
                    "ok": 200 <= response.status < 400,
                    "attempt": attempt,
                    "priorErrors": errors,
                })
                break
        except Exception as error:
            errors.append(f"{type(error).__name__}: {error}")
            if attempt < 3:
                time.sleep(2 * attempt)
    else:
        results.append({"url": url, "ok": False, "errors": errors})
report = {"checkedAt": dt.datetime.now(dt.timezone.utc).isoformat(), "results": results}
Path(f"reports/http-sources-{run}-{date}.json").write_text(json.dumps(report, indent=2) + "\n")
failed = [row for row in results if not row["ok"]]
print(json.dumps({"checked": len(results), "passed": len(results) - len(failed), "failed": failed}, indent=2))
raise SystemExit(1 if failed else 0)
