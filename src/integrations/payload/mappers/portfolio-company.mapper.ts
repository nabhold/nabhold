import type {
  PortfolioCompany,
  PortfolioCompanySummary,
} from "@/lib/content/types";
import type { PortfolioCompanyDto } from "../dto/portfolio-company.dto";

import { mapCanonicalContext } from "./canonical-context.mapper";
import { mapMedia } from "./media.mapper";
import { mapSeo } from "./seo.mapper";

export function toPortfolioCompanySummary(
  dto: PortfolioCompanyDto,
): PortfolioCompanySummary {
  return {
    ...mapCanonicalContext(dto),
    slug: dto.slug,
    name: dto.name,
    strapline: dto.strapline,
    summary: dto.summary,
    sector: dto.sector,
    logo: mapMedia(dto.logo),
  };
}

export function toPortfolioCompany(dto: PortfolioCompanyDto): PortfolioCompany {
  return {
    ...toPortfolioCompanySummary(dto),
    legalName: dto.legalName,
    description: dto.description,
    markets: dto.markets,
    website: dto.website,
    heroMedia: mapMedia(dto.heroMedia),
    investmentThesis: dto.investmentThesis,
    strategicRole: dto.strategicRole,
    status: dto.status,
    seo: mapSeo(dto.seo),
  };
}
