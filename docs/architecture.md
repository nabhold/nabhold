# Architecture overview

This repository is Nabhold Group Africa's independently deployable digital estate. It owns corporate presentation and the executive decision experience; it does not own commerce, ERP, tenancy, identity, intelligence processing, or infrastructure.

- `src/app/(public)` is cacheable, indexable corporate content.
- `src/app/(dashboard)` is dynamic, non-indexable and protected by the server-side session abstraction.
- `src/lib/content` is the content port (`CorporateContentGateway`) every page reads corporate editorial content through; `src/integrations/payload` is its Payload-backed adapter. See ADR-0002, `docs/integrations/payload.md` and `docs/content-model.md`.
- `src/lib/pulse` is the sole Baobab Pulse HTTP boundary.
- `src/lib/auth` isolates the future Control Plane/federated SSO integration.

No Baobab database may be accessed directly. Preview data is visibly labelled and only validates presentation before the Pulse API contract exists. The same rule applies to the portfolio development content fallback in `src/integrations/payload/dev-fallback` — gated by `NABHOLD_CONTENT_DEV_FALLBACK` and fail-closed in production.

## Content boundary

```text
React Server Component
        |
        v
CorporateContentGateway        src/lib/content         (the port)
        |
        v
PayloadCorporateContentGateway src/integrations/payload (the adapter)
        |
        v
Payload REST API (nabhold/baobab-cms, headless, server-only)
```

Payload CMS is the authoritative corporate editorial content engine
(portfolio narratives, sectors, insights, homepage, navigation, footer, SEO
defaults). It is never embedded in this repository, never becomes the
authentication provider, and never becomes authoritative for tenancy,
identity, ERP, commerce or Pulse-analytical data — those remain Baobab
platform concerns, referenced from content records by canonical id only
(`organisationId`, `digitalEstateId`, `marketIds`), never redefined. The
executive dashboard (`(dashboard)`) remains Baobab-driven (Pulse, Control
Plane, ERP); Payload may only supply minor supporting copy through the same
gateway.
