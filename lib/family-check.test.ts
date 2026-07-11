import { describe, it, expect } from "vitest";
import { getChildSuitability } from "./family-check";

describe("getChildSuitability", () => {
  it("marks nothing suitable below 3 children capacity", () => {
    const result = getChildSuitability(2);
    expect(result.every((r) => !r.suitable)).toBe(true);
  });

  it("marks only the 3-children entry suitable at capacity 3", () => {
    const result = getChildSuitability(3);
    expect(result.map((r) => r.suitable)).toEqual([true, false, false]);
  });

  it("marks all entries suitable at capacity 5 or more", () => {
    const result = getChildSuitability(6);
    expect(result.every((r) => r.suitable)).toBe(true);
  });

  it("treats null as zero capacity", () => {
    const result = getChildSuitability(null);
    expect(result.every((r) => !r.suitable)).toBe(true);
  });
});
