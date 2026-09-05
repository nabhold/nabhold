import Link from "next/link";

import { listPortfolioCompanies } from "@/features/portfolio/queries";

export default async function Page() {
  const portfolio = await listPortfolioCompanies();

  return (
    <section className="shell py-20">
      <p className="eyebrow">Portfolio</p>
      <h1 className="display mt-5 text-6xl">
        Independent businesses. Shared discipline.
      </h1>
      {portfolio.some((c) => c.devFallback) && (
        <p
          role="status"
          className="mt-5 border border-amber-500 bg-amber-50 p-3 text-sm"
        >
          Development preview data only. No Payload content is connected.
        </p>
      )}
      {portfolio.length === 0 ? (
        <p className="mt-14 text-[var(--muted)]">
          Portfolio content is not yet available.
        </p>
      ) : (
        <div className="mt-14 divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {portfolio.map((c) => (
            <Link
              href={`/portfolio/${c.slug}`}
              key={c.slug}
              className="grid gap-3 py-8 md:grid-cols-[1fr_1fr_2fr]"
            >
              <h2 className="font-serif text-3xl">{c.name}</h2>
              <p className="text-sm font-bold">{c.sector}</p>
              <p className="text-[var(--muted)]">{c.summary}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
