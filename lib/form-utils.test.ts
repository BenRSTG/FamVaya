import { describe, it, expect } from "vitest";
import {
  stringOrNull,
  requiredString,
  numberOrNull,
  checkboxOn,
  dateOrNull,
  stringList,
  commaSeparatedList,
} from "./form-utils";

function formData(entries: Record<string, string | string[]>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(entries)) {
    if (Array.isArray(value)) {
      value.forEach((v) => fd.append(key, v));
    } else {
      fd.set(key, value);
    }
  }
  return fd;
}

describe("stringOrNull", () => {
  it("trims and returns the value when present", () => {
    expect(stringOrNull(formData({ title: "  Ferienhaus  " }), "title")).toBe("Ferienhaus");
  });

  it("returns null for missing or whitespace-only fields", () => {
    expect(stringOrNull(formData({}), "title")).toBeNull();
    expect(stringOrNull(formData({ title: "   " }), "title")).toBeNull();
  });
});

describe("requiredString", () => {
  it("returns a trimmed string even when missing (empty string)", () => {
    expect(requiredString(formData({ title: " Hallo " }), "title")).toBe("Hallo");
    expect(requiredString(formData({}), "title")).toBe("");
  });
});

describe("numberOrNull", () => {
  it("parses valid numbers", () => {
    expect(numberOrNull(formData({ price: "129.5" }), "price")).toBe(129.5);
  });

  it("returns null for empty or non-numeric input", () => {
    expect(numberOrNull(formData({}), "price")).toBeNull();
    expect(numberOrNull(formData({ price: "abc" }), "price")).toBeNull();
  });
});

describe("checkboxOn", () => {
  it("is true only for the native checkbox 'on' value", () => {
    expect(checkboxOn(formData({ featured: "on" }), "featured")).toBe(true);
    expect(checkboxOn(formData({}), "featured")).toBe(false);
    expect(checkboxOn(formData({ featured: "true" }), "featured")).toBe(false);
  });
});

describe("dateOrNull", () => {
  it("converts a date input value to an ISO string", () => {
    expect(dateOrNull(formData({ expires_at: "2026-01-01" }), "expires_at")).toBe(
      new Date("2026-01-01").toISOString()
    );
  });

  it("returns null when empty", () => {
    expect(dateOrNull(formData({}), "expires_at")).toBeNull();
  });
});

describe("stringList", () => {
  it("collects all values for repeated checkbox fields", () => {
    expect(stringList(formData({ tag_ids: ["a", "b"] }), "tag_ids")).toEqual(["a", "b"]);
  });

  it("returns an empty array when nothing is checked", () => {
    expect(stringList(formData({}), "tag_ids")).toEqual([]);
  });
});

describe("commaSeparatedList", () => {
  it("splits, trims and drops empty entries", () => {
    expect(commaSeparatedList(formData({ materials: "Seil,  Taschenlampe ,,Rucksack" }), "materials")).toEqual([
      "Seil",
      "Taschenlampe",
      "Rucksack",
    ]);
  });

  it("returns an empty array when the field is missing", () => {
    expect(commaSeparatedList(formData({}), "materials")).toEqual([]);
  });
});
