# Payload CMS integration

Implements ADR-0002. The adapter lives entirely in `src/integrations/payload`;
the port it implements (`CorporateContentGateway`) lives in
`src/lib/content/gateway.ts`. No page or component imports
`src/integrations/payload` directly — only `src/lib/content` and the
`src/features/*` query modules do.

```text
React Server Component
        |
        v
CorporateContentGateway   (src/lib/content/gateway.ts — the port)
        |
        v
PayloadCorporateContentGateway  (src/integrations/payload/client.ts — the adapter)
        |
        v
queries/*  →  transport.ts (fetch, timeout, auth)  →  Payload REST API
        |
        v
dto/* (Zod validation)  →  mappers/*  →  src/lib/content/types.ts models
```

## Current state of `nabhold/baobab-cms`

At the time of this integration, `baobab-cms` is a generic, multi-tenant
Baobab content engine, not yet a Nabhold-specific corporate CMS:

- Its only editorial collections are `pages` (generic, keyed by a free-text
  `contentKey`, richText body, tenant/organisation/digitalEstate/market/locale
  scope) and `product-content` (Medusa editorial companion). There are **no**
  `portfolio-companies`, `sectors`, `insights`, `news`, `publications`,
  `case-studies`, `topics`, `people` or `locations` collections.
- There are **no Payload Globals** configured. The generic `pages` collection
  stands in for what would otherwise be `homePage`, `header`, `footer`,
  `siteSettings` globals, distinguished only by `contentKey`.
- A content-resolution engine (`src/baobab/content-resolution`) implementing
  scope inheritance and locale fallback exists and is fully tested, but is
  **not wired to any HTTP endpoint** — this estate is its first prospective
  digital-estate consumer.
- No configurable outbound webhook destination exists yet for canonical
  content lifecycle events; only an internal transactional outbox and a
  manually-scheduled dispatcher (`npm run outbox:dispatch`) exist.

Given this, the adapter is written to a **target contract** — the full
corporate content model this repository needs — while degrading gracefully
wherever the upstream schema is incomplete. Nothing in this repository
assumes a collection or field exists; every DTO schema treats forward-looking
fields as optional, and every gateway method returns an empty/graceful
result rather than throwing when Payload cannot answer.

## Collections and globals this estate expects

| Content | Today | Target |
|---|---|---|
| Home page, navigation, footer, site settings, group profile | `pages` doc by `contentKey` (`home`, `navigation`, `footer`, `site-settings`, `group-profile`); only `title`/`content` populated | Dedicated globals with the structured fields the task model calls for (CTAs, featured companies, SEO group, nav items) |
| Portfolio companies | Not present | `portfolio-companies` collection (see `docs/content-model.md`) |
| Sectors | Not present | `sectors` collection |
| Insights | Not present | `insights` collection |

## Read path

1. A Server Component calls `getContentGateway()` (`src/lib/content`), never
   `fetch` directly.
2. The gateway composes one or more `queries/*` functions, each scoped to one
   Payload collection.
3. `transport.ts` performs the actual `fetch`, with a bounded timeout
   (`PAYLOAD_TIMEOUT_MS`), a bearer token (`PAYLOAD_API_TOKEN`) when
   configured, and a `next.tags` cache tag list.
4. The raw JSON is validated against a Zod DTO schema (`dto/*`). A validation
   failure is treated exactly like a transport failure — logged, never
   thrown into the page.
5. A pure mapper (`mappers/*`) converts the DTO into the estate-owned model
   (`src/lib/content/types.ts`). Payload's shape (relationship objects,
   Lexical rich text, `docs`/`totalDocs` envelopes) never reaches page code.

## Cache strategy

Every Payload `fetch` call is tagged (see `src/lib/content/cache.ts`):

```text
content:site
content:navigation
content:footer
content:homepage
content:group-profile
content:portfolio
content:portfolio:{slug}
content:sectors
content:sector:{slug}
content:insights
content:insight:{slug}
```

