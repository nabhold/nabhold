import type { NextConfig } from "next";

/**
 * Payload-managed media (logos, corporate photography, hero images) is
 * served from the Payload origin itself. `remotePatterns` is derived from
 * `PAYLOAD_BASE_URL` rather than a wildcard, so Next's image optimizer
 * never proxies an arbitrary remote host (ADR-0002 §8 — no weakening of
 * remote image security). Absent `PAYLOAD_BASE_URL`, no remote patterns are
 * added and `next/image` simply has nothing to optimize yet.
 */
function payloadRemotePattern(): NonNullable<
  NextConfig["images"]
>["remotePatterns"] {
  const baseUrl = process.env.PAYLOAD_BASE_URL;
  if (!baseUrl) return [];

  try {
    const { protocol, hostname } = new URL(baseUrl);
    if (protocol !== "https:" && protocol !== "http:") return [];

    return [
      {
        protocol: protocol === "https:" ? "https" : "http",
        hostname,
        pathname: "/**",
      },
    ];
  } catch {
    return [];
  }
}

const config: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    remotePatterns: payloadRemotePattern(),
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default config;
