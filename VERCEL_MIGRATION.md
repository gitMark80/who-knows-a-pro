# Vercel migration

This branch is a safe Vercel preview of the public Who Knows a Pro directory.
It uses the verified directory seed directly, so all region, category, business,
and official website pages work without the Cloudflare D1 runtime.

Until the owner workflow is migrated, claim, dashboard, and admin routes redirect
to the existing production site at https://whoknowsapro.com. Stripe remains
disabled for this migration stage.

Before moving the production domain:

1. Provision a SQLite-compatible Turso database through Vercel Marketplace.
2. Import live D1 business, claim, session, subscription, and webhook records.
3. Replace R2 uploads with Vercel Blob and migrate existing media.
4. Configure Resend and a secure Vercel-compatible admin login.
5. Add Stripe secrets and the production webhook only after preview testing.
6. Verify every public and owner flow, then attach the domain without changing
   its DNS until Vercel supplies the exact required records.
