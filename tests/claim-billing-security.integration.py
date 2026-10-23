"""End-to-end checks for claiming, verification, quote requests, Stripe webhooks, tracking and SEO.

Run ONLY against a local production build that uses an isolated SQLite file and fake keys:
  TURSO_DATABASE_URL=file:/tmp/wkap-flows.db EMAIL_OUTBOX_FILE=/tmp/wkap-outbox.jsonl \
  STRIPE_SECRET_KEY=sk_test_dummy STRIPE_WEBHOOK_SECRET=whsec_integration ADMIN_EMAIL=admin@example.test \
  SITE_URL=http://127.0.0.1:3091 pnpm start -p 3091
  python tests/claim-billing-security.integration.py /tmp/wkap-flows.db /tmp/wkap-outbox.jsonl

No real email is sent and no Stripe account is contacted with a valid key, so nobody can be charged.
"""
import hashlib, hmac, json, re, sqlite3, sys, time, urllib.error, urllib.parse, urllib.request

BASE = 'http://127.0.0.1:3091'
DB, OUTBOX = sys.argv[1], sys.argv[2]
WEBHOOK_SECRET = 'whsec_integration'
UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/130 Safari/537.36'


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


raw = urllib.request.build_opener(NoRedirect)


def call(path, payload=None, form=None, origin=BASE, ip='198.51.100.1', cookie=None, agent=UA, method=None, headers=None, follow=False):
    h = {'user-agent': agent, 'x-forwarded-for': ip}
    if origin:
        h['origin'] = origin
    if cookie:
        h['cookie'] = cookie
    data = None
    if payload is not None:
        h['content-type'] = 'application/json'
        data = payload if isinstance(payload, bytes) else json.dumps(payload).encode()
    if form is not None:
        h['content-type'] = 'application/x-www-form-urlencoded'
        data = urllib.parse.urlencode(form).encode()
    h.update(headers or {})
    request = urllib.request.Request(BASE + path, data=data, headers=h, method=method)
    opener = urllib.request.build_opener() if follow else raw
    try:
        with opener.open(request) as response:
            return response.status, response.read().decode(), {k.lower(): v for k, v in response.headers.items()}
    except urllib.error.HTTPError as error:
        return error.code, error.read().decode(), {k.lower(): v for k, v in error.headers.items()}


def body(text):
    try:
        return json.loads(text)
    except ValueError:
        return {}


def outbox():
    try:
        with open(OUTBOX) as handle:
            return [json.loads(line) for line in handle if line.strip()]
    except FileNotFoundError:
        return []


def last_link(to):
    messages = [m for m in outbox() if m['to'] == to]
    assert messages, f'no email to {to}'
    match = re.search(r'href="([^"]*verify-claim\?token=[^"]+)"', messages[-1]['html'])
    assert match, messages[-1]['html'][:400]
    return match.group(1).replace('&amp;', '&')


def token_of(link):
    return urllib.parse.parse_qs(urllib.parse.urlparse(link).query)['token'][0]


def claim(ip, **fields):
    data = {
        'contactName': 'Pat Owner', 'businessName': 'Gulf Test Plumbing', 'website': 'https://gulf-test-plumbing.example',
        'location': 'Pensacola, FL', 'region': 'pensacola-fl', 'trade': 'plumbing', 'formMs': 9000,
    }
    data.update(fields)
    return call('/api/claim', data, ip=ip)


def sign(payload):
    timestamp = str(int(time.time()))
    digest = hmac.new(WEBHOOK_SECRET.encode(), f'{timestamp}.{payload}'.encode(), hashlib.sha256).hexdigest()
    return f't={timestamp},v1={digest}'


def webhook(event_type, subscription, event_id):
    payload = json.dumps({'id': event_id, 'object': 'event', 'type': event_type, 'api_version': '2025-01-01', 'created': int(time.time()),
                          'data': {'object': subscription}, 'livemode': False, 'pending_webhooks': 1, 'request': {'id': None}})
    return call('/api/stripe/webhook', payload.encode(), origin=None, headers={'stripe-signature': sign(payload)})


