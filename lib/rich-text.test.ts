import { describe, it, expect } from "vitest";
import { parseRichText } from "./rich-text";

describe("parseRichText", () => {
  it("erkennt Überschriften, Listen und Absätze", () => {
    const blocks = parseRichText(
      "Einleitung.\n\n## Erster Abschnitt\n\nText mit\nZeilenumbruch.\n\n### Unterpunkt\n\n- Eins\n- Zwei"
    );
    expect(blocks).toEqual([
      { type: "p", text: "Einleitung." },
      { type: "h2", text: "Erster Abschnitt" },
      { type: "p", text: "Text mit\nZeilenumbruch." },
      { type: "h3", text: "Unterpunkt" },
      { type: "list", items: ["Eins", "Zwei"] },
    ]);
  });

  it("erkennt Überschriften, die direkt über ihrem Absatz oder ihrer Liste stehen", () => {
    expect(parseRichText("### Frage\nAntwort Zeile 1\nZeile 2\n\n### Ideen\n- a\n- b")).toEqual([
      { type: "h3", text: "Frage" },
      { type: "p", text: "Antwort Zeile 1\nZeile 2" },
      { type: "h3", text: "Ideen" },
      { type: "list", items: ["a", "b"] },
    ]);
  });

  it("lässt Text ohne Markierung unverändert als Absätze (Abwärtskompatibilität)", () => {
    expect(parseRichText("Alt A.\n\nAlt B.")).toEqual([
      { type: "p", text: "Alt A." },
      { type: "p", text: "Alt B." },
    ]);
  });

  it("behandelt gemischte Blöcke mit nur teilweise Spiegelstrichen als Absatz", () => {
    expect(parseRichText("- a\nnoch Text")).toEqual([{ type: "p", text: "- a\nnoch Text" }]);
  });

  it("gibt bei leerem Text eine leere Liste zurück", () => {
    expect(parseRichText("  \n\n ")).toEqual([]);
  });
});
