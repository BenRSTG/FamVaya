import { describe, it, expect } from "vitest";
import { getFamilyRatingLabel } from "./family-rating";

describe("getFamilyRatingLabel", () => {
  it("classifies boundary values per Spec §21", () => {
    expect(getFamilyRatingLabel(100).tier).toBe("excellent");
    expect(getFamilyRatingLabel(90).tier).toBe("excellent");
    expect(getFamilyRatingLabel(89).tier).toBe("very_good");
    expect(getFamilyRatingLabel(75).tier).toBe("very_good");
    expect(getFamilyRatingLabel(74).tier).toBe("good");
    expect(getFamilyRatingLabel(60).tier).toBe("good");
    expect(getFamilyRatingLabel(59).tier).toBe("limited");
    expect(getFamilyRatingLabel(40).tier).toBe("limited");
    expect(getFamilyRatingLabel(39).tier).toBe("not_suitable");
    expect(getFamilyRatingLabel(0).tier).toBe("not_suitable");
  });

  it("returns a human-readable German label", () => {
    expect(getFamilyRatingLabel(95).label).toBe("Hervorragend für große Familien");
  });
});
