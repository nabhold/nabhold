import { afterEach, describe, expect, it, vi } from "vitest";

import { getSession } from "./session";

describe("preview session", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("is disabled by default", async () => {
    vi.stubEnv("NABHOLD_DASHBOARD_PREVIEW", "false");

    await expect(getSession()).resolves.toBeNull();
  });

  it("is available outside production when explicitly enabled", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("NABHOLD_DASHBOARD_PREVIEW", "true");

    await expect(getSession()).resolves.toMatchObject({
      subject: "preview",
      roles: ["group-executive"],
    });
  });

  it("fails closed when preview is enabled in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NABHOLD_DASHBOARD_PREVIEW", "true");

    await expect(getSession()).rejects.toThrow(
      "NABHOLD_DASHBOARD_PREVIEW must never be enabled in production.",
    );
  });
});
