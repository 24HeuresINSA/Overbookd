import { afterEach, describe, expect, it, vi } from "vitest";
import { JSON } from "@overbookd/http";
import { apiFetch } from "./api-fetch";

const notifyFailure = vi.fn();

vi.mock("../../composable/useOidcUtils", () => ({
  useOidcUtils: () => ({
    getUserAuthorizationHeader: () => ({}),
    login: vi.fn(),
  }),
}));

describe("apiFetch error handling", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    notifyFailure.mockReset();
  });

  it("should use the configured message for non-JSON server errors", async () => {
    vi.stubGlobal("sendFailureNotification", notifyFailure);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response("<html>Bad gateway</html>", {
          status: 502,
          headers: { "Content-Type": "text/html" },
        }),
      ),
    );

    const result = await apiFetch(
      { url: new URL("https://example.test"), method: "GET" },
      { acceptedType: JSON, serverErrorMessage: "Server unavailable" },
    );

    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toBe("Server unavailable");
    expect(notifyFailure).toHaveBeenCalledWith("Server unavailable");
  });

  it("should use a JSON API message for client errors", async () => {
    vi.stubGlobal("sendFailureNotification", notifyFailure);
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          Response.json({ message: "Invalid request" }, { status: 400 }),
        ),
    );

    const result = await apiFetch(
      { url: new URL("https://example.test"), method: "GET" },
      { acceptedType: JSON, serverErrorMessage: "Server unavailable" },
    );

    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toBe("Invalid request");
    expect(notifyFailure).toHaveBeenCalledWith("Invalid request");
  });

  it("should fall back to the HTTP status text for malformed client error bodies", async () => {
    vi.stubGlobal("sendFailureNotification", notifyFailure);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response("<html>Bad request</html>", {
          status: 400,
          statusText: "Bad Request",
        }),
      ),
    );

    const result = await apiFetch(
      { url: new URL("https://example.test"), method: "GET" },
      { acceptedType: JSON, serverErrorMessage: "Server unavailable" },
    );

    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toBe("Bad Request");
    expect(notifyFailure).toHaveBeenCalledWith("Bad Request");
  });
});
