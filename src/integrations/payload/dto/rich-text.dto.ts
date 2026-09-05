import { z } from "zod";

/**
 * Payload's Lexical rich-text field serialises to an editor-defined JSON
 * tree. There is no stable published schema for it, so this validates only
 * that it is a plausible tree shape; `mappers/rich-text.ts` walks it
 * defensively and never assumes a particular node type is present.
 */
export const richTextDtoSchema = z
  .object({
    root: z
      .object({
        children: z.array(z.unknown()).default([]),
      })
      .passthrough(),
  })
  .nullable()
  .optional();

export type RichTextDto = z.infer<typeof richTextDtoSchema>;
