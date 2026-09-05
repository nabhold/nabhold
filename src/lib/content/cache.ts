import type { RevalidateRequest } from "./schemas";

/**
 * Cache tag vocabulary for Payload-backed corporate content.
 *
 * Server Components read content through functions tagged with these
 * groups (via `next/cache`'s `unstable_cache` or `fetch`'s `next.tags`).
 * `POST /api/revalidate` (see `src/app/api/revalidate/route.ts`) maps an
 * incoming Payload publication event onto a narrow subset of these tags
 * rather than revalidating the whole estate.
 */
export const contentCacheTags = {
  site: "content:site",
  navigation: "content:navigation",
  footer: "content:footer",
  homepage: "content:homepage",
  groupProfile: "content:group-profile",
  portfolio: "content:portfolio",
  portfolioCompany: (slug: string) => `content:portfolio:${slug}`,
  sectors: "content:sectors",
  sector: (slug: string) => `content:sector:${slug}`,
  insights: "content:insights",
  insight: (slug: string) => `content:insight:${slug}`,
} as const;

/**
 * Every tag affected when a portfolio company publishes/unpublishes,
 * including the homepage (which may feature it).
 */
export function tagsForPortfolioCompany(slug: string): string[] {
  return [
    contentCacheTags.portfolio,
    contentCacheTags.portfolioCompany(slug),
    contentCacheTags.homepage,
  ];
}

export function tagsForSector(slug: string): string[] {
  return [contentCacheTags.sectors, contentCacheTags.sector(slug)];
}

export function tagsForInsight(slug: string): string[] {
  return [contentCacheTags.insights, contentCacheTags.insight(slug)];
}

export function tagsForGlobal(
  global: "site" | "navigation" | "footer" | "homepage" | "groupProfile",
): string[] {
  return [contentCacheTags[global]];
}

const globalContentKeyTags: Record<
  Extract<RevalidateRequest, { collection: "pages" }>["contentKey"],
  string
> = {
  home: contentCacheTags.homepage,
  navigation: contentCacheTags.navigation,
  footer: contentCacheTags.footer,
  "site-settings": contentCacheTags.site,
  "group-profile": contentCacheTags.groupProfile,
};

/** Maps a validated `/api/revalidate` request onto the cache tags it affects. */
export function tagsForRevalidateRequest(request: RevalidateRequest): string[] {
  switch (request.collection) {
    case "portfolio-companies":
      return tagsForPortfolioCompany(request.slug);
    case "sectors":
      return tagsForSector(request.slug);
    case "insights":
      return tagsForInsight(request.slug);
    case "pages":
      return [globalContentKeyTags[request.contentKey]];
  }
}

/**
 * Validates an editorial canonical-URL override against this estate's own
 * origin. Payload responses are untrusted input — a CMS editor must never
 * be able to point canonical/OG metadata at an arbitrary external origin.
 * Returns `null` (falling back to the computed canonical URL) when the
 * override is absent, malformed, or points off-estate.
 */
export function resolveCanonicalOverride(
  override: string | undefined,
  siteUrl: string,
): string | null {
  if (!override) return null;

  try {
    const base = new URL(siteUrl);
    const resolved = new URL(override, base);

    if (resolved.origin !== base.origin) {
      return null;
    }

    return resolved.toString();
  } catch {
    return null;
  }
}
