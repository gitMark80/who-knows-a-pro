# Who Knows a Pro

Who Knows a Pro is a local business directory organized by city and service category.
This repository contains the GitHub/Vercel-ready public directory while the live
owner, claim, dashboard, media, and billing workflows remain on
[whoknowsapro.com](https://whoknowsapro.com).

## Local development

Requirements: Node.js 22.13 or newer and pnpm 11.

```bash
pnpm install
pnpm dev
```

Run the production checks with:

```bash
pnpm exec tsc --noEmit
pnpm build
```

## Directory configuration

Cities, launch batches, category order, and legacy slugs are defined in
`data/catalog.ts`.

- The original eight cities and Batch 1 are active.
- Batch 2 is configured but inactive.
- To launch Batch 2, change `regionBatchActive.batch2` from `false` to `true`.
- Existing category slugs must not be renamed because they are part of published URLs.

## Protection, tracking, and tests

See `docs/traffic-protection-and-analytics.md` for rate limits, Turnstile, honeypots,
the conversion dashboard (`/admin/funnel`), indexing rules, and the Vercel checklist.

CI (`.github/workflows/ci.yml`) runs type checking, lint, a production build, and the
integration tests in `tests/` against an isolated SQLite file with fake keys.
