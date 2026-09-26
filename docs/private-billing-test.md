# Private Production billing test

Authorized fixture: `wkap-live-billing-test`, main slug `wkap-test-business`.
Name: WKAP Test Business. Test context: Pensacola, FL / Lawn care.
Claim: `/claim?business=wkap-live-billing-test&plan=enhanced` with `hello@whoknowsapro.com`.
This is a synthetic site-owner billing fixture, not a business recommendation.

`is_test=1` excludes the fixture from public lists, sitemap slugs, counts, public
profile pages, photo responses, profile-view tracking, Featured cards, and lead
routing. Claims reject other email addresses. Public Featured checkout is disabled
for this fixture. Enhanced uses the normal live price, Checkout and webhook flow.
No special price, discount, or bypass of email verification is used.

Verify with `node scripts/verify-private-billing-fixture.cjs` and `pnpm build`.

## After the user completes the real purchase

1. Check the live $29 payment, completed Checkout, successful webhook delivery,
   Enhanced tier and live Customer Portal.
2. User cancels the subscription immediately in the Stripe Dashboard and refunds
   the last payment in full. Portal cancellation is at period end; that alone is
   not immediate deactivation or a refund. Do not charge/refund on the user's behalf.
3. Before removal, inspect Stripe to confirm all subscriptions tied to this fixture
   are canceled and no unexpired Checkout can later complete. Expire any remaining
   open fixture Checkouts through Stripe. Keep Stripe accounting records.
4. Delete only this fixture's rows from `sessions`, `claims`, `profile_views`,
   `featured_slots`, `subscriptions`, and finally `businesses` in one Turso
   transaction, matching exact business ID or main slug as appropriate. Remove
   only Blob objects under `businesses/wkap-live-billing-test/` if any were uploaded.
5. Keep the `directory_seed_versions` marker `private-billing-fixture-v1` so the
   fixture cannot reappear on a later build or cold start. Remove the one-time
   fixture creation block from db/runtime.ts once the exercise is finished.
6. Check the claim URL no longer prefills a business, public profile is 404, and
   the fixture is absent from the sitemap and Pensacola/Lawn care.

This fixture verifies Enhanced billing privately. It does not verify a live public
Featured placement. That separate check must not be reported complete from this test.
