export const NAV_ITEMS = [
  { href: "/", label: "Startseite" },
  { href: "/familienunterkuenfte", label: "Familienunterkünfte" },
  { href: "/familienaktivitaeten", label: "Familienaktivitäten" },
  { href: "/mikro-familienabenteuer", label: "Mikro-Familienabenteuer" },
  { href: "/magazin", label: "Magazin" },
  { href: "/lass-dich-inspirieren", label: "Lass dich inspirieren" },
] as const;

// Schlankere Auswahl für die horizontale Desktop-Navigation im Header:
// "Startseite" entfällt (das Logo verlinkt bereits auf "/"), "Lass dich
// inspirieren" ist schon auf der Startseite verlinkt (Hero-Button) und bleibt
// im Hamburger-Menü erreichbar. Das Magazin steht als eigener Bereich in der
// Navigation, damit man immer sieht, in welchem Bereich man gerade ist.
export const DESKTOP_NAV_ITEMS = NAV_ITEMS.filter(
  (item) => !["/", "/lass-dich-inspirieren"].includes(item.href)
);
