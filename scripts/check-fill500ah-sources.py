"""Check official destinations after manual content qualification; HTTP alone is not eligibility."""
import concurrent.futures, hashlib, html, json, re, urllib.request
from datetime import datetime, timezone
from pathlib import Path

root = Path(__file__).resolve().parent.parent
ledger = json.loads((root/'reports/evidence-fill500ah-2026-11-05.json').read_text())
urls = sorted({u for r in ledger['records'] for u in r['supportingUrls']})
def check(url):
    result = {'url':url,'checkedAt':datetime.now(timezone.utc).isoformat()}
    try:
        request = urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
        with urllib.request.urlopen(request,timeout=25) as response:
            data = response.read()
            text = data.decode('utf-8',errors='replace')
            title = re.search(r'<title[^>]*>(.*?)</title>',text,re.I|re.S)
            result.update(httpStatus=response.status,finalUrl=response.url,bytes=len(data),sha256=hashlib.sha256(data).hexdigest(),title=html.unescape(title.group(1)).strip() if title else None)
    except Exception as error:
        result['error'] = str(error)
    return result
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
    results = list(pool.map(check,urls))
(root/'reports/source-checks-fill500ah-2026-11-05.json').write_text(json.dumps({'checkedAt':datetime.now(timezone.utc).isoformat(),'manualContentEvidence':'reports/evidence-fill500ah-2026-11-05.json','urls':results},indent=2)+'\n')
print(json.dumps({'checked':len(results),'http200':sum(x.get('httpStatus')==200 for x in results),'failures':[x for x in results if x.get('httpStatus')!=200]}))
