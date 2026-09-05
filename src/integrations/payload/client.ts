import type { CorporateContentGateway } from "@/lib/content/gateway";
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
} from "@/lib/content/types";

import { isDevContentFallbackEnabled } from "./config";
import { contentCacheTags } from "@/lib/content/cache";
import {
  ESTATE_DEFAULT_FOOTER,
  ESTATE_DEFAULT_GROUP_PROFILE,
  ESTATE_DEFAULT_HOME_PAGE,
  ESTATE_DEFAULT_NAVIGATION,
  ESTATE_DEFAULT_SITE_SETTINGS,
} from "./defaults";
import { devFallbackPortfolioCompanies } from "./dev-fallback/portfolio";
import {
  toFooter,
  toGroupProfile,
  toHomePageFields,
  toInsight,
  toInsightSummary,
  toNavigation,
  toPortfolioCompany,
  toPortfolioCompanySummary,
  toSector,
  toSectorSummary,
  toSiteSettings,
} from "./mappers";
import {
  getInsightDtoBySlug,
  getPageDtoByContentKey,
  getPortfolioCompanyDtoBySlug,
  getSectorDtoBySlug,
  listInsightDtos,
  listPortfolioCompanyDtos,
  listSectorDtos,
} from "./queries";

/**
 * Payload-backed implementation of the content port. Every method
 * degrades gracefully (empty list / `null` / estate default) rather than
 * throwing — Payload availability must never crash a public page
 * (ADR-0002 resilience requirements). The query layer already logs the
 * reason server-side.
 */
class PayloadCorporateContentGateway implements CorporateContentGateway {
  async getSiteSettings(): Promise<SiteSettings> {
    const dto = await getPageDtoByContentKey("site-settings", [
      contentCacheTags.site,
    ]);
    return toSiteSettings(dto, ESTATE_DEFAULT_SITE_SETTINGS);
  }

  async getHomePage(): Promise<HomePageContent> {
    const dto = await getPageDtoByContentKey("home", [
      contentCacheTags.homepage,
    ]);

    const companies = await this.listPortfolioCompanies();

    if (!dto) {
      return {
        ...ESTATE_DEFAULT_HOME_PAGE,
        featuredPortfolioCompanies: companies.slice(0, 3),
      };
    }

    const fields = toHomePageFields(dto);
    const featured = fields.featuredPortfolioCompanySlugs.length
      ? companies.filter((company) =>
          fields.featuredPortfolioCompanySlugs.includes(company.slug),
        )
      : companies.slice(0, 3);

    return {
      ...fields.canonical,
      eyebrow: fields.eyebrow ?? ESTATE_DEFAULT_HOME_PAGE.eyebrow,
      headline: fields.headline ?? ESTATE_DEFAULT_HOME_PAGE.headline,
      introduction: fields.introduction ?? ESTATE_DEFAULT_HOME_PAGE.introduction,
      primaryCta: fields.primaryCta ?? ESTATE_DEFAULT_HOME_PAGE.primaryCta,
      secondaryCta: fields.secondaryCta ?? ESTATE_DEFAULT_HOME_PAGE.secondaryCta,
      featuredPortfolioCompanies: featured,
      institutionalStatement:
        fields.institutionalStatement ??
        ESTATE_DEFAULT_HOME_PAGE.institutionalStatement,
      heroMedia: fields.heroMedia,
      seo: fields.seo,
    };
  }

  async getNavigation(): Promise<Navigation> {
    const dto = await getPageDtoByContentKey("navigation", [
      contentCacheTags.navigation,
    ]);
    return toNavigation(dto, ESTATE_DEFAULT_NAVIGATION);
  }

  async getFooter(): Promise<FooterContent> {
    const dto = await getPageDtoByContentKey("footer", [
      contentCacheTags.footer,
    ]);
    return toFooter(dto, ESTATE_DEFAULT_FOOTER);
  }

  async getGroupProfile(): Promise<GroupProfileContent> {
    const dto = await getPageDtoByContentKey("group-profile", [
      contentCacheTags.groupProfile,
    ]);
    return toGroupProfile(dto, ESTATE_DEFAULT_GROUP_PROFILE);
  }

  async listPortfolioCompanies(): Promise<PortfolioCompanySummary[]> {
    const dtos = await listPortfolioCompanyDtos();

    if (dtos.length > 0) {
      return dtos.map(toPortfolioCompanySummary);
    }

    if (isDevContentFallbackEnabled()) {
      return devFallbackPortfolioCompanies.map((company) => ({
        ...company,
        devFallback: true as const,
      }));
    }

    return [];
  }

  async getPortfolioCompany(slug: string): Promise<PortfolioCompany | null> {
    const dto = await getPortfolioCompanyDtoBySlug(slug);

    if (dto) {
      return toPortfolioCompany(dto);
    }

    if (isDevContentFallbackEnabled()) {
      const fallback = devFallbackPortfolioCompanies.find(
        (company) => company.slug === slug,
      );
      return fallback ? { ...fallback, devFallback: true as const } : null;
    }

    return null;
  }

  async listSectors(): Promise<SectorSummary[]> {
    const dtos = await listSectorDtos();
    return dtos.map(toSectorSummary);
  }

  async getSector(slug: string): Promise<Sector | null> {
    const dto = await getSectorDtoBySlug(slug);
    return dto ? toSector(dto) : null;
  }

  async listInsights(input: InsightQuery = {}): Promise<PaginatedInsights> {
    const result = await listInsightDtos(input);

    return {
      items: result.items.map(toInsightSummary),
      page: result.page,
      pageSize: result.pageSize,
      totalItems: result.totalItems,
      totalPages: result.totalPages,
    };
  }

  async getInsight(slug: string): Promise<Insight | null> {
    const dto = await getInsightDtoBySlug(slug);
    return dto ? toInsight(dto) : null;
  }
}

export function createPayloadContentGateway(): CorporateContentGateway {
  return new PayloadCorporateContentGateway();
}
