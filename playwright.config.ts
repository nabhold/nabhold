import { defineConfig, devices } from "@playwright/test";

const chromium = devices["Desktop Chrome"];

export default defineConfig({
  testDir: "./tests/e2e",
  use: {
    baseURL: "http://127.0.0.1:3000",
  },
  webServer: {
    command: "pnpm dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    env: {
      // No Payload instance is available in CI/local e2e runs. The estate's
      // visibly-labelled, non-authoritative development fallback (ADR-0002)
      // keeps the portfolio vertical slice testable without depending on a
      // live Payload deployment.
      NABHOLD_CONTENT_DEV_FALLBACK: "true",
    },
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...chromium,
        launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
          ? {
              executablePath:
                process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
            }
          : undefined,
      },
    },
  ],
});
