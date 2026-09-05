import { expect, test } from "@playwright/test";

test("visitor reaches a portfolio company", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Explore the group" }).click();
  await page.getByRole("link", { name: /Zuribeans/ }).click();
  await expect(page.getByRole("heading", { name: "Zuribeans" })).toBeVisible();
});

test("portfolio company page exposes basic SEO metadata", async ({ page }) => {
  await page.goto("/portfolio/zuribeans");
  await expect(page).toHaveTitle(/Zuribeans/);
});

test("insights listing renders a graceful empty state without a CMS", async ({
  page,
}) => {
  await page.goto("/insights");
  await expect(
    page.getByRole("heading", { name: /Considered views/ }),
  ).toBeVisible();
});

test("sectors listing renders", async ({ page }) => {
  await page.goto("/sectors");
  await expect(
    page.getByRole("heading", { name: /Sectors where enterprise/ }),
  ).toBeVisible();
});

test("an unknown portfolio company returns 404", async ({ page }) => {
  const response = await page.goto("/portfolio/not-a-real-company");
  expect(response?.status()).toBe(404);
});
