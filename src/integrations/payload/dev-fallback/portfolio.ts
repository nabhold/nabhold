import type { PortfolioCompany } from "@/lib/content/types";

/**
 * Non-authoritative development fallback, used only when
 * `NABHOLD_CONTENT_DEV_FALLBACK=true` outside production (see
 * `isDevContentFallbackEnabled` in `src/integrations/payload/config.ts`)
 * and Payload has no `portfolio-companies` collection to answer from yet.
 * This is the same illustrative dataset the estate previously hard-coded
 * directly in page components — kept only so local UI work is possible
 * before `baobab-cms` ships the collection (ADR-0002).
 *
 * This must never be reachable in production: `getContentGateway()` fails
 * closed exactly like `src/lib/auth/session.ts`'s preview session.
 */
export const devFallbackPortfolioCompanies: PortfolioCompany[] = [
  {
    slug: "zuribeans",
    name: "Zuribeans",
    sector: "Agriculture & Trade",
    markets: "African and international coffee markets",
    summary:
      "A specialist green-coffee enterprise connecting origin, quality and dependable B2B supply.",
    website: "https://zuribeans.com",
  },
  {
    slug: "thamani",
    name: "Thamani",
    sector: "Trade & Distribution",
    markets: "Regional and cross-border markets",
    summary:
      "A trade-led operating company built around disciplined market access and commercial execution.",
    website: "https://thamani.com",
  },
  {
    slug: "equator-estate",
    name: "Equator & Estate Co.",
    sector: "Property & Built Environment",
    markets: "East and Southern Africa",
    summary:
      "A property enterprise focused on considered places, enduring assets and responsible growth.",
    website: "https://equator-estate.com",
  },
];
