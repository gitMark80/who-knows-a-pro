"""Fetch each affected category page once, verify every new card and profile."""
import collections,concurrent.futures,html,json,re,sys,time,urllib.parse,urllib.request
from datetime import datetime,timezone
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
BASE='https://whoknowsapro.com'
additions=json.loads((ROOT/'reports/validation-fill1000-2026-10-30.json').read_text())['additions']
host=lambda u:(urllib.parse.urlparse(html.unescape(u)).hostname or '').lower().removeprefix('www.')
groups=collections.defaultdict(list)
for x in additions:groups['/'+x['region']+'/'+x['trade']].append(x)
profiles={x['mainSlug']:x for x in additions}
def check(item,profile=False):
    path,rows=item;results=[]
    for attempt in range(3):
        try:
            req=urllib.request.Request(BASE+path,headers={'User-Agent':'WhoKnowsAPro-LiveVerification/1.0'})
            with urllib.request.urlopen(req,timeout=45) as r:status=r.status;page=r.read().decode()
            cards=re.findall(r'<article\b[^>]*>.*?</article>',page,re.S)
            for x in rows:
                matched=[page] if profile else [c for c in cards if f'href="/business/{x["mainSlug"]}"' in c]
                linked=any(host(u)==host(x['website']) for c in matched for u in re.findall(r'href="([^"]+)"',c))
                results.append(dict(url=BASE+path,name=x['name'],mainSlug=x['mainSlug'],domain=host(x['website']),httpStatus=status,matchingCards=len(matched),officialLinkFound=linked,passed=status==200 and len(matched)==1 and linked))
            return results
        except Exception as e:
            error=str(e)
            if attempt<2:time.sleep(1)
    return [dict(url=BASE+path,name=x['name'],passed=False,error=error) for x in rows]
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:placements=[r for result in pool.map(check,groups.items()) for r in result]
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:profile_results=[r for result in pool.map(lambda x:check(x,True),[('/business/'+slug,[x]) for slug,x in profiles.items()]) for r in result]
report=dict(sourceCommit=sys.argv[1],checkedAt=datetime.now(timezone.utc).isoformat(),categoryPages=len(groups),placementCount=len(placements),placementsPassed=sum(x['passed'] for x in placements),profileCount=len(profile_results),profilesPassed=sum(x['passed'] for x in profile_results),placements=placements,profiles=profile_results)
(ROOT/'reports/live-fill1000-2026-10-30.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k not in ('placements','profiles')},indent=2))
failures=[x for x in placements+profile_results if not x['passed']]
if failures:print(json.dumps(failures,indent=2))
sys.exit(bool(failures))
