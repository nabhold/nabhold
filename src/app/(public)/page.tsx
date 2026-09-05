import Link from "next/link";

import { getContentGateway } from "@/lib/content";

export default async function HomePage() {
  const gateway = await getContentGateway();
  const home = await gateway.getHomePage();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Nabhold Group Africa",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <section className="border-b border-[var(--line)] py-20 md:py-32">
        <div className="shell grid items-end gap-10 md:grid-cols-[1.25fr_.75fr]">
          <div>
            {home.eyebrow && <p className="eyebrow">{home.eyebrow}</p>}
            <h1 className="display mt-6 text-6xl md:text-8xl">
              {home.headline}
            </h1>
          </div>
          <div>
            {home.introduction && (
              <p className="text-lg leading-8 text-[var(--muted)]">
                {home.introduction}
              </p>
            )}
            <div className="mt-7 flex gap-3">
              {home.primaryCta && (
                <Link className="button" href={home.primaryCta.href}>
                  {home.primaryCta.label}
                </Link>
              )}
              {home.secondaryCta && (
                <Link
                  className="button secondary"
                  href={home.secondaryCta.href}
                >
                  {home.secondaryCta.label}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
      {home.featuredPortfolioCompanies.length > 0 && (
        <section className="shell py-20">
          <p className="eyebrow">Our portfolio</p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {home.featuredPortfolioCompanies.map((c, i) => (
              <Link
                href={`/portfolio/${c.slug}`}
                className="card min-h-72 p-7"
                key={c.slug}
              >
                <span className="text-xs text-[var(--muted)]">
                  0{i + 1}
                </span>
                <h2 className="mt-16 font-serif text-3xl">{c.name}</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  {c.summary}
                </p>
                <span className="mt-7 inline-block font-bold text-[var(--gold-deep)]">
                  View company →
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
      {home.institutionalStatement && (
        <section className="bg-[var(--forest)] py-20 text-white">
          <div className="shell grid gap-10 md:grid-cols-2">
            <h2 className="display text-5xl">{home.institutionalStatement}</h2>
            <p className="self-end text-lg leading-8 text-white/75">
              Institutional discipline joined to a clear understanding of
              African markets.
            </p>
          </div>
        </section>
      )}
    </>
  );
}
