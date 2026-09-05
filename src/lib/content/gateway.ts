import type {
  FooterContent,
  GroupProfileContent,
  HomePageContent,
  Insight,
  InsightQuery,
  Navigation,
  PaginatedInsights,
  PortfolioCompany,
  PortfolioCompanySummary,
  Sector,
  SectorSummary,
  SiteSettings,
} from "./types";

/**
 * The content port. Every Server Component reads corporate editorial
 * content through this interface, never through `src/integrations/payload`
 * directly (see ADR-0002 §6-7).
 *
 * Implementations must never throw for "content does not exist yet"; they
 * return `null`/an empty collection and let the caller decide between
 * `notFound()` and a graceful empty state. They may throw for genuine
 * infrastructure failure only where the caller is expected to handle it
 * (all current call sites catch and degrade — see
 * `src/integrations/payload/client.ts`).
 */
export interface CorporateContentGateway {
  getSiteSettings(): Promise<SiteSettings>;
  getHomePage(): Promise<HomePageContent>;
  getNavigation(): Promise<Navigation>;
  getFooter(): Promise<FooterContent>;
  getGroupProfile(): Promise<GroupProfileContent>;

  listPortfolioCompanies(): Promise<PortfolioCompanySummary[]>;
  getPortfolioCompany(slug: string): Promise<PortfolioCompany | null>;

  listSectors(): Promise<SectorSummary[]>;
  getSector(slug: string): Promise<Sector | null>;

  listInsights(input?: InsightQuery): Promise<PaginatedInsights>;
  getInsight(slug: string): Promise<Insight | null>;
}

let cachedGateway: CorporateContentGateway | undefined;

/**
 * Composition root for the content port. Lazily imported so that pages
 * depend only on the `CorporateContentGateway` type; swapping the
 * implementation (e.g. for tests) never requires touching page code.
 */
export async function getContentGateway(): Promise<CorporateContentGateway> {
  if (!cachedGateway) {
    const { createPayloadContentGateway } = await import(
      "@/integrations/payload"
    );
    cachedGateway = createPayloadContentGateway();
  }

  return cachedGateway;
}
