#!/usr/bin/env python3
"""Collect Foursquare website candidates for every deficient city/category pair.

Dry-run by default. Never writes to live directory data or publishes listings.
"""
import argparse
import csv
import datetime
import hashlib
import ipaddress
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ENDPOINT = 'https://places-api.foursquare.com/places/search'
VERSION = '2025-06-17'
FIELDS = 'fsq_place_id,name,website,categories,location,date_closed,unresolved_flags,placemaker_url'
QUERIES = {
    'hvac': 'heating air conditioning contractor',
    'plumbing': 'plumber',
    'auto-mechanics': 'auto repair',
    'roofing': 'roofing contractor',
    'electrical': 'electrician',
    'lawn-care': 'lawn care',
    'pest-control': 'pest control',
    'house-cleaning': 'house cleaning',
    'landscaping': 'landscaping',
    'tree-service': 'tree service',
    'garage-door-repair': 'garage door repair',
    'locksmith': 'locksmith',
    'appliance-repair': 'appliance repair',
    'movers': 'moving company',
    'handyman': 'handyman',
    'painting': 'painting contractor',
    'pool-service': 'pool cleaning service',
    'kitchen-bath-remodeling': 'kitchen bathroom remodeling',
    'flooring': 'flooring installation',
    'towing': 'towing',
    'auto-body-collision': 'auto body collision repair',
    'fence-builders': 'fence contractor',
    'junk-removal': 'junk removal',
    'water-damage-mold-remediation': 'water damage restoration mold remediation',
    'concrete': 'concrete contractor',
    'gutters': 'gutter installation repair',
    'carpet-cleaning': 'carpet cleaning',
    'pressure-washing': 'pressure washing',
    'septic-services': 'septic service',
    'pool-installation': 'swimming pool contractor',
    'window-tinting': 'window tinting',
    'generator-installation': 'generator installation',
    'insulation': 'insulation contractor',
    'marine-services': 'boat repair marine service',
    'screen-enclosures-pool-cages': 'screen enclosure contractor',
    'hurricane-shutters-impact-windows': 'hurricane shutters impact windows',
    'trading-card-stores': 'trading cards',
    'home-inspections': 'inspection',
    'irrigation-sprinkler-repair': 'irrigation',
    'mobile-auto-detailing': 'detailing',
}
# IDs observed in Places API responses; category matching is only a review gate.
CATEGORY_IDS = {
    'home-inspections': '63be6904847c3692a84b9b57',
    'mobile-auto-detailing': '4f04ae1f2fb6e1c99f3db0ba',
    'auto-mechanics': '52f2ab2ebcbc57f1066b8b44',
    'electrical': '63be6904847c3692a84b9b52',
    'locksmith': '52f2ab2ebcbc57f1066b8b1e',
    'roofing': '63be6904847c3692a84b9b61',
    'landscaping': '63be6904847c3692a84b9b5b',
}
TRADE_PATTERNS = {
    'hvac': r'hvac|heating|air condition', 'plumbing': r'plumb',
    'auto-mechanics': r'auto.*repair|mechanic', 'roofing': r'roof',
    'electrical': r'electric', 'lawn-care': r'lawn|landscap|garden',
    'pest-control': r'pest|exterminat', 'house-cleaning': r'cleaning|maid',
    'landscaping': r'landscap|garden', 'tree-service': r'tree|arborist',
    'garage-door-repair': r'garage door', 'locksmith': r'locksmith',
    'appliance-repair': r'appliance', 'movers': r'moving|mover',
    'handyman': r'handyman', 'painting': r'paint',
    'pool-service': r'pool', 'kitchen-bath-remodeling': r'remodel|kitchen|bath',
    'flooring': r'floor|tile|carpet', 'towing': r'towing|wrecker',
    'auto-body-collision': r'auto body|collision', 'fence-builders': r'fenc',
    'junk-removal': r'junk|hauling|waste|rubbish',
    'water-damage-mold-remediation': r'water damage|restoration|mold|remediation',
    'concrete': r'concrete|masonry', 'gutters': r'gutter',
    'carpet-cleaning': r'carpet.*clean|clean.*carpet',
    'pressure-washing': r'pressure wash|power wash|soft wash',
    'septic-services': r'septic', 'pool-installation': r'pool',
    'window-tinting': r'tint', 'generator-installation': r'generator',
    'insulation': r'insulation', 'marine-services': r'boat|marine|yacht',
    'screen-enclosures-pool-cages': r'screen|enclosure|pool cage',
    'hurricane-shutters-impact-windows': r'hurricane|shutter|impact window',
    'trading-card-stores': r'trading card|sports card|collectible|hobby|game store',
    'home-inspections': r'home inspect|property inspect|building inspect',
    'irrigation-sprinkler-repair': r'irrigation|sprinkler',
    'mobile-auto-detailing': r'detail|car wash',
}