# Warm up so the schema exists before the test reads SQLite directly.
call('/api/events', {'event': 'pricing_viewed', 'path': '/pricing'})
db = sqlite3.connect(DB)
count = lambda sql, *args: db.execute(sql, args).fetchone()[0]

# --- Claim endpoint protection -------------------------------------------------------------
assert call('/api/claim', {'email': 'x@y.z'}, origin=None)[0] == 403, 'claim requires same-origin'
assert call('/api/claim', {'email': 'x@y.z'}, origin='https://evil.example')[0] == 403
status, text, _ = claim('203.0.113.10', email='bot@gulf-test-plumbing.example', companyFax='spam')
assert status == 200 and count("SELECT COUNT(*) FROM claims WHERE email='bot@gulf-test-plumbing.example'") == 0, 'honeypot drops silently'
status, text, _ = claim('203.0.113.11', email='fast@gulf-test-plumbing.example', formMs=150)
assert status == 400 and 'press the button again' in body(text).get('error', '') and count("SELECT COUNT(*) FROM claims WHERE email='fast@gulf-test-plumbing.example'") == 0, 'instant submission asks the person to retry'
assert count("SELECT COUNT(*) FROM analytics_events WHERE event='form_blocked'") >= 2

# --- New business: domain email verifies via scanner-safe link -------------------------------
status, text, _ = claim('203.0.113.20', email='pat@gulf-test-plumbing.example')
assert status == 200 and 'Check pat@gulf-test-plumbing.example' in body(text).get('message', ''), text
link = last_link('pat@gulf-test-plumbing.example')
token = token_of(link)
for _ in range(2):  # an email scanner prefetching the link must not consume it
    status, _, headers = call('/api/verify-claim?token=' + urllib.parse.quote(token), origin=None)
    assert status == 303 and '/claim/verify?token=' in headers['location'], headers
status, page, _ = call('/claim/verify?token=' + urllib.parse.quote(token), origin=None)
assert status == 200 and 'Confirm and continue' in page and 'noindex' in page
assert call('/api/verify-claim', form={'token': token}, origin='https://evil.example')[0] == 303
assert count("SELECT COUNT(*) FROM claims WHERE status='verified'") == 0, 'cross-site POST must not verify'
status, _, headers = call('/api/verify-claim', form={'token': token})
assert status == 303 and headers['location'].endswith('/dashboard?claimed=1'), headers
session_cookie = re.search(r'pro_session=([^;]+)', headers['set-cookie']).group(0)
status, _, headers = call('/api/verify-claim', form={'token': token})
assert '/claim?error=expired' in headers['location'], 'token is single-use'
business_id, main_slug = db.execute("SELECT business_id, b.main_slug FROM claims c JOIN businesses b ON b.id=c.business_id WHERE c.email='pat@gulf-test-plumbing.example'").fetchone()
assert count("SELECT COUNT(*) FROM analytics_events WHERE event='claim_submitted'") >= 1
assert count("SELECT COUNT(*) FROM analytics_events WHERE event='claim_verified'") == 1
status, dashboard, _ = call('/dashboard', cookie=session_cookie, origin=None)
assert status == 200 and 'Gulf Test Plumbing' in dashboard

# --- Duplicate prevention and takeover protection ------------------------------------------
status, text, _ = claim('203.0.113.21', email='other@gulf-test-plumbing.example', businessName='Gulf Test Plumbing LLC')
assert status == 200 and 'already managed' in body(text)['message'], text
assert count("SELECT COUNT(DISTINCT business_id) FROM claims WHERE email LIKE '%gulf-test-plumbing.example'") == 1, 'same domain attaches to existing listing'
assert count("SELECT COUNT(*) FROM claims WHERE email='other@gulf-test-plumbing.example' AND status='manual_review'") == 1
status, text, _ = claim('203.0.113.22', email='pat@gulf-test-plumbing.example', businessId=business_id)
assert status == 200 and 'secure link' in body(text)['message'], 'returning owner gets a sign-in link'
status, text, _ = claim('203.0.113.23', email='someone@gmail.com', businessName='Gmail Pool Co', website='https://gmail-pool.example', trade='pool-service')
assert status == 200 and 'ownership review' in body(text)['message'], 'free-mail claims go to manual review'

