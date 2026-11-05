"""Verify all new category cards, contextual profiles and official destinations."""
import concurrent.futures,html,json,re,urllib.parse,urllib.request,sys
from datetime import datetime,timezone
from pathlib import Path
root=Path(__file__).resolve().parent.parent
rows=json.loads((root/'reports/validation-fill500af-2026-11-05.json').read_text())['additions']
base='https://whoknowsapro.com'
def host(u):return (urllib.parse.urlparse(html.unescape(u)).hostname or '').removeprefix('www.').lower()
def get(u):
 with urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0'}),timeout=35) as r:return r.status,r.url,r.read().decode()
def check(pair):
 region,trade=pair;url=f'{base}/{region}/{trade}'; group=[x for x in rows if x['region']==region and x['trade']==trade]
 try:
  status,final,page=get(url);cards=re.findall(r'<article\b[^>]*>.*?</article>',page,re.S);out=[]
  for row in group:
   found=[]
   for card in cards:
    links=[html.unescape(x) for x in re.findall(r'href="([^"]+)"',card)]
    if any(urllib.parse.urlparse(u).path==f'/business/{row["mainSlug"]}' for u in links):found.append((card,links))
   result={'name':row['name'],'region':region,'trade':trade,'url':url,'cards':len(found),'httpStatus':status}
   if len(found)==1:
    links=found[0][1];official=any(host(u)==host(row['website']) for u in links)
    profile=next(u for u in links if urllib.parse.urlparse(u).path==f'/business/{row["mainSlug"]}')
    context=urllib.parse.parse_qs(urllib.parse.urlparse(profile).query)=={'region':[region],'trade':[trade]}
    ps,pf,pp=get(urllib.parse.urljoin(base,profile));plink=any(host(u)==host(row['website']) for u in re.findall(r'href="([^"]+)"',pp))
    result.update(officialLinkFound=official,contextCorrect=context,profileStatus=ps,profileOfficialLinkFound=plink,profileUrl=pf,passed=status==200 and official and context and ps==200 and plink)
   else:result['passed']=False
   out.append(result)
  return out
 except Exception as e:return [{'url':url,'passed':False,'error':str(e)}]
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:results=[r for group in pool.map(check,sorted({(x['region'],x['trade']) for x in rows})) for r in group]
report={'checkedAt':datetime.now(timezone.utc).isoformat(),'sourceCommit':sys.argv[1] if len(sys.argv)>1 else None,'placements':results,'total':len(rows),'passed':sum(x['passed'] for x in results),'allPassed':len(results)==len(rows) and all(x['passed'] for x in results)}
(root/'reports/live-fill500af-2026-11-05.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items() if k!='placements'}));print(json.dumps([x for x in results if not x['passed']]))
