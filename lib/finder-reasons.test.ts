import { describe, it, expect } from "vitest";
import { buildFinderReasons } from "./finder-reasons";
import type { FinderInput } from "./types";

const baseInput: FinderInput = {
  adults: 2,
  children: 3,
  area: "mikroabenteuer",
  spontaneous: true,
  maxBudget: 50,
  interestTags: [{ id: "1", name: "Outdoor", slug: "outdoor" }],
};

describe("buildFinderReasons", () => {
  it("includes family size only for the accommodation area", () => {
    expect(buildFinderReasons(baseInput, "unterkunft").join(" ")).toContain(
      "2 Erwachsene und 3 Kinder"
    );
    expect(buildFinderReasons(baseInput, "aktivitaet").join(" ")).not.toContain(
      "Erwachsene"
    );
  });

  it("mentions the budget, including the free case", () => {
    expect(buildFinderReasons(baseInput, "mikroabenteuer").join(" ")).toContain(
      "50 €"
    );
    expect(
      buildFinderReasons({ ...baseInput, maxBudget: 0 }, "mikroabenteuer").join(" ")
    ).toContain("Kostenlos");
  });

  it("mentions spontaneity only for micro-adventures", () => {
    expect(buildFinderReasons(baseInput, "mikroabenteuer")).toContain(
      "Spontan umsetzbar"
    );
    expect(buildFinderReasons(baseInput, "aktivitaet")).not.toContain(
      "Spontan umsetzbar"
    );
  });

  it("lists selected interests by name", () => {
    expect(buildFinderReasons(baseInput, "mikroabenteuer").join(" ")).toContain(
      "Outdoor"
    );
  });

  it("falls back to a generic reason when nothing was selected", () => {
    const empty: FinderInput = {
      adults: 0,
      children: 0,
      area: "unentschlossen",
      spontaneous: false,
      interestTags: [],
    };
    expect(buildFinderReasons(empty, "aktivitaet")).toEqual(["Empfohlen von FamVaya"]);
  });
});
