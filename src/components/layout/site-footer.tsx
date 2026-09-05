import Link from "next/link";

import { getContentGateway } from "@/lib/content";

export async function SiteFooter() {
  const gateway = await getContentGateway();
  const footer = await gateway.getFooter();

  return (
    <footer className="mt-24 bg-[var(--ink)] py-12 text-white">
      <div className="shell grid gap-8 md:grid-cols-2">
        <div>
          {footer.statement && (
            <p className="font-serif text-2xl">{footer.statement}</p>
          )}
          {footer.tagline && (
            <p className="mt-3 text-sm text-white/65">{footer.tagline}</p>
          )}
          {footer.links.length > 0 && (
            <nav aria-label="Footer" className="mt-6 flex flex-wrap gap-4">
              {footer.links.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm text-white/75">
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
        <div className="md:text-right">
          <p>Nabhold Group Africa</p>
          <p className="mt-2 text-xs text-white/60">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