def relevant_trade(place, trade):
    # No keyword in an address or URL can qualify an unrelated business.
    category_text = ' '.join(str(c.get('name') or '') for c in place.get('categories') or [])
    if re.search(r'restaurant|bar and grill|military|recruiting|medical|physician|hospital|church|museum|apartment|swimming pool|government', category_text, re.I):
        return False
    text = ' '.join([str(place.get('name') or '')] +
                    [str(c.get('name') or '') for c in place.get('categories') or []])
    if re.search(r'board of|licensing|training school', text, re.I):
        return False
    return bool(re.search(TRADE_PATTERNS[trade], text, re.I))


EXCLUDED_DOMAINS = ('google.com', 'yelp.com', 'angi.com', 'homeadvisor.com',
                    'yellowpages.com', 'facebook.com', 'instagram.com', 'foursquare.com',
                    'hub.biz', 'showmelocal.com', 'eventful.com', 'zillow.com',
                    'goo.gl', 'maps.app.goo.gl', 'superpages.com',
                    'hvacnearyou.com', 'moverrankings.com', 'bellsouth.com')


def website_domain(value):
    try:
        parsed = urllib.parse.urlsplit(value)
        host = (parsed.hostname or '').lower().removeprefix('www.')
        if parsed.scheme not in ('http', 'https') or parsed.username or parsed.password:
            return None
        if '.' not in host or host.endswith(('.local', '.localhost', '.internal')):
            return None
        try:
            if not ipaddress.ip_address(host).is_global:
                return None
        except ValueError:
            pass
        if any(host == domain or host.endswith('.' + domain) for domain in EXCLUDED_DOMAINS):
            return None
        return host
    except (TypeError, ValueError):
        return None


def normalized(value):
    return re.sub('[^a-z0-9]', '', str(value).lower())


