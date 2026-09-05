import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({
  revalidateTag: vi.fn(),
}));

const { revalidateTag } = await import("next/cache");
const { POST } = await import("./route");

function request(body: unknown, headers: Record<string, string> = {}) {
  return new Request("http://localhost:3000/api/revalidate", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

describe("POST /api/revalidate", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("returns 503 when no secret is configured", async () => {
    vi.stubEnv("PAYLOAD_REVALIDATE_SECRET", "");

    const response = await POST(
      request({ collection: "insights", slug: "x" }),
    );

    expect(response.status).toBe(503);
  });

  it("rejects a request without a matching bearer token", async () => {
    vi.stubEnv("PAYLOAD_REVALIDATE_SECRET", "correct-secret");

    const response = await POST(
      request(
        { collection: "insights", slug: "x" },
        { authorization: "Bearer wrong-secret" },
      ),
    );

    expect(response.status).toBe(401);
  });

  it("rejects a malformed request body", async () => {
    vi.stubEnv("PAYLOAD_REVALIDATE_SECRET", "correct-secret");

    const response = await POST(
      request(
        { collection: "not-a-real-collection" },
        { authorization: "Bearer correct-secret" },
      ),
    );

    expect(response.status).toBe(400);
  });

  it("revalidates only the narrow tags for the named document", async () => {
    vi.stubEnv("PAYLOAD_REVALIDATE_SECRET", "correct-secret");

    const response = await POST(
      request(
        { collection: "portfolio-companies", slug: "zuribeans" },
        { authorization: "Bearer correct-secret" },
      ),
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.tags).toEqual([
      "content:portfolio",
      "content:portfolio:zuribeans",
      "content:homepage",
    ]);
    expect(revalidateTag).toHaveBeenCalledWith("content:portfolio");
    expect(revalidateTag).toHaveBeenCalledWith("content:portfolio:zuribeans");
    expect(revalidateTag).toHaveBeenCalledWith("content:homepage");
  });

  it("revalidates a global content key", async () => {
    vi.stubEnv("PAYLOAD_REVALIDATE_SECRET", "correct-secret");

    const response = await POST(
      request(
        { collection: "pages", contentKey: "home" },
        { authorization: "Bearer correct-secret" },
      ),
    );

    const body = await response.json();
    expect(body.tags).toEqual(["content:homepage"]);
  });
});
