import type { Metadata } from "next";
import "./globals.css";

import { getContentGateway } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const gateway = await getContentGateway();
  const settings = await gateway.getSiteSettings();

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    ),
    title: {
      default: settings.seoDefaults?.title ?? settings.siteName,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.seoDefaults?.description,
    openGraph: {
      title: settings.seoDefaults?.openGraphTitle ?? settings.siteName,
      type: "website",
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
