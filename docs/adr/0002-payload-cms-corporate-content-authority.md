# ADR-0002: Payload CMS as the authoritative corporate editorial content engine

Status: Accepted

## Context

ADR-0001 established `nabhold/nabhold` as one independently deployable
Next.js estate with two route groups: a cacheable public corporate surface
and a dynamic, non-indexable executive surface. At that time, corporate
editorial content (portfolio companies, sector narratives, insights, the
homepage) was hard-coded directly in route components (`src/features/portfolio/data.ts`
and inline JSX strings), with no external source of truth.

Nabhold Group Africa operates a centrally run, headless Payload CMS
(`nabhold/baobab-cms`) intended to serve corporate editorial content across
digital estates. `nabhold/nabhold` should stop hard-coding editorial content
and instead consume it from Payload — without becoming a Payload
application, without embedding Payload, and without letting Payload become
authoritative for anything outside editorial content.

An inspection of `nabhold/baobab-cms` at the time of this decision found:

- It is currently a **generic, multi-tenant Baobab content engine**, not a
  Nabhold-specific corporate CMS. Its collections are `pages` (generic,
  identified by a free-text `contentKey` such as `"home"` or `"footer"`,
  scoped by `tenant`/`organisation`/`digitalEstate`/`market`/`locale`, with a
  single `richText` body), `product-content` (Medusa editorial companion),
  `media`, and platform projections (`tenants`, `organisations`, `regions`,
  `digital-estates`, `markets`, `users`, `outbox`, `audit-logs`,
  `mapping-projections`).
- There are **no dedicated `portfolioCompanies`, `sectors`, `insights`,
  `news`, `publications`, `caseStudies`, `topics`, `people`, or `locations`
  collections**, and **no Payload Globals** are configured — the generic
  `pages` collection with `contentKey` stands in for what would otherwise be
  globals (home page, footer, navigation, etc.).
- A content-resolution engine implementing inheritance and locale fallback
  (`src/baobab/content-resolution`) exists and is fully tested, but is **not
  yet wired to any HTTP endpoint** — `nabhold/nabhold` would be its first
  digital-estate consumer, and resolving inheritance today would have to
  happen client-side against raw candidate documents, or wait for
  `baobab-cms` to expose a resolution endpoint.
- `nabhold/shared`'s canonical-mapping contract already anticipates this
  integration: `mappingType` includes `CONTENT`, `authority` includes
  `content`, and its `ExternalReference.system_namespace` examples already
  list `"payload"` alongside `"medusa"` and `"idempiere"`.

This ADR formalises the target architecture and the boundary rules that
apply regardless of how complete `baobab-cms`'s schema is on any given day.

## Decision

1. **Payload CMS is the authoritative corporate editorial content engine.**
   Corporate profile content, portfolio narratives, sector and capability
   descriptions, insights/news/publications, careers content, navigation,
   footer, SEO metadata and homepage editorial content are owned by Payload,
   not by this repository.
2. **`nabhold/nabhold` remains an independently deployable Next.js estate.**
   This decision changes what content this estate reads, not its deployment
   topology, its two-surface route structure, or its ownership of commerce,
   ERP, tenancy, identity, intelligence processing or infrastructure.
3. **Payload is consumed headlessly**, over its HTTP REST API, from the
   server only. No admin UI, editor, or Payload runtime is embedded here.
4. **Payload SHALL NOT be embedded in this repository.** There is no
   `payload.config.ts`, no Payload dependency, and no Payload database
   connection in `nabhold/nabhold`.
5. **Payload SHALL NOT own operational or canonical Baobab truth** — tenant,
   legal-entity, digital-estate, market, user identity, authentication,
   authorisation, financial, ERP, commerce or Pulse-analytical data. Where
   Payload content relates to those concepts it stores canonical references
   (`canonicalEntityId`, `organisationId`, `digitalEstateId`, `marketIds`),
   never a redefinition of the underlying entity.
6. **All Payload access passes through a typed server-side adapter** at
   `src/integrations/payload`. No page or component calls the Payload API
   directly.
7. **Payload DTOs SHALL NOT leak into page and domain components.** Raw
   Payload JSON is validated against a Zod DTO schema, mapped into an
   estate-owned content model (`src/lib/content/types.ts`), and only the
   mapped model crosses into `src/features` and `src/app`.
8. **Canonical Baobab references may be carried on content records** (e.g. a
   `PortfolioCompany` carries `canonicalEntityId`/`organisationId` alongside
   its editorial fields) but this repository never creates a
   cross-database relationship into another Baobab engine's store, and never
   queries a Baobab-owned database directly.
9. **Public content favours server-side rendering and caching.** Public
   pages read Payload through Server Components using Next.js `fetch` cache
   tags (`content:*`, see `docs/integrations/payload.md`); there is no
   client-side Payload fetching for ordinary corporate content.
10. **Publishing supports cache invalidation.** A secret-protected
    `POST /api/revalidate` endpoint accepts a narrow invalidation request
    (collection + slug) and revalidates only the affected cache tags.
11. **Content lifecycle events are supported where appropriate**, in the
    sense that this estate's cache-invalidation contract is designed to be
    triggered by Payload's own canonical content lifecycle events
    (`com.nabhold.content.{created,updated,published,unpublished,archived}.v1`,
    per `nabhold/shared`'s CloudEvents-shaped envelope) once `baobab-cms`
    wires its outbox dispatcher to call this estate's revalidation endpoint.
    This repository does not introduce message-queue infrastructure itself.
12. **Payload and Pulse remain separate capabilities.** Payload answers "what
    does Nabhold publish"; Pulse answers "what does Nabhold know." A future
    Insight page may compose both, but neither adapter depends on the other,
    and no component may treat Payload content as market intelligence or
    vice versa.
13. **The executive dashboard remains Baobab-driven, not CMS-driven.** The
    `(dashboard)` route group continues to be powered by Pulse, the Control
    Plane, ERP and future Baobab engines. Payload may only supply minor
    supporting copy (announcements, help text) through the same content
    gateway used by the public estate — never operational dashboard data.

## Consequences

- `src/features/portfolio/data.ts`'s hard-coded array is replaced by
  Payload-backed queries through `CorporateContentGateway`, with a visibly
  labelled, non-authoritative development fallback used only when Payload is
  unreachable and explicit opt-in is set (never in production).
- Because `baobab-cms` does not yet define `portfolioCompanies`, `sectors`
  or `insights` collections, the adapter is written defensively: DTO schemas
  treat forward-looking fields as optional, and the gateway degrades to an
  empty/graceful result (never fabricated content) when a collection or
  field does not yet exist upstream. See `docs/integrations/payload.md` for
  the current gap and the follow-up work this implies for `nabhold/baobab-cms`.
- Homepage, navigation, footer, group profile and SEO defaults are resolved
  today through Payload's existing generic `pages` collection, keyed by
  `contentKey`, until dedicated globals-equivalent collections exist
  upstream.
- This ADR does not change ADR-0001's route-group boundary, Pulse adapter,
  or authentication abstraction.

## References

- ADR-0001: One Next.js estate with separated route groups.
- `nabhold/shared/contracts/control-plane/v1/canonical-mapping.schema.json`
  (mapping type `CONTENT`, authority `content`).
- `nabhold/shared/contracts/events/v1/envelope.schema.json` (event envelope
  shape referenced by §11 above).
- `nabhold/baobab-cms/docs/architecture/overview.md`,
  `docs/content-resolution/README.md`, `docs/collections/README.md`.
