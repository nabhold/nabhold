import type {
  FooterContent,
  GroupProfileContent,
  HomePageContent,
  Navigation,
  SiteSettings,
} from "@/lib/content/types";

/**
 * Estate-owned defaults used when Payload has not yet published a
 * structured document for a given global (ADR-0002: `baobab-cms`'s
 * generic `pages` collection does not yet carry the forward-looking
 * fields these globals need). These are genuine, accurate, general
 * institutional statements the estate is comfortable shipping to
 * production on their own — not placeholder/preview data, and not gated
 * by any development-only flag. They are replaced field-by-field as
 * Payload gains the corresponding schema.
 */

export const ESTATE_DEFAULT_NAVIGATION: Navigation = {
  primary: [
    { label: "About", href: "/about/group" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Sectors", href: "/sectors" },
    { label: "Insights", href: "/insights" },
  ],
};

export const ESTATE_DEFAULT_FOOTER: FooterContent = {
  statement: "Strong Roots. Inspired Growth.",
  tagline: "Grounded enough to endure. Visionary enough to lead.",
  links: [],
};

export const ESTATE_DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: "Nabhold Group Africa",
  seoDefaults: {
    title: "Nabhold Group Africa",
    description:
      "A disciplined African holding company building durable enterprises.",
  },
};

export const ESTATE_DEFAULT_HOME_PAGE: HomePageContent = {
  eyebrow: "African enterprise · long-term value",
  headline: "Built on conviction. Grown with purpose.",
  introduction:
    "Nabhold Group Africa builds and stewards businesses positioned for durable, responsible growth across the continent.",
  primaryCta: { label: "Explore the group", href: "/portfolio" },
  secondaryCta: { label: "Our purpose", href: "/about/group" },
  featuredPortfolioCompanies: [],
  institutionalStatement: "Patient capital. Practical enterprise.",
};

export const ESTATE_DEFAULT_GROUP_PROFILE: GroupProfileContent = {
  title: "Rooted in Africa. Built for generations.",
  body: [
    {
      type: "paragraph",
      text: "Nabhold Group Africa establishes, supports and stewards independently operated businesses.",
    },
    {
      type: "paragraph",
      text: "The group sets strategic direction and investment discipline while each operating company retains responsibility for its customers, operations and digital estate.",
    },
  ],
};
