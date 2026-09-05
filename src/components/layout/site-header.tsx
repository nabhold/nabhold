import Link from "next/link";

import { getContentGateway } from "@/lib/content";

export async function SiteHeader() {
  const gateway = await getContentGateway();
  const navigation = await gateway.getNavigation();

  return (
    <header className="border-b border-[var(--line)]">
      <div className="shell flex min-h-20 items-center justify-between gap-6">
        <Link href="/" className="font-serif text-xl font-bold">
          NABHOLD <span className="text-[var(--gold-deep)]">GROUP AFRICA</span>
        </Link>
        <nav aria-label="Primary" className="hidden gap-7 md:flex">
          {navigation.primary.map((item) => (
            <Link className="text-sm font-semibold" href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link className="button" href="/sign-in">
          Executive portal
        </Link>
      </div>
    </header>
  );
}
