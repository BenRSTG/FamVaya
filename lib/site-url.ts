// Geteilter Fallback für die Basis-URL (SEO: metadataBase, Sitemap, JSON-LD,
// Breadcrumbs) — gleiches Muster wie bisher einzeln in app/auth/actions.ts
// und app/merkliste/page.tsx dupliziert.
export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
