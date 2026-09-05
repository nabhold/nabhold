import type { RichTextBlock } from "@/lib/content/types";
import type { RichTextDto } from "../dto/rich-text.dto";

/**
 * Defensively walks a Lexical JSON tree and extracts plain-text paragraph
 * and heading blocks. There is no `dangerouslySetInnerHTML` anywhere in
 * this pipeline — untrusted Payload rich text becomes plain strings, and
 * the estate's own components decide how to render them (ADR-0002 §7).
 */
export function extractPlainTextBlocks(value: RichTextDto): RichTextBlock[] {
  const children = value?.root?.children;
  if (!Array.isArray(children)) return [];

  const blocks: RichTextBlock[] = [];

  for (const node of children) {
    const text = extractText(node).trim();
    if (!text) continue;

    const heading = headingLevel(node);
    blocks.push(
      heading
        ? { type: "heading", level: heading, text }
        : { type: "paragraph", text },
    );
  }

  return blocks;
}

function extractText(node: unknown): string {
  if (!node || typeof node !== "object") return "";

  const record = node as Record<string, unknown>;

  if (typeof record.text === "string") {
    return record.text;
  }

  if (Array.isArray(record.children)) {
    return record.children.map(extractText).join("");
  }

  return "";
}

function headingLevel(node: unknown): 1 | 2 | 3 | undefined {
  if (!node || typeof node !== "object") return undefined;

  const record = node as Record<string, unknown>;
  if (record.type !== "heading") return undefined;

  const tag = record.tag;
  if (tag === "h1") return 1;
  if (tag === "h2") return 2;
  if (tag === "h3") return 3;
  return 2;
}
