import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/content", () => ({
  getContentGateway: vi.fn(async () => ({
    getHomePage: vi.fn(async () => ({
      eyebrow: "Test eyebrow",
      headline: "Test headline",
      introduction: "Test introduction",
      featuredPortfolioCompanies: [
        {
          slug: "acme",
          name: "Acme Holdings",
          summary: "An illustrative summary.",
        },
      ],
    })),
  })),
}));

const { default: HomePage } = await import("./page");

describe("HomePage", () => {
  it("renders the resolved headline and featured companies from the content gateway", async () => {
    const element = await HomePage();
    render(element);

    expect(
      screen.getByRole("heading", { level: 1, name: "Test headline" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Acme Holdings")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /View company/ }),
    ).toHaveAttribute("href", "/portfolio/acme");
  });
});
