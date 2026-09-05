import Link from "next/link";

import { getContentGateway } from "@/lib/content";

export default async function Page() {
  const gateway = await getContentGateway();
  const sectors = await gateway.listSectors();

  return (
    <section className="shell py-20">
      <p className="eyebrow">Strategic interests</p>
      <h1 className="display mt-5 text-6xl">
        Sectors where enterprise meets necessity.
      </h1>
      {sectors.length === 0 ? (
        <p className="mt-8 max-w-2xl text-lg leading-8 text-[var(--muted)]">
          Our portfolio spans agriculture and trade, distribution, property
          and the built environment.
        </p>
      ) : (
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {sectors.map((sector) => (
            <Link
              href={`/sectors/${sector.slug}`}
              key={sector.slug}
              className="card p-6"
            >
              <h2 className="font-serif text-2xl">{sector.name}</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                {sector.summary}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
