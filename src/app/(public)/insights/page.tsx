import Link from "next/link";

import { insightQuerySchema } from "@/lib/content/schemas";
import { listInsights } from "@/features/insights/queries";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const rawParams = await searchParams;
  const parsed = insightQuerySchema.safeParse(rawParams);
  const query = parsed.success ? parsed.data : {};

  const insights = await listInsights(query);

  return (
    <section className="shell py-20">
      <p className="eyebrow">Insights</p>
      <h1 className="display mt-5 text-6xl">
        Considered views, published when useful.
      </h1>
      {insights.items.length === 0 ? (
        <p className="mt-8 text-[var(--muted)]">
          Corporate publications and strategic commentary will appear here as
          released.
        </p>
      ) : (
        <div className="mt-12 divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {insights.items.map((insight) => (
            <Link
              href={`/insights/${insight.slug}`}
              key={insight.slug}
              className="grid gap-3 py-8 md:grid-cols-[1fr_2fr_auto]"
            >
              <span className="text-xs font-bold uppercase tracking-wide text-[var(--gold-deep)]">
                {insight.contentType}
              </span>
              <div>
                <h2 className="font-serif text-2xl">{insight.title}</h2>
                {insight.excerpt && (
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {insight.excerpt}
                  </p>
                )}
              </div>
              <time
                className="text-xs text-[var(--muted)]"
                dateTime={insight.publishedAt}
              >
                {new Date(insight.publishedAt).toLocaleDateString("en-ZA", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
