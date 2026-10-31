"""Validate curated evidence and append only new, below-target placements."""
import collections, csv, json, subprocess, sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

ROOT=Path(__file__).resolve().parent.parent
source_path=ROOT/'data/verified-coverage-2026-09-28.json'
original=source_path.read_text()
assert original==subprocess.check_output(['git','show','HEAD:data/verified-coverage-2026-09-28.json'],cwd=ROOT).decode()
source=json.loads(original)
seed=json.loads(Path('/tmp/run1000-before/seed.json').read_text())
catalog=json.loads(Path('/tmp/run1000-before/catalog.json').read_text())
candidates=json.loads((ROOT/'reports/candidates-fill1000-2026-10-30.json').read_text())
checks=json.loads(Path('/tmp/fill1000-http.json').read_text())
domain=lambda u:urlparse(u).hostname.lower().removeprefix('www.')
keys={(domain(x['website']),x['region'],x['trade']) for x in seed}
names={domain(x['website']):x['name'] for x in seed}
regions={x['slug'] for x in catalog['activeRegions']}
trades={x['slug'] for x in catalog['visibleTrades']}
counts=collections.Counter((x['region'],x['trade']) for x in seed)
priorities={r:i for i,r in enumerate(['destin-fl','fort-walton-beach-fl','crestview-fl','panama-city-fl'])}
options=[]; failures=[]
for c in candidates:
    urls=[c['website'],c['sourceUrl'],*c.get('additionalSourceUrls',[])]
    bad=[u for u in urls if checks.get(u,{}).get('status')!=200]
    if bad:
        failures.append({'name':c['name'],'unverifiedUrls':bad});continue
    assert len(c['evidenceNote'])>30
    for r in c['regions']:
        assert r in regions
        for t in c['trades']:
            assert t in trades
            k=(domain(c['website']),r,t)
            if k not in keys and counts[r,t]<20:options.append((r,t,c))
options.sort(key=lambda x:(0 if x[0] in priorities else 1,counts[x[0],x[1]],priorities.get(x[0],100)))
selected=[]; grouped={}; timestamp=datetime.now(timezone.utc).isoformat()
for r,t,c in options:
    k=(domain(c['website']),r,t)
    if k in keys or counts[r,t]>=20:continue
    if len(selected)>=1000:break
    keys.add(k);counts[r,t]+=1;selected.append(k)
    # One trade per source row prevents any unverified cross-product placement.
    g=(domain(c['website']),t,c['sourceUrl'])
    if g not in grouped:
        grouped[g]={**c,'name':names.get(domain(c['website']),c['name']),'regions':[],'trades':[t],'sourceVerifiedAt':timestamp}
    grouped[g]['regions'].append(r)
records=list(grouped.values())
report={'baselineCommit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT).decode().strip(),'target':1000,'status':'prepared_not_published','placementCount':len(selected),'sourceRecordCount':len(records),'uniqueDomains':len({k[0] for k in selected}),'additionsByCity':dict(collections.Counter(k[1] for k in selected)),'unverifiedCandidates':failures,'records':records}
if '--write' in sys.argv:
    assert len(selected)==1000 or ('--checkpoint' in sys.argv and 0<len(selected)<1000), 'Partial checkpoint must be explicit; target remains 1000'
    report['runShortfall']=1000-len(selected)
    clean=[{k:v for k,v in c.items() if k!='additionalSourceUrls'} for c in records]
    source_path.write_text(original.rstrip()[:-1].rstrip()+',\n'+',\n'.join('  '+json.dumps(c,indent=2).replace('\n','\n  ') for c in clean)+'\n]\n')
    assert json.loads(source_path.read_text())[:len(source)]==source
    (ROOT/'reports/verified-fill1000-2026-10-30.json').write_text(json.dumps(report,indent=2)+'\n')
    used={u for c in records for u in [c['website'],c['sourceUrl'],*c.get('additionalSourceUrls',[])]}
    (ROOT/'reports/source-checks-fill1000-2026-10-30.json').write_text(json.dumps([checks[u] for u in sorted(used)],indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k!='records'},indent=2))
