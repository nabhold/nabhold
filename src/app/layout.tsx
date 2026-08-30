import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"), title: { default: "Nabhold Group Africa", template: "%s | Nabhold Group Africa" }, description: "A disciplined African holding company building durable enterprises.", openGraph: { title: "Nabhold Group Africa", type: "website" } };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a>{children}</body></html>}
