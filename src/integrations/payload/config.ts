/**
 * Typed environment configuration for the Payload adapter. Nothing else in
 * `src/integrations/payload` reads `process.env` directly.
 */
export interface PayloadConfig {
  /** Origin of the headless Payload deployment, e.g. https://cms.nabhold.internal */
  baseUrl: string;
  /** Server-only credential. Never exposed to the browser (no NEXT_PUBLIC_* mirror). */
  apiToken?: string;
  timeoutMs: number;
}

const DEFAULT_TIMEOUT_MS = 5_000;

function normalizeBaseUrl(raw: string): string {
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

/**
 * Returns `null` when Payload is not configured (e.g. local development
 * without the CMS running). Callers must treat that as "content
 * unavailable," never as an error to surface to a visitor.
 */
export function getPayloadConfig(): PayloadConfig | null {
  const baseUrl = process.env.PAYLOAD_BASE_URL;
  if (!baseUrl) return null;

  const configuredTimeout = Number(process.env.PAYLOAD_TIMEOUT_MS);
  const timeoutMs =
    Number.isInteger(configuredTimeout) && configuredTimeout > 0
      ? configuredTimeout
      : DEFAULT_TIMEOUT_MS;

  return {
    baseUrl: normalizeBaseUrl(baseUrl),
    apiToken: process.env.PAYLOAD_API_TOKEN || undefined,
    timeoutMs,
  };
}

export function getRevalidateSecret(): string | null {
  return process.env.PAYLOAD_REVALIDATE_SECRET || null;
}

/**
 * Explicit, non-default opt-in for the visibly-labelled development
 * fallback content (see `src/integrations/payload/dev-fallback`). Refuses
 * to report enabled in production regardless of the environment variable,
 * mirroring the fail-closed pattern in `src/lib/auth/session.ts`.
 */
export function isDevContentFallbackEnabled(): boolean {
  if (process.env.NODE_ENV === "production") return false;
  return process.env.NABHOLD_CONTENT_DEV_FALLBACK === "true";
}