# Strangers flooding a listing cannot lock the verified owner out of signing in.
for i in range(9):
    claim(f'203.0.114.{i}', email=f'stranger{i}@gmail.com', businessId=business_id)
status, text, _ = claim('203.0.113.24', email='pat@gulf-test-plumbing.example', businessId=business_id)
assert status == 200 and 'secure link' in body(text)['message'], ('owner exempt from per-listing limit', text)
# Privacy settings may send Origin: null on same-site form posts; Sec-Fetch-Site still proves the source.
claim('203.0.113.25', email='pat@gulf-test-plumbing.example', businessId=business_id)
status, _, headers = call('/api/verify-claim', form={'token': token_of(last_link('pat@gulf-test-plumbing.example'))}, origin='null', headers={'sec-fetch-site': 'same-origin'})
assert status == 303 and '/dashboard' in headers['location'], headers
status, page, _ = call('/claim/verify?token=x', origin=None)
assert 'content="same-origin"' in page or "content='same-origin'" in page, 'referrer policy must keep Origin on the form post'

# --- Rate limiting -----------------------------------------------------------------------------
statuses = [claim('203.0.113.99', email=f'r{i}@gmail.com', businessName=f'Rate Biz {i}', website=f'https://rate{i}.example')[0] for i in range(7)]
assert statuses[:5] == [200] * 5 and statuses[5] == 429, statuses

# --- Quote requests ------------------------------------------------------------------------------
quote = {'name': 'Casey', 'email': 'casey@example.org', 'phone': '850-555-0100', 'zip': '32501', 'jobDescription': 'Leaking pipe',
         'preferredContactMethod': 'either', 'region': 'pensacola-fl', 'trade': 'plumbing', 'formMs': 8000}
assert call('/api/leads', quote, origin='https://evil.example')[0] == 403
assert call('/api/leads', dict(quote, companyWebsite='x'), ip='198.51.100.50')[0] == 200
assert count('SELECT COUNT(*) FROM leads') == 0, 'honeypot quote is not stored'
status, text, _ = call('/api/leads', quote, ip='198.51.100.51')
assert status == 200 and count('SELECT COUNT(*) FROM leads') == 1, text
assert count("SELECT COUNT(*) FROM analytics_events WHERE event='quote_submitted'") == 1

# --- Stripe webhook: signature, idempotency, Featured lifecycle, cancellation ------------------
def subscription(status, cancel=False):
    return {'id': 'sub_integration', 'object': 'subscription', 'customer': 'cus_integration', 'status': status, 'cancel_at_period_end': cancel,
            'items': {'object': 'list', 'data': [{'id': 'si_1', 'current_period_end': int(time.time()) + 2_592_000}]},
            'metadata': {'business_id': business_id, 'business_slug': main_slug, 'plan': 'featured',
                         'featured_region': 'pensacola-fl', 'featured_trade': 'plumbing', 'utm_source': 'newsletter'}}

