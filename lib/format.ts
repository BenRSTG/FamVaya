export function formatPrice(amount: number, currency: string = "EUR"): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency,
  }).format(amount);
}

// FamVaya ist ein Empfehlungs-, kein Buchungsportal — ein centgenauer Preis
// suggeriert eine Verbindlichkeit, die es nicht gibt (siehe DECISIONS.md,
// Phase 10). Illustrative Beispielpreise werden daher als gerundeter
// Bereich statt als Einzelwert dargestellt. Der gespeicherte Wert bleibt
// exakt — nur die Darstellung rundet.
export function formatPriceEstimate(amount: number, currency: string = "EUR"): string {
  const step = amount < 150 ? 10 : amount < 2000 ? 50 : 100;
  const center = Math.round(amount / step) * step;
  const low = center - step;
  const high = center + step;

  const numberFormat = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 0 });
  const currencyFormat = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });
  const currencySymbol =
    currencyFormat.formatToParts(high).find((part) => part.type === "currency")?.value ?? currency;

  return `ca. ${numberFormat.format(low)}–${numberFormat.format(high)} ${currencySymbol}`;
}
