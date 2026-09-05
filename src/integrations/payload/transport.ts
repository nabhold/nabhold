import { getPayloadConfig } from "./config";
import { payloadLogger } from "./logger";

export class PayloadUnavailableError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "PayloadUnavailableError";
  }
}

export type PayloadFetchResult =
  | { status: "ok"; data: unknown }
  /** The document, or the collection route itself, does not exist (yet). */
  | { status: "not-found" }
  /** `PAYLOAD_BASE_URL` is unset — expected in local/CI builds without a CMS. */
  | { status: "not-configured" }
  | { status: "unavailable"; error: PayloadUnavailableError };

interface PayloadFetchOptions {
  searchParams?: Record<string, string>;
  /** Cache tags applied to the underlying `fetch` call (see `src/lib/content/cache.ts`). */
  tags?: string[];
}

/**
 * Server-only Payload REST client. Every corporate-content query goes
 * through this function so that timeout, auth and error handling live in
 * one place (mirrors `src/lib/pulse/client.ts`).
 */
export async function fetchPayload(
  path: string,
  options: PayloadFetchOptions = {},
): Promise<PayloadFetchResult> {
  const config = getPayloadConfig();

  if (!config) {
    return { status: "not-configured" };
  }

  const url = new URL(`/api/${path.replace(/^\/+/, "")}`, config.baseUrl);
  for (const [key, value] of Object.entries(options.searchParams ?? {})) {
    url.searchParams.set(key, value);
  }

  let response: Response;

  try {
    response = await fetch(url, {
      headers: config.apiToken
        ? { Authorization: `Bearer ${config.apiToken}` }
        : undefined,
      signal: AbortSignal.timeout(config.timeoutMs),
      next: { tags: options.tags, revalidate: false },
    });
  } catch (error) {
    return {
      status: "unavailable",
      error: new PayloadUnavailableError("Payload request failed", {
        cause: error,
      }),
    };
  }

  if (response.status === 404) {
    return { status: "not-found" };
  }

  if (!response.ok) {
    return {
      status: "unavailable",
      error: new PayloadUnavailableError(
        `Payload returned ${response.status}`,
      ),
    };
  }

  try {
    return { status: "ok", data: await response.json() };
  } catch (error) {
    return {
      status: "unavailable",
      error: new PayloadUnavailableError("Payload returned invalid JSON", {
        cause: error,
      }),
    };
  }
}

/**
 * Logs a non-`ok` result with the right severity: an unpublished/missing
 * collection or an unconfigured Payload deployment are expected during
 * rollout (info); a genuine transport or validation failure is not (warn).
 * No-op for `ok` results.
 */
export function logPayloadOutcome(
  result: PayloadFetchResult,
  fields: Record<string, unknown> & { operation: string },
): void {
  if (result.status === "ok") return;

  if (result.status === "unavailable") {
    payloadLogger.degraded({ ...fields, reason: result.error.message });
    return;
  }

  payloadLogger.contentUnavailable({
    ...fields,
    reason:
      result.status === "not-configured"
        ? "payload-not-configured"
        : "collection-not-available",
  });
}
