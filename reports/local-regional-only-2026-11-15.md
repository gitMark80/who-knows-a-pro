# Restore the local/regional-only directory policy

## Scope

The November 5 policy permits local and regional brands, not national brands or national franchises. A verified local office, local franchise owner, or exact service-area page is not an exception. Pages may remain below 20 listings when no additional eligible locals can be verified.

This repair removes the placement-exception bypass from seed generation and public runtime eligibility. It also adds six confirmed national/franchise domains or local aliases to the existing exclusion list. No underlying listing JSON, production database records, approval state, ownership claims, subscriptions, billing references, or payments are changed. Exclusions affect public visibility; existing database records remain available to authenticated owner/internal workflows.

## Impact against baseline `36e5da6`

- Generated public placements: **14,719 → 14,662**.
- Hidden placements: **57**, representing **17 canonical profiles** across **17 domains**.
- 42 placements were explicit national-domain exceptions; 15 were missed national/franchise aliases.
- The full before/after removal manifest is `local-regional-only-2026-11-15.json` beside this report. Records remain in their original source datasets.
- The audit establishes zero matches against the 309 configured excluded domains. It is not an exhaustive ownership audit of every remaining business.

| Excluded domain | Placements hidden |
| --- | ---: |
| terminix.com | 4 |
| searshomeservices.com | 4 |
| orkin.com | 3 |
| caliber.com | 3 |
| gerbercollision.com | 5 |
| classiccollision.com | 4 |
| maaco.com | 2 |
| mrappliance.com | 3 |
| destinoverheaddoor.com | 5 |
| precisiondoorpensacola.com | 5 |
| asppoolco.com | 4 |
| servicemasteralabama.com | 1 |
| precisiondoormobile.com | 6 |
| oxifresh.com | 2 |
| pestdefense.com | 4 |
| merrymaids.com | 1 |
| precisiontune.com | 1 |

## Official evidence for newly covered domains

Reviewed November 15, 2026:

- HomeTeam Pest Defense (`pestdefense.com`): [HomeTeam's Rollins announcement](https://pestdefense.com/blog/hometeam-sale-to-rollins-inc/) identifies the national company and acquisition; its [2026 partner announcement](https://pestdefense.com/blog/hometeam-pest-defense-receives-2026-national-preferred-partner-recognition/) confirms the current Rollins relationship.
- ServiceMaster by Reed (`servicemasteralabama.com`): its [Enterprise page](https://servicemasteralabama.com/enterprise/) identifies its membership in ServiceMaster Restore's national franchise network.
- Precision Garage Door Mobile (`precisiondoormobile.com`): its [About page](https://precisiondoormobile.com/about) explicitly describes the national franchise and Neighborly affiliation. Local ownership does not satisfy the local-brand-only rule.
- Oxi Fresh (`oxifresh.com`): its [locations page](https://www.oxifresh.com/locations/) describes franchise locations throughout the country.
- Merry Maids (`merrymaids.com`): its [official franchise site](https://franchise.merrymaids.com/) describes the nationally recognized franchise brand.
- Precision Tune Auto Care (`precisiontune.com`): its [About page](https://precisiontune.com/about-us/) describes the nationwide franchise network and international operation.

## Regression protection

- The public predicate still requires `approved === 1` and a non-test record before applying national exclusions.
- Approval tests now cover every excluded root domain, www host, and subdomain; old exact-branch exceptions; approved local overrides; and non-approved/test rejection.
- Isolated SQLite tests prove approved/claimed/featured national rows are absent from public listings, profiles, search, counts, and sitemap inventories while ownership and billing fields remain intact and internal profile lookup still works.
- CI now runs the national-brand cleanup validator and requires zero excluded seed placements. Historical audit-script imports retain a false-only compatibility function; the old exception list is gone.
- Recurring fill instructions must also retain the local/regional-only rule. This code change does not edit any scheduler.

## Validation

Local validation passed on November 15, 2026:

- `pnpm exec tsc --noEmit`
- `pnpm lint`
- `pnpm build`
- `node --loader ./scripts/ts-data-loader.mjs tests/public-approval.mjs`
- National-brand cleanup validator: 309 rules, zero excluded seed placements.
- All three integration suites against separate disposable SQLite databases with fake Stripe keys and local email outboxes: business-results, business-profile-context, and claim-billing-security.
- Independent read-only diff review and `git diff --check`.

Production verification follows deployment. No production database or payment operation is part of this repair.
