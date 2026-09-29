"""Run only against a local server using an isolated SQLite database.
Usage: python tests/business-results.integration.py /tmp/wkap-results-test.db
Server env: TURSO_DATABASE_URL=file:/tmp/wkap-results-test.db ADMIN_EMAIL=admin@example.test
"""
import hashlib, json, sqlite3, sys, time, urllib.request, urllib.error
BASE='http://127.0.0.1:3091'
DB=sys.argv[1]
def req(path, payload=None, origin=BASE, agent='Mozilla/5.0 WKAP integration test', cookie=None):
    headers={'user-agent':agent,'origin':origin,'x-forwarded-for':'192.0.2.9'}
    if cookie: headers['cookie']=cookie
    if payload is not None: headers['content-type']='application/json'
    r=urllib.request.Request(BASE+path,data=json.dumps(payload).encode() if payload is not None else None,headers=headers)
    try:
        with urllib.request.urlopen(r) as response: return response.status,response.read().decode(),response.url
    except urllib.error.HTTPError as e: return e.code,e.read().decode(),e.url
# The first query initializes the isolated schema. No production DB or real email is used.
req('/api/business-clicks', {'slug':'not-a-business','action':'website','source':'listing'})
db=sqlite3.connect(DB); now=int(time.time()*1000)
for slug,test in [('results-fixture-a',0),('results-fixture-b',0),('results-fixture-private',1)]:
    db.execute('INSERT OR REPLACE INTO businesses (id,name,slug,main_slug,region,trade,location,website,phone,owner_email,approved,is_test,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',(slug,slug,slug,slug,'pensacola-fl','plumbing','Pensacola','https://example.com','5550100','owner@example.test',1,test,now))
for token,b in [('owner-a','results-fixture-a'),('owner-b','results-fixture-b')]:
    db.execute('INSERT OR REPLACE INTO sessions VALUES (?,?,?,?)',(hashlib.sha256(token.encode()).hexdigest(),b,'owner@example.test',now+3600000))
db.execute('INSERT OR REPLACE INTO admin_sessions VALUES (?,?,?)',(hashlib.sha256(b'admin-test').hexdigest(),'admin@example.test',now+3600000))
db.commit()
p={'slug':'results-fixture-a','action':'website','source':'listing'}
assert req('/api/business-clicks',p,origin='https://foreign.example')[0]==403
assert req('/api/business-clicks',p,agent='Googlebot')[0]==204
assert req('/api/business-clicks',dict(p,action='invalid'))[0]==400
assert req('/api/business-clicks',dict(p,slug='results-fixture-private'))[0]==404
assert req('/api/business-clicks',p)[0]==200
assert req('/api/business-clicks',dict(p,source='profile'))[0]==200
assert req('/api/business-clicks',dict(p,action='phone'))[0]==200
assert db.execute("SELECT COUNT(*) FROM business_clicks WHERE business_slug='results-fixture-a'").fetchone()[0]==2
# Previous-month fixture and routed/unrouted leads verify periods and attribution.
import datetime
start=datetime.datetime.now(datetime.timezone.utc).replace(day=1,hour=0,minute=0,second=0,microsecond=0)
prior=int(start.timestamp()*1000)-1000
db.execute('INSERT OR REPLACE INTO business_clicks VALUES (?,?,?,?,?)',('previous-month','results-fixture-a','website','profile',prior))
for slug in ['results-fixture-a','results-fixture-b']:
    db.execute('INSERT OR REPLACE INTO profile_views VALUES (?,?,?,?)',(slug+'-view',slug,'test',now))
for i,routed,slug in [('assigned-a',1,'results-fixture-a'),('assigned-b',1,'results-fixture-b'),('unassigned',0,None)]:
    db.execute('INSERT OR REPLACE INTO leads (id,name,email,phone,zip,job_description,preferred_contact_method,region,trade,page_url,ip_address,routed,routed_business_slug,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',(i,'Test','test@example.test','5550100','32501','Test','email','pensacola-fl','plumbing',BASE,'192.0.2.9',routed,slug,now))
db.commit()
assert req('/dashboard')[2].endswith('/claim')
assert req('/admin/results')[2].endswith('/admin')
status,html,_=req('/dashboard',cookie='pro_session=owner-a')
assert status==200 and 'Interest in your business' in html and 'results-fixture-b' not in html
status,admin,_=req('/admin/results?q=results-fixture',cookie='admin_session=admin-test')
assert status==200 and 'results-fixture-a' in admin and 'results-fixture-b' in admin and 'results-fixture-private' not in admin
# Read the rendered metric cards, rather than implementation-internal values.
from html.parser import HTMLParser
class Text(HTMLParser):
    def __init__(self): super().__init__(); self.parts=[]; self.skip=0
    def handle_starttag(self,t,a):
        if t in ['script','style']: self.skip+=1
    def handle_endtag(self,t):
        if t in ['script','style']: self.skip-=1
    def handle_data(self,d):
        if not self.skip: self.parts.append(d)
t=Text();t.feed(html);text=' '.join(' '.join(t.parts).split())
for expected in ['Website clicks 1 Last month: 1','Phone clicks 1 Last month: 0','Assigned quote requests 1 Last month: 0']:
    assert expected in text, (expected,text[:1800])
print('PASS: valid clicks; cross-origin, invalid and bot rejection; private listing exclusion; repeat deduplication; monthly aggregation; lead attribution; owner isolation; admin access.')
