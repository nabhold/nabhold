import { z } from "zod";

import {
  canonicalContextDtoSchema,
  mediaDtoSchema,
  seoDtoSchema,
} from "./common.dto";
import { richTextDtoSchema } from "./rich-text.dto";

const callToActionDtoSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

const navigationItemDtoSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

/**
 * `baobab-cms`'s real, generic `pages` collection today only guarantees
 * `contentKey`, `title`, `slug`, `status` and `content` (richText). The
 * remaining fields describe the structured globals-equivalent contract
 * (`home`, `navigation`, `footer`, `site-settings` content keys) this
 * estate would like `baobab-cms` to add; until then they are absent and
 * every consumer falls back to estate-owned defaults (see
 * `src/integrations/payload/mappers/page.mapper.ts`).
 */
export const pageDtoSchema = canonicalContextDtoSchema.extend({
  id: z.string(),
  contentKey: z.string().min(1),
  title: z.string().optional(),
  slug: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  content: richTextDtoSchema,

  // Home page (contentKey: "home") — forward-looking, optional.
  eyebrow: z.string().optional(),
  headline: z.string().optional(),
  introduction: z.string().optional(),
  primaryCta: callToActionDtoSchema.optional(),
  secondaryCta: callToActionDtoSchema.optional(),
  featuredPortfolioCompanies: z.array(z.string()).optional(),
  institutionalStatement: z.string().optional(),
  heroMedia: mediaDtoSchema.nullable().optional(),

  // Navigation (contentKey: "navigation") — forward-looking, optional.
  navigationItems: z.array(navigationItemDtoSchema).optional(),

  // Footer (contentKey: "footer") — forward-looking, optional.
  statement: z.string().optional(),
  tagline: z.string().optional(),
  footerLinks: z.array(navigationItemDtoSchema).optional(),

  // Site settings (contentKey: "site-settings") — forward-looking, optional.
  siteName: z.string().optional(),
  seo: seoDtoSchema.optional(),
});

export type PageDto = z.infer<typeof pageDtoSchema>;
