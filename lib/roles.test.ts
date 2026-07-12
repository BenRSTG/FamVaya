import { describe, it, expect } from "vitest";
import { canAccessAdmin, isAdmin } from "./roles";

describe("canAccessAdmin", () => {
  it("allows admin and editor roles", () => {
    expect(canAccessAdmin("admin")).toBe(true);
    expect(canAccessAdmin("editor")).toBe(true);
  });

  it("rejects user, provider and missing roles", () => {
    expect(canAccessAdmin("user")).toBe(false);
    expect(canAccessAdmin("provider")).toBe(false);
    expect(canAccessAdmin(null)).toBe(false);
    expect(canAccessAdmin(undefined)).toBe(false);
  });
});

describe("isAdmin", () => {
  it("allows only the admin role", () => {
    expect(isAdmin("admin")).toBe(true);
    expect(isAdmin("editor")).toBe(false);
    expect(isAdmin("user")).toBe(false);
    expect(isAdmin(null)).toBe(false);
  });
});
