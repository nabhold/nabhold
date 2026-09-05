import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { getInsight } from "@/features/insights/queries";
import { resolveCanonicalOverride } from "@/lib/content/cache";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const insight = await getInsight(slug);
  if (!insight) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const canonical =
    resolveCanonicalOverride(insight.seo?.canonicalOverride, siteUrl) ??
    `${siteUrl}/insights/${insight.slug}`;

  return {
    title: insight.seo?.title ?? insight.title,
    description: insight.seo?.description ?? insight.excerpt,
    alternates: { canonical },
    openGraph: {
      title: insight.seo?.openGraphTitle ?? insight.title,
      description: insight.seo?.openGraphDescription ?? insight.excerpt,
      type: "article",
      publishedTime: insight.publishedAt,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const insight = await getInsight(slug);
  if (!insight) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: insight.title,
    datePublished: insight.publishedAt,
    author: insight.authors.map((author) => ({
      "@type": "Person",
      name: author.name,
    })),
  };

  return (
    <article className="shell max-w-3xl py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <p className="eyebrow">{insight.contentType}</p>
      <h1 className="display mt-5 text-5xl">{insight.title}</h1>
      <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
        {insight.authors.map((author) => (
          <span key={author.id}>{author.name}</span>
        ))}
        <time dateTime={insight.publishedAt}>
          {new Date(insight.publishedAt).toLocaleDateString("en-ZA", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </div>
      {insight.heroMedia && (
        <Image
          className="mt-8 h-auto w-full rounded-[var(--radius)] object-cover"
          src={insight.heroMedia.url}
          alt={insight.heroMedia.alt}
          width={insight.heroMedia.width ?? 1200}
          height={insight.heroMedia.height ?? 675}
          priority
        />
      )}
      <div className="mt-10 space-y-6 text-lg leading-8 text-[var(--muted)]">
        {insight.body.length === 0 ? (
          <p>{insight.excerpt}</p>
        ) : (
          insight.body.map((block, index) =>
            block.type === "heading" ? (
              <h2 key={index} className="font-serif text-2xl text-[var(--ink)]">
                {block.text}
              </h2>
            ) : (
              <p key={index}>{block.text}</p>
            ),
          )
        )}
      </div>
    </article>
  );
}
