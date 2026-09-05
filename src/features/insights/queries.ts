import { getContentGateway } from "@/lib/content";
import type {
  Insight,
  InsightQuery,
  PaginatedInsights,
} from "@/lib/content/types";

export async function listInsights(
  query?: InsightQuery,
): Promise<PaginatedInsights> {
  const gateway = await getContentGateway();
  return gateway.listInsights(query);
}

export async function getInsight(slug: string): Promise<Insight | null> {
  const gateway = await getContentGateway();
  return gateway.getInsight(slug);
}
