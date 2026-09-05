# Corporate content model

The estate-owned content models this repository reads through
`CorporateContentGateway` (`src/lib/content/gateway.ts`), and the target
Payload collections/globals they are designed to consume — see
`docs/integrations/payload.md` for what exists in `baobab-cms` today versus
what is still required there.

All types are declared in `src/lib/content/types.ts`. Every type extends
`CanonicalContext` where it carries Baobab references:

```ts
interface CanonicalContext {
  canonicalEntityId?: string;   // opaque id minted by its authoritative domain
  organisationId?: string;      // canonical legal-entity id, e.g. "NABHOLD"
  digitalEstateId?: string;     // canonical digital-estate id for this estate
  marketIds?: string[];         // commercial/regulatory/geographic context
  locale?: string;               // BCP 47, e.g. "en-ZA" — distinct from market
  visibility?: "public" | "registered" | "client" | "premium" | "board";
}
```

**Market vs. locale.** A market is a commercial/regulatory/geographic
operating boundary (`south-africa`, `uganda`); a locale is a language/region
rendering context (`en-ZA`, `en-UG`). The same market can render in more than
one locale, and the same locale can serve more than one market. Neither
implies the other. This mirrors
`nabhold/shared/contracts/control-plane/v1/market.schema.json`, which models
`default_locale`/`supported_locales` as attributes of a market, not synonyms
for it.

**Canonical references, never redefinitions.** `organisationId`,
`digitalEstateId` and `marketIds` are references into Baobab's own canonical
registries (`nabhold/shared/contracts`). This repository never creates a
cross-database relationship into another Baobab engine and never redefines
what those ids mean.

## Portfolio company

Target Payload collection: `portfolio-companies` (not yet present in
`baobab-cms`; see `docs/integrations/payload.md` §"Required follow-up").

```ts
interface PortfolioCompany extends CanonicalContext {
  slug: string;               // required
  name: string;                // required
  summary: string;             // required
  legalName?: string;
  strapline?: string;
  description?: string;
  sector?: string;
  markets?: string;            // free-text editorial description, not a MarketId
  website?: string;
  logo?: MediaAsset | null;
  heroMedia?: MediaAsset | null;
  investmentThesis?: string;
  strategicRole?: string;
  status?: "active" | "dormant" | "exited";
  seo?: SeoMetadata;
  devFallback?: true;          // set only by the non-authoritative dev fallback
}
```

Only `slug`, `name` and `summary` are required at the DTO boundary
(`src/integrations/payload/dto/portfolio-company.dto.ts`) — every other field
is optional so the estate degrades gracefully as `baobab-cms`'s schema fills
in.

## Sector

Target collection: `sectors` (not yet present).

```ts
interface Sector extends CanonicalContext {
  slug: string;
  name: string;
  summary: string;
  description?: string;
  heroMedia?: MediaAsset | null;
  seo?: SeoMetadata;
}
```

## Insight

Target collection: `insights` (not yet present). Covers the full editorial
publishing surface — insight, research note, market brief, sector outlook,
trade intelligence, investment thesis, regulatory alert, white paper, annual
review, press release — distinguished by `contentType`.

```ts
type InsightContentType =
  | "insight" | "research-note" | "market-brief" | "sector-outlook"
  | "trade-intelligence" | "investment-thesis" | "regulatory-alert"
  | "white-paper" | "annual-review" | "press-release";

interface Insight extends CanonicalContext {
  slug: string;
  title: string;
  excerpt?: string;
  body: RichTextBlock[];       // plain-text blocks extracted from Payload rich text
  authors: Author[];
  topics: string[];
  sectors?: string[];
  contentType: InsightContentType;
  publishedAt: string;
  heroMedia?: MediaAsset | null;
  seo?: SeoMetadata;
}
```

`body` is a list of `{ type: "paragraph" | "heading", level?, text }` blocks,
never raw HTML — see `src/integrations/payload/mappers/rich-text.ts`. No
component in this repository calls `dangerouslySetInnerHTML` on Payload
content.

**Entitlements.** `visibility` (`public`/`registered`/`client`/`premium`/
`board`) is carried on the content record, but this repository does not
implement entitlement *enforcement* — that is a Baobab platform
identity/context capability (Control Plane), not Payload, and not this
estate's presentation layer.

## Home page, navigation, footer, site settings, group profile

Modelled as globals-equivalents today via `baobab-cms`'s generic `pages`
collection, keyed by `contentKey` (`home`, `navigation`, `footer`,
`site-settings`, `group-profile`) — see
`src/integrations/payload/dto/page.dto.ts` and
`src/integrations/payload/mappers/page.mapper.ts`. The homepage's visual
hierarchy remains developer-controlled (`src/app/(public)/page.tsx`); only
its editorial data (eyebrow, headline, introduction, CTAs, featured
companies, institutional statement, hero media, SEO) is Payload-sourced.
Every field falls back to an estate-owned default
(`src/integrations/payload/defaults.ts`) when Payload has not yet published
a document — this is legitimate, accurate, developer-authored institutional
copy, not fabricated Payload content, and is not gated by any development
flag.

## Media and SEO

`MediaAsset` and `SeoMetadata` are shared value types used across every
content type above. `SeoMetadata.canonicalOverride` is validated against
this estate's own origin before use (`resolveCanonicalOverride` in
`src/lib/content/cache.ts`) — an editor cannot point canonical/OG metadata at
an external origin.
