import collections, csv, json
from pathlib import Path
from urllib.parse import urlparse

ROOT=Path(__file__).resolve().parent.parent
before=json.loads(Path('/tmp/run1000-before/seed.json').read_text())
after=json.loads(Path('/tmp/run1000-after/seed.json').read_text())
assert after[:len(before)]==before, 'Prior generated record changed'
additions=after[len(before):]
evidence=json.loads((ROOT/'reports/verified-fill1000-2026-10-30.json').read_text())
assert len(additions)==evidence['placementCount'] and 0<len(additions)<=1000
domain=lambda u:urlparse(u).hostname.lower().removeprefix('www.')
for label,values in {
    'id':[x['id'] for x in after],
    'slug':[x['slug'] for x in after],
    'domain placement':[(domain(x['website']),x['region'],x['trade']) for x in after],
    'identity placement':[(x['mainSlug'],x['region'],x['trade']) for x in after],
}.items():assert len(values)==len(set(values)), label
evidence=json.loads((ROOT/'reports/verified-fill1000-2026-10-30.json').read_text())
expected={(domain(x['website']),r,t) for x in evidence['records'] for r in x['regions'] for t in x['trades']}
assert expected=={(domain(x['website']),x['region'],x['trade']) for x in additions}
for x in additions:
    assert x['sourceUrl'] and x['sourceVerifiedAt'] and x['source']=='official_website'
coverage=list(csv.DictReader((ROOT/'reports/coverage-fill1000-before-2026-10-30.csv').open()))
deltas=collections.Counter((x['region'],x['trade']) for x in additions)
for x in coverage:
    n=int(x['listing_count'])+deltas[x['city_slug'],x['category_slug']]
    x.update(listing_count=n,missing=max(0,20-n),meets_minimum=str(n>=20).lower())
with (ROOT/'reports/coverage-fill1000-prepared-2026-10-30.csv').open('w') as f:
    w=csv.DictWriter(f,fieldnames=coverage[0].keys());w.writeheader();w.writerows(coverage)
report={'previousListingsPreserved':len(before),'newPlacements':len(additions),'totalListings':len(after),'duplicateKeys':0,'pairsAt20':sum(int(x['listing_count'])>=20 for x in coverage),'remainingDeficit':sum(x['missing'] for x in coverage),'emptyPairs':sum(int(x['listing_count'])==0 for x in coverage),'additions':additions}
(ROOT/'reports/validation-fill1000-2026-10-30.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k!='additions'},indent=2))