def candidates(pair, response, source_url, fetched_at):
    """Search relevance alone is never treated as verified category/area coverage."""
    seen_domains, seen_names = set(), set()
    output = []
    requested_city, requested_state = pair['city'].rsplit(', ', 1)
    for place in response['results']:
        domain = website_domain(place.get('website'))
        name = str(place.get('name') or '').strip()
        if not domain or not name or not place.get('fsq_place_id'):
            continue
        if place.get('date_closed') or place.get('unresolved_flags'):
            continue
        if not relevant_trade(place, pair['category_slug']):
            continue
        name_key = normalized(name)
        if domain in seen_domains or name_key in seen_names:
            continue
        seen_domains.add(domain)
        seen_names.add(name_key)
        location = place.get('location') or {}
        exact_city = (normalized(location.get('locality')) == normalized(requested_city)
                      and normalized(location.get('region')) == normalized(requested_state)
                      and location.get('country') == 'US')
        output.append({
            'name': name, 'website': place['website'], 'websiteDomain': domain,
            'requestedRegion': pair['city_slug'], 'requestedTrade': pair['category_slug'],
            'fsqPlaceId': place['fsq_place_id'], 'reportedLocation': location,
            'reportedCategories': place.get('categories') or [],
            'exactCityMatch': exact_city, 'source': 'foursquare',
            'sourceUrl': source_url, 'retrievedAt': fetched_at,
            'reviewStatus': 'needs_official_website_and_service_area_verification',
        })
    return output


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--coverage', type=Path, default=ROOT / 'reports/live-directory-coverage.csv')
    parser.add_argument('--output', type=Path, default=ROOT / 'research/foursquare-candidates')
    parser.add_argument('--max-requests', type=int, default=0,
                        help='Maximum new API requests; 0 prints the plan without network access')
    parser.add_argument('--region', help='Optional single city slug')
    args = parser.parse_args()
    if args.max_requests < 0:
        parser.error('--max-requests must be non-negative')
    with args.coverage.open() as file:
        all_pairs = list(csv.DictReader(file))
    keys = [(p['city_slug'], p['category_slug']) for p in all_pairs]
    if len(keys) != len(set(keys)):
        parser.error('Coverage report contains duplicate city/category pairs')
    unknown = {p['category_slug'] for p in all_pairs} - QUERIES.keys()
    if unknown:
        parser.error('Unmapped categories: ' + ', '.join(sorted(unknown)))
    if args.region and args.region not in {p['city_slug'] for p in all_pairs}:
        parser.error('Unknown city slug')
    pairs = [p for p in all_pairs if int(p['listing_count']) < 5
             and (not args.region or p['city_slug'] == args.region)]
    # Empty pages first, then the largest remaining gaps, with stable ordering.
    pairs.sort(key=lambda p: (int(p['listing_count']), p['city_slug'], p['category_slug']))
    print(json.dumps({'mode': 'collect' if args.max_requests else 'dry_run',
                      'cities': len({p['city_slug'] for p in all_pairs}),
                      'categories': len({p['category_slug'] for p in all_pairs}),
                      'pairsToResearch': len(pairs),
                      'missingPlacements': sum(5-int(p['listing_count']) for p in pairs),
                      'maxNewRequests': args.max_requests}, indent=2))
    if not args.max_requests:
        return 0
    key = os.environ.get('FOURSQUARE_API_KEY')
    if not key:
        print('FOURSQUARE_API_KEY is required for collection. No API requests made.', file=sys.stderr)
        return 2
    args.output.mkdir(parents=True, exist_ok=True)
    calls = 0
    output = []
    completed = 0
    for pair in pairs:
        params = {'near': pair['city'] + ', USA', 'query': QUERIES[pair['category_slug']],
                  'limit': 50, 'fields': FIELDS}
        if pair['category_slug'] in CATEGORY_IDS:
            params['fsq_category_ids'] = CATEGORY_IDS[pair['category_slug']]
        url = ENDPOINT + '?' + urllib.parse.urlencode(params)
        cache_id = hashlib.sha256((url + VERSION).encode()).hexdigest()[:20]
        path = args.output / (cache_id + '.json')
        if path.exists():
            envelope = json.loads(path.read_text())
            if envelope['sourceUrl'] != url or envelope['apiVersion'] != VERSION:
                raise RuntimeError('Cache metadata mismatch: ' + path.name)
        else:
            if calls >= args.max_requests:
                continue
            request = urllib.request.Request(url, headers={
                'Authorization': 'Bearer ' + key, 'X-Places-Api-Version': VERSION,
                'Accept': 'application/json'})
            calls += 1
            try:
                with urllib.request.urlopen(request, timeout=35) as result:
                    response = json.load(result)
            except urllib.error.HTTPError as error:
                # Do not retry rate limits or auth errors, or print request headers.
                print(f'Foursquare returned HTTP {error.code}; stopped after {calls} request(s).', file=sys.stderr)
                return 2
            if not isinstance(response.get('results'), list):
                raise RuntimeError('API response is missing results; not caching it')
            envelope = {'sourceUrl': url, 'apiVersion': VERSION,
                        'retrievedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(),
                        'response': response}
            temp = path.with_suffix('.tmp')
            temp.write_text(json.dumps(envelope, indent=2) + '\n')
            temp.replace(path)
        completed += 1
        output.extend(candidates(pair, envelope['response'], url, envelope['retrievedAt']))
    (args.output / 'review-queue.json').write_text(json.dumps(output, indent=2) + '\n')
    print(json.dumps({'newRequests': calls, 'pairsCollected': completed,
                      'pairsNotCollected': len(pairs)-completed, 'candidatesForReview': len(output),
                      'publishedListings': 0}, indent=2))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
