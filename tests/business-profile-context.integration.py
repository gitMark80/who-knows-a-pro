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


# Initialize only the isolated test database, then use a deterministic local fixture.
# National brands such as DH Pace must remain excluded from public listings.
page, _ = get('/miami-fl/electrical')
assert 'DH Pace' not in text(page)
db = sqlite3.connect(sys.argv[1])
now = int(time.time() * 1000)
for region, trade in [('miami-fl', 'electrical'), ('panama-city-fl', 'electrical'), ('destin-fl', 'garage-door-repair'), ('miami-fl', 'garage-door-repair')]:
    fixture_slug = f'profile-context-provider-{region}-{trade}'
    db.execute('INSERT INTO businesses (id,name,slug,main_slug,region,trade,location,summary,website,approved,is_test,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)', (
        fixture_slug, 'Profile Context Provider', fixture_slug, 'profile-context-provider', region, trade, region,
        'Residential door and electrical services', 'https://profile-context.example.test/', 1, 0, now,
    ))
db.commit()
page, _ = get('/miami-fl/electrical')
cards = re.findall(r'<article\b[^>]*>.*?</article>', page, re.S)
assert cards
fixture_link = None
for card in cards:
    links = [link for link in hrefs(card) if link.startswith('/business/')]
    assert len(links) == 1
    query = urllib.parse.parse_qs(urllib.parse.urlparse(links[0]).query)
    assert query == {'region': ['miami-fl'], 'trade': ['electrical']}, links
    profile, _ = get(links[0])
    assert 'Electrical serving Miami, FL' in text(profile)
    assert 'Electrical in Panama City, FL' not in title(profile)
    assert '/miami-fl/electrical' in hrefs(profile)
    if 'Profile Context Provider' in card:
        fixture_link = links[0]
        assert 'Residential door and electrical services' in text(card)
        assert 'Residential door and electrical services' in text(profile)
        assert '/claim?business=profile-context-provider-miami-fl-electrical' in hrefs(profile)
        assert not any('region=tampa-fl' in href for href in hrefs(profile))
assert fixture_link

# The same canonical business must render each requested, supported pair.
for region, trade, expected in [
    ('panama-city-fl', 'electrical', 'Electrical serving Panama City, FL'),
    ('destin-fl', 'garage-door-repair', 'Garage door repair serving Destin, FL'),
    ('miami-fl', 'garage-door-repair', 'Garage door repair serving Miami, FL'),
]:
    page, _ = get(f'/business/profile-context-provider?region={region}&trade={trade}')
    assert expected in text(page), (expected, title(page))
    assert f'/{region}/{trade}' in hrefs(page)
    assert '<link rel="canonical" href="https://whoknowsapro.com/business/profile-context-provider"' in page

# A bare canonical profile must not invent a home city from insertion order.
page, _ = get('/business/profile-context-provider')
assert title(page) == 'Profile Context Provider – Business profile | Who Knows a Pro?'
assert 'Electrical in Panama City, FL' not in text(page)

# Existing placement URLs still redirect, retaining their original context.
page, url = get('/business/profile-context-provider-miami-fl-electrical')
assert urllib.parse.urlparse(url).path == '/business/profile-context-provider'
assert urllib.parse.parse_qs(urllib.parse.urlparse(url).query) == {'region': ['miami-fl'], 'trade': ['electrical']}
assert 'Electrical serving Miami, FL' in text(page)

for query in ['region=miami-fl&trade=plumbing', 'region=unknown&trade=electrical', 'region=miami-fl&region=destin-fl&trade=electrical']:
    page, _ = get('/business/profile-context-provider?' + query)
    assert title(page) == 'Profile Context Provider – Business profile | Who Knows a Pro?'

# Two valid cities and two valid categories do not imply four valid pairs.
# Keep claimed owner content/tier intact while selecting a different placement.
db = sqlite3.connect(sys.argv[1])
now = int(time.time() * 1000)
for region, trade in [('miami-fl', 'electrical'), ('destin-fl', 'plumbing')]:
    slug = f'context-fixture-{region}-{trade}'
    db.execute('INSERT INTO businesses (id,name,slug,main_slug,region,trade,location,summary,website,owner_email,tier,approved,is_test,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)', (
        slug, 'Context fixture', slug, 'context-fixture', region, trade, region,
        'Owner supplied summary', 'https://example.test/', 'owner@example.test', 'enhanced', 1, 0, now,
    ))
db.commit()
page, _ = get('/business/context-fixture?region=miami-fl&trade=electrical')
assert 'Electrical serving Miami, FL' in text(page)
assert 'Owner supplied summary' in text(page) and 'Claimed business' in text(page)
page, _ = get('/business/context-fixture?region=miami-fl&trade=plumbing')
assert title(page) == 'Context fixture – Business profile | Who Knows a Pro?'
assert db.execute("SELECT DISTINCT tier,owner_email FROM businesses WHERE main_slug='context-fixture'").fetchall() == [('enhanced', 'owner@example.test')]
print(json.dumps({'passed': True, 'miamiProfileLinksChecked': len(cards), 'checks': ['city and category context', 'canonical SEO URL', 'legacy redirect', 'neutral overview', 'invalid and duplicate parameters', 'no invented city/category pairs', 'claimed content preserved', 'residential scope visible', 'national brand excluded']}))
