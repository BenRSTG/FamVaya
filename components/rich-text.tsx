import { parseRichText } from "@/lib/rich-text";

// Rendert Fließtext aus der Datenbank mit echten Überschriften/Listen
// (siehe lib/rich-text.ts). Text ohne Markierungen erscheint wie zuvor als
// Absätze.
export function RichText({ text, className }: { text: string; className?: string }) {
  const blocks = parseRichText(text);

  return (
    <div className={className}>
      {blocks.map((block, index) => {
        switch (block.type) {
          case "h2":
            return (
              <h2 key={index} className="mb-3 mt-8 text-2xl font-semibold text-foreground">
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={index} className="mb-2 mt-6 text-lg font-semibold text-foreground">
                {block.text}
              </h3>
            );
          case "list":
            return (
              <ul key={index} className="mb-4 list-disc space-y-1 pl-6">
                {block.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            );
          default:
            return (
              <p key={index} className="mb-4 whitespace-pre-line">
                {block.text}
              </p>
            );
        }
      })}
    </div>
  );
}
