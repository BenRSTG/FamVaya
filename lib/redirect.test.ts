import { describe, it, expect } from "vitest";
import { resolveRedirectTarget } from "./redirect";

describe("resolveRedirectTarget", () => {
  it("prefers the affiliate URL over the external URL", () => {
    const decision = resolveRedirectTarget({
      slug: "test",
      affiliate_url: "https://affiliate.example.com",
      external_url: "https://external.example.com",
    });
    expect(decision).toEqual({ targetUrl: "https://affiliate.example.com", shouldLog: true });
  });

  it("falls back to the external URL when no affiliate URL is set", () => {
    const decision = resolveRedirectTarget({
      slug: "test",
      affiliate_url: null,
      external_url: "https://external.example.com",
    });
    expect(decision).toEqual({ targetUrl: "https://external.example.com", shouldLog: true });
  });

  it("does not log a click when no external URL exists", () => {
    const decision = resolveRedirectTarget({
      slug: "test",
      affiliate_url: null,
      external_url: null,
    });
    expect(decision).toEqual({ targetUrl: null, shouldLog: false });
  });

  it("does not log a click when the content row was not found", () => {
    expect(resolveRedirectTarget(null)).toEqual({ targetUrl: null, shouldLog: false });
  });
});
