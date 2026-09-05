import { getContentGateway } from "@/lib/content";
import type { PortfolioCompany, PortfolioCompanySummary } from "@/lib/content/types";

export async function listPortfolioCompanies(): Promise<
  PortfolioCompanySummary[]
> {
  const gateway = await getContentGateway();
  return gateway.listPortfolioCompanies();
}

export async function getPortfolioCompany(
  slug: string,
): Promise<PortfolioCompany | null> {
  const gateway = await getContentGateway();
  return gateway.getPortfolioCompany(slug);
}