Reads use `next: { tags, revalidate: false }` — cached until explicitly
revalidated, never on a timer. `POST /api/revalidate` (bearer-token protected
by `PAYLOAD_REVALIDATE_SECRET`) accepts a narrow, closed request shape and
revalidates only the tags it implies — see `tagsForRevalidateRequest`.
Publishing a portfolio company also invalidates the homepage, since it may be
featured there.

## Event flow (intended)

```text
Payload (baobab-cms)
  |
  |  canonical content lifecycle event
  |  com.nabhold.content.{created,updated,published,unpublished,archived}.v1
  |  (nabhold/shared event envelope — see contracts/events/v1)
  v
Outbox dispatcher (baobab-cms, not yet wired to an outbound webhook)
  |
  v
POST https://<this estate>/api/revalidate
  |
  v
Next.js cache invalidation (this repository)
  |
  +--> Baobab event fabric (future) --> Pulse ingestion
```

This repository implements the receiving half only (`/api/revalidate`) and
does not introduce message-queue infrastructure. Wiring `baobab-cms`'s
outbox dispatcher to call it is follow-up work in that repository.

## Preview

Not implemented. `baobab-cms` has no draft-preview contract (no signed
preview token format, no `?preview=` handshake) defined yet. The intended
flow, once one exists:

```text
Payload editor "Preview" button
    |
    v
Signed preview URL → this estate's /api/preview (to be added)
    |
    v
Next.js Draft Mode enabled, cookie set
    |
    v
Gateway methods request Payload's draft/unpublished representation
```

Implementing `/api/preview` now would mean inventing an unstable protocol
against a contract that does not exist. This is deferred and documented here
rather than guessed at (see the ADR's non-goals).

## Payload/Pulse boundary

The Payload adapter (`src/integrations/payload`) and the Pulse adapter
(`src/lib/pulse`) share no code and no types. A future Insight page may
compose both (editorial body from Payload, live market signals from Pulse),
but that composition happens in a Server Component or feature module, never
inside either adapter.

## Resilience

- Every gateway method catches transport/validation failures and returns an
  empty/`null`/estate-default result — no page throws because Payload is
  down.
- No upstream error body, stack trace, or credential is ever returned to a
  visitor; `src/integrations/payload/logger.ts` writes structured,
  server-only log lines instead.
- The one visibly-labelled exception is the portfolio development fallback
  (`src/integrations/payload/dev-fallback/portfolio.ts`), gated by
  `NABHOLD_CONTENT_DEV_FALLBACK` and fail-closed in production exactly like
  `NABHOLD_DASHBOARD_PREVIEW` (`src/lib/auth/session.ts`).

## Security

- `PAYLOAD_API_TOKEN` and `PAYLOAD_REVALIDATE_SECRET` are server-only; there
  is no `NEXT_PUBLIC_*` mirror of either.
- `POST /api/revalidate` requires a bearer token compared with
  `crypto.timingSafeEqual` and accepts only a closed, discriminated request
  shape (`src/lib/content/schemas.ts#revalidateRequestSchema`) — it can never
  be used to invalidate the whole cache or an arbitrary tag string.
- `SeoMetadata.canonicalOverride` is validated against this estate's own
  origin (`resolveCanonicalOverride`) before use; an off-estate value from a
  compromised or misconfigured CMS editor is silently ignored, not trusted.

## Required follow-up in `nabhold/baobab-cms`

Not implemented here — this repository does not modify other repositories:

1. Add `portfolio-companies`, `sectors` and `insights` collections matching
   `docs/content-model.md`.
2. Add structured fields to the `pages` collection (or dedicated globals) for
   the `home`, `navigation`, `footer`, `site-settings` and `group-profile`
   content keys this estate reads (CTA groups, featured-company relationship,
   nav/footer link arrays, SEO group).
3. Expose `src/baobab/content-resolution` through an HTTP endpoint once more
   than one digital estate needs inheritance/locale-fallback resolution.
4. Wire the outbox dispatcher to call this estate's `POST /api/revalidate`
   on `content.published`/`content.unpublished`/`content.archived`.
5. Define and publish a draft-preview contract.
