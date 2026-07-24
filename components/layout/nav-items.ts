export const NAV_ITEMS = [
  { href: "/", label: "Startseite" },
  { href: "/familienunterkuenfte", label: "Familienunterkünfte" },
  { href: "/familienaktivitaeten", label: "Familienaktivitäten" },
  { href: "/mikro-familienabenteuer", label: "Mikro-Familienabenteuer" },
  { href: "/magazin", label: "Magazin" },
  { href: "/lass-dich-inspirieren", label: "Lass dich inspirieren" },
] as const;

// Schlankere Auswahl für die horizontale Desktop-Navigation im Header:
// "Startseite" entfällt (das Logo verlinkt bereits auf "/"), "Magazin" und
// "Lass dich inspirieren" sind schon auf der Startseite verlinkt (Hero-Button
// bzw. "Aus dem Magazin"-Sektion) und bleiben im Hamburger-Menü erreichbar.
export const DESKTOP_NAV_ITEMS = NAV_ITEMS.filter(
  (item) => !["/", "/magazin", "/lass-dich-inspirieren"].includes(item.href)
);