bad = json.dumps({'id': 'evt_bad'})
assert call('/api/stripe/webhook', bad.encode(), origin=None, headers={'stripe-signature': 't=1,v1=deadbeef'})[0] == 400
assert webhook('customer.subscription.updated', subscription('active'), 'evt_1')[0] == 200
assert db.execute("SELECT status FROM featured_slots WHERE region='pensacola-fl' AND trade='plumbing'").fetchone()[0] == 'active'
assert db.execute('SELECT tier FROM businesses WHERE id=?', (business_id,)).fetchone()[0] == 'featured'
assert count("SELECT COUNT(*) FROM analytics_events WHERE event='subscription_activated' AND source='newsletter'") == 1
assert body(webhook('customer.subscription.updated', subscription('active'), 'evt_1')[1]).get('duplicate') is True
status, text, _ = call('/api/checkout', {'plan': 'enhanced'}, cookie=session_cookie)
assert status == 409 and body(text).get('manageBilling'), 'no second subscription while one is active'
webhook('customer.subscription.updated', subscription('past_due'), 'evt_2')
assert db.execute("SELECT status FROM featured_slots WHERE stripe_subscription_id='sub_integration'").fetchone()[0] == 'past_due', 'slot held while past due'
status, page, _ = call('/pensacola-fl/plumbing', origin=None)
assert 'Exclusive featured business' not in page, 'past-due slot is not shown'
status, text, _ = call('/api/checkout', {'plan': 'enhanced'}, cookie=session_cookie)
assert status == 409, 'past-due customers are sent to billing, not a second checkout'
webhook('customer.subscription.updated', subscription('active'), 'evt_3')
assert db.execute("SELECT status FROM featured_slots WHERE stripe_subscription_id='sub_integration'").fetchone()[0] == 'active', 'slot restored after payment'
assert count("SELECT COUNT(*) FROM analytics_events WHERE event='subscription_activated'") == 1, 'recovery is not a new activation'
webhook('customer.subscription.updated', subscription('active', cancel=True), 'evt_4')
assert count("SELECT COUNT(*) FROM analytics_events WHERE event='subscription_cancel_scheduled'") == 1
webhook('customer.subscription.deleted', subscription('canceled', cancel=True), 'evt_5')
assert count("SELECT COUNT(*) FROM featured_slots WHERE stripe_subscription_id='sub_integration'") == 0
assert db.execute('SELECT tier FROM businesses WHERE id=?', (business_id,)).fetchone()[0] == 'free'
assert count("SELECT COUNT(*) FROM analytics_events WHERE event='subscription_canceled'") == 1
status, text, _ = call('/api/checkout', {'plan': 'enhanced'}, cookie=session_cookie)
assert status == 503, 'checkout reaches Stripe only with a real test key (dummy key fails safely)'

# --- Client events -----------------------------------------------------------------------------
assert call('/api/events', {'event': 'claim_page_viewed', 'path': '/claim'}, origin='https://evil.example')[0] == 403
assert call('/api/events', {'event': 'not_allowed'})[0] == 400
assert call('/api/events', {'event': 'claim_started'}, agent='python-requests/2.31')[0] == 204
assert call('/api/events', {'event': 'claim_started', 'path': '/claim', 'wd': True})[0] == 200
assert count("SELECT COUNT(*) FROM analytics_events WHERE event='claim_started' AND automation=1") == 1

# --- SEO --------------------------------------------------------------------------------------
status, robots, _ = call('/robots.txt', origin=None)
assert 'Disallow: /claim?' in robots and 'Disallow: /pricing?' in robots and 'Disallow: /api/' in robots
status, sitemap, _ = call('/sitemap.xml', origin=None)
assert status == 200 and f'/business/{main_slug}<' in sitemap and '/pensacola-fl/plumbing<' in sitemap
assert '/claim' not in sitemap and '/dashboard' not in sitemap
status, results, _ = call('/api/business-search?q=plumb', origin=None)
seed = next(item for item in body(results)['results'] if not item['claimed'])
status, profile, _ = call(f"/business/{seed['slug']}", origin=None, follow=True)
assert status == 200 and re.search(r'<meta name="robots" content="noindex', profile), 'name-only profiles are noindexed'
assert f"/business/{seed['slug']}<" not in sitemap
status, pricing, _ = call('/pricing', origin=None)
assert status == 200 and 'Free claimed listing' in pricing and 'guaranteed leads' not in pricing.lower() and 'gets you chosen' not in pricing

# --- Admin dashboard ---------------------------------------------------------------------------
db.execute('INSERT OR REPLACE INTO admin_sessions VALUES (?,?,?)', (hashlib.sha256(b'admin-flows').hexdigest(), 'admin@example.test', int(time.time() * 1000) + 3_600_000))
db.commit()
status, funnel, _ = call('/admin/funnel', cookie='admin_session=admin-flows', origin=None)
assert status == 200 and 'Conversion dashboard' in funnel and 'Claim records by day' in funnel
assert call('/admin/funnel', origin=None)[0] in (303, 307, 308), 'funnel requires admin'

print('PASS: origin checks, honeypots, timing, rate limits, scanner-safe single-use verification, duplicate and takeover prevention,'
      ' returning-owner sign-in, quote handling, signed/idempotent webhooks, Featured hold/restore/release, checkout guard,'
      ' server-confirmed events with attribution, robots/sitemap/noindex rules, and admin funnel access.')
