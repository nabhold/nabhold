import type { MetadataRoute } from "next";

import { getContentGateway } from "@/lib/content";
import { listPortfolioCompanies } from "@/features/portfolio/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const gateway = await getContentGateway();
  const [portfolio, sectors, insights] = await Promise.all([
    listPortfolioCompanies(),
    gateway.listSectors(),
    gateway.listInsights({ pageSize: 100 }),
  ]);

  return [
    "",
    "/about/group",
    "/portfolio",
    "/sectors",
    "/insights",
    ...portfolio.map((c) => `/portfolio/${c.slug}`),
    ...sectors.map((s) => `/sectors/${s.slug}`),
    ...insights.items.map((i) => `/insights/${i.slug}`),
  ].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "monthly",
  }));
}
