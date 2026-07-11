import { describe, it, expect } from "vitest";
import { formatPrice } from "./format";

// Intl.NumberFormat inserts a non-breaking space (U+00A0) before the
// currency symbol in de-DE — use the escape explicitly so the assertion
// doesn't depend on an invisible character in the source file.
const NBSP = " ";

describe("formatPrice", () => {
  it("formats EUR amounts in de-DE style", () => {
    expect(formatPrice(1323)).toBe(`1.323,00${NBSP}€`);
  });

  it("formats decimals correctly", () => {
    expect(formatPrice(189.5)).toBe(`189,50${NBSP}€`);
  });

  it("supports other currencies", () => {
    expect(formatPrice(100, "USD")).toBe(`100,00${NBSP}$`);
  });
});
