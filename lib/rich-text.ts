// Minimaler Text-Parser für Fließtexte aus der Datenbank (Magazinartikel,
// Mikro-Abenteuer-Beschreibung). Bewusst kein Markdown: nur drei Bausteine,
// damit Redakteur:innen echte Zwischenüberschriften (wichtig für SEO und
// Lesbarkeit) setzen können, ohne eine Markdown-Bibliothek einzuführen.
//
//   "## Überschrift"   -> h2
//   "### Überschrift"  -> h3
//   "- Punkt" (alle Zeilen eines Blocks) -> Liste
//   alles andere       -> Absatz (einzelne Zeilenumbrüche bleiben erhalten)
//
// Absätze werden durch Leerzeilen getrennt. Eine Überschrift darf auch direkt
// über ihrem Absatz stehen (ohne Leerzeile dazwischen).

export type RichTextBlock =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "list"; items: string[] }
  | { type: "p"; text: string };

export function parseRichText(input: string): RichTextBlock[] {
  const blocks: RichTextBlock[] = [];
  let buffer: string[] = [];

  function flush() {
    if (buffer.length === 0) return;
    if (buffer.every((line) => line.startsWith("- "))) {
      blocks.push({ type: "list", items: buffer.map((line) => line.slice(2).trim()) });
    } else {
      blocks.push({ type: "p", text: buffer.join("\n") });
    }
    buffer = [];
  }

  for (const rawLine of input.replace(/\r\n/g, "\n").split("\n")) {
    const line = rawLine.trim();
    if (line === "") {
      flush();
    } else if (line.startsWith("### ")) {
      flush();
      blocks.push({ type: "h3", text: line.slice(4).trim() });
    } else if (line.startsWith("## ")) {
      flush();
      blocks.push({ type: "h2", text: line.slice(3).trim() });
    } else {
      buffer.push(line);
    }
  }
  flush();
  return blocks;
}
