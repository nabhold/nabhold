import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import {
  getPortfolioCompany,
  listPortfolioCompanies,
} from "@/features/portfolio/queries";

export async function generateStaticParams() {
  const portfolio = await listPortfolioCompanies();
  return portfolio.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const company = await getPortfolioCompany(slug);
  if (!company) return {};

  return {
    title: company.seo?.title ?? company.name,
    description: company.seo?.description ?? company.summary,
    openGraph: {
      title: company.seo?.openGraphTitle ?? company.name,
      description: company.seo?.openGraphDescription ?? company.summary,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = await getPortfolioCompany(slug);
  if (!c) notFound();

  return (
    <article className="shell py-20">
      <p className="eyebrow">Portfolio company · {c.sector}</p>
      <h1 className="display mt-5 text-6xl md:text-8xl">{c.name}</h1>
      {c.devFallback && (
        <p
          role="status"
          className="mt-5 border border-amber-500 bg-amber-50 p-3 text-sm"
        >
          Development preview data only. No Payload content is connected.
        </p>
      )}
      {c.heroMedia && (
        <Image
          className="mt-10 h-auto w-full rounded-[var(--radius)] object-cover"
          src={c.heroMedia.url}
          alt={c.heroMedia.alt}
          width={c.heroMedia.width ?? 1200}
          height={c.heroMedia.height ?? 675}
          priority
        />
      )}
      <div className="mt-12 grid gap-10 border-t border-[var(--line)] pt-10 md:grid-cols-2">
        <div>
          <h2 className="font-serif text-2xl">Overview</h2>
          <p className="mt-4 leading-7 text-[var(--muted)]">{c.summary}</p>
          {c.description && (
            <p className="mt-4 leading-7 text-[var(--muted)]">
              {c.description}
            </p>
          )}
        </div>
        <div>
          <h2 className="font-serif text-2xl">Markets</h2>
          <p className="mt-4 text-[var(--muted)]">{c.markets}</p>
          {c.website && (
            <a
              className="button mt-8"
              href={c.website}
              rel="noreferrer"
              target="_blank"
            >
              Visit digital estate ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
