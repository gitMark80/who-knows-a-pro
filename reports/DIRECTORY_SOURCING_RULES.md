# Directory sourcing rules

Apply these rules to new fill candidates. Preserve existing records, claims and paid placements; do not delete historical data without the user's authorization.

- Home-service categories require explicit residential or homeowner service evidence from an official business page. Nationwide commercial facilities, hotel-only renovation, industrial-only insulation and restaurant-only appliance service do not satisfy this requirement.
- Vehicle and marine categories require direct service for individual vehicle or recreational-boat owners. Fleet-management-only and government/commercial-vessel-only service does not qualify.
- Record `customerScope` (`residential` or `consumer`), `customerEvidence` and `customerSourceUrl` in candidate reports, in addition to the existing official website, service/geography evidence, source URL and verification timestamp. The fill selector enforces these fields prospectively.
- A state contractor license is not evidence of statewide service. Use a local business location or explicit offered coverage, and preserve any project-size, property-type or service restrictions.
- Deduplicate normalized domains, renamed businesses, alternate websites and acquired identities before counting placements. Respect `data/excluded-businesses.ts`.
- No directory or social profile can substitute for a working official business website. Do not use Google Maps/Places, Yelp or Angi as listing sources. No paid APIs, Foursquare credits, outreach or purchases are authorized.
- Published listing counts are not a certification that every historical entry meets these relevance rules. Report count-based deficits separately from any fully audited qualifying counts. A future historical review must retain source evidence and must not silently delete existing data.

These prospective checks carry forward the user's November 2, 2026 correction that a commercial-only flooring provider was unsuitable for residential flooring. Any earlier progress report accepting commercial-only national coverage is superseded for future additions.
