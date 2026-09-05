import { timingSafeEqual } from "node:crypto";

import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { getRevalidateSecret } from "@/integrations/payload";
import { revalidateRequestSchema } from "@/lib/content/schemas";
import { tagsForRevalidateRequest } from "@/lib/content/cache";

/**
 * Authenticated, narrow cache-invalidation endpoint for `baobab-cms`
 * publication events (ADR-0002 §10-11). It never clears the whole cache —
 * only the tags derived from the specific collection/document named in the
 * request body — and it never echoes upstream content back to the caller.
 */

function isAuthorized(request: Request): boolean {
  const expected = getRevalidateSecret();
  if (!expected) return false;

  const provided = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!provided) return false;

  const expectedBuffer = Buffer.from(expected);
  const providedBuffer = Buffer.from(provided);

  if (expectedBuffer.length !== providedBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, providedBuffer);
}

export async function POST(request: Request): Promise<Response> {
  if (!getRevalidateSecret()) {
    return NextResponse.json(
      { error: "Revalidation is not configured" },
      { status: 503 },
    );
  }

  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = revalidateRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid revalidation request" },
      { status: 400 },
    );
  }

  const tags = tagsForRevalidateRequest(parsed.data);
  for (const tag of tags) {
    revalidateTag(tag);
  }

  return NextResponse.json({ revalidated: true, tags });
}
