"""Exercise rendered directory-to-profile navigation against an isolated test server.

Usage: python tests/business-profile-context.integration.py /tmp/wkap-profiles.db
"""
import html
import json
import os
import re
import sqlite3
import sys
import time
import urllib.parse
import urllib.request
from html.parser import HTMLParser

BASE = os.environ.get('PROFILE_TEST_BASE', 'http://127.0.0.1:3091')


def get(path):
    with urllib.request.urlopen(BASE + path, timeout=45) as response:
        assert response.status == 200
        return response.read().decode(), response.url


class VisibleText(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts = []
        self.skip = 0

    def handle_starttag(self, tag, attrs):
        if tag in ('script', 'style'):
            self.skip += 1

    def handle_endtag(self, tag):
        if tag in ('script', 'style'):
            self.skip -= 1

    def handle_data(self, data):
        if not self.skip:
            self.parts.append(data)


def text(page):
    parser = VisibleText()
    parser.feed(page)
    return ' '.join(' '.join(parser.parts).split())


def title(page):
    return html.unescape(re.search(r'<title>(.*?)</title>', page).group(1))


def hrefs(page):
    return [html.unescape(value) for value in re.findall(r'href="([^"]+)"', page)]


page, _ = get('/miami-fl/locksmith')
cards = re.findall(r'<article\b[^>]*>.*?</article>', page, re.S)
assert cards
dh_link = None
for card in cards:
    links = [link for link in hrefs(card) if link.startswith('/business/')]
    assert len(links) == 1
    query = urllib.parse.parse_qs(urllib.parse.urlparse(links[0]).query)
    assert query == {'region': ['miami-fl'], 'trade': ['locksmith']}, links
    profile, _ = get(links[0])
    assert 'Locksmith serving Miami, FL' in text(profile)
    assert 'Locksmith in Panama City, FL' not in title(profile)
    assert '/miami-fl/locksmith' in hrefs(profile)
    if 'DH Pace' in card:
        dh_link = links[0]
        assert 'Nationwide commercial door, lock and key services' in text(card)
        assert 'Nationwide commercial door, lock and key services' in text(profile)
        assert '/claim?business=dh-pace-miami-fl-locksmith' in hrefs(profile)
        assert not any('region=tampa-fl' in href for href in hrefs(profile))
assert dh_link

# The same canonical business must render each requested, supported pair.
for region, trade, expected in [
    ('panama-city-fl', 'locksmith', 'Locksmith serving Panama City, FL'),
    ('destin-fl', 'garage-door-repair', 'Garage door repair serving Destin, FL'),
    ('miami-fl', 'garage-door-repair', 'Garage door repair serving Miami, FL'),
]:
    page, _ = get(f'/business/dh-pace?region={region}&trade={trade}')
    assert expected in text(page), (expected, title(page))
    assert f'/{region}/{trade}' in hrefs(page)
    assert '<link rel="canonical" href="https://whoknowsapro.com/business/dh-pace"' in page

# A bare canonical profile must not invent a home city from insertion order.
page, _ = get('/business/dh-pace')
assert title(page) == 'DH Pace – Business profile | Who Knows a Pro?'
assert 'Locksmith in Panama City, FL' not in text(page)

# Existing placement URLs still redirect, retaining their original context.
page, url = get('/business/dh-pace-miami-fl-locksmith')
assert urllib.parse.urlparse(url).path == '/business/dh-pace'
assert urllib.parse.parse_qs(urllib.parse.urlparse(url).query) == {'region': ['miami-fl'], 'trade': ['locksmith']}
assert 'Locksmith serving Miami, FL' in text(page)

for query in ['region=miami-fl&trade=plumbing', 'region=unknown&trade=locksmith', 'region=miami-fl&region=destin-fl&trade=locksmith']:
    page, _ = get('/business/dh-pace?' + query)
    assert title(page) == 'DH Pace – Business profile | Who Knows a Pro?'

# Two valid cities and two valid categories do not imply four valid pairs.
# Keep claimed owner content/tier intact while selecting a different placement.
db = sqlite3.connect(sys.argv[1])
now = int(time.time() * 1000)
for region, trade in [('miami-fl', 'locksmith'), ('destin-fl', 'plumbing')]:
    slug = f'context-fixture-{region}-{trade}'
    db.execute('INSERT INTO businesses (id,name,slug,main_slug,region,trade,location,summary,website,owner_email,tier,approved,is_test,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)', (
        slug, 'Context fixture', slug, 'context-fixture', region, trade, region,
        'Owner supplied summary', 'https://example.test/', 'owner@example.test', 'enhanced', 1, 0, now,
    ))
db.commit()
page, _ = get('/business/context-fixture?region=miami-fl&trade=locksmith')
assert 'Locksmith serving Miami, FL' in text(page)
assert 'Owner supplied summary' in text(page) and 'Claimed business' in text(page)
page, _ = get('/business/context-fixture?region=miami-fl&trade=plumbing')
assert title(page) == 'Context fixture – Business profile | Who Knows a Pro?'
assert db.execute("SELECT DISTINCT tier,owner_email FROM businesses WHERE main_slug='context-fixture'").fetchall() == [('enhanced', 'owner@example.test')]
print(json.dumps({'passed': True, 'miamiProfileLinksChecked': len(cards), 'checks': ['city and category context', 'canonical SEO URL', 'legacy redirect', 'neutral overview', 'invalid and duplicate parameters', 'no invented city/category pairs', 'claimed content preserved', 'commercial scope visible']}))
