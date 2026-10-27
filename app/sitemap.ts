import type { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSiteUrl } from "@/lib/site-url";

// Ohne dieses Intervall wird die Sitemap nur beim Deployen gebaut: neu
// veröffentlichte (oder ausgeblendete) Inhalte tauchten erst nach dem nächsten
// Deployment auf bzw. verschwänden erst dann.
export const revalidate = 3600;

const STATIC_ROUTES = [
  "",
  "/familienunterkuenfte",
  "/familienaktivitaeten",
  "/mikro-familienabenteuer",
  "/magazin",
  "/lass-dich-inspirieren",
  "/suche",
  // /impressum und /datenschutz sind bewusst nicht gelistet: beide tragen
  // robots: { index: false } — eine Sitemap-Aufnahme wäre widersprüchlich.
];

async function getPublishedSlugs(table: string): Promise<{ slug: string; updated_at: string }[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from(table)
    .select("slug, updated_at")
    .eq("status", "published");
  return data ?? [];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  const [accommodations, activities, microAdventures, articles] = await Promise.all([
    getPublishedSlugs("accommodations"),
    getPublishedSlugs("activities"),
    getPublishedSlugs("micro_adventures"),
    getPublishedSlugs("articles"),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${siteUrl}${path}`,
  }));

  const contentEntries: MetadataRoute.Sitemap = [
    ...accommodations.map((row) => ({
      url: `${siteUrl}/familienunterkuenfte/${row.slug}`,
      lastModified: row.updated_at,
    })),
    ...activities.map((row) => ({
      url: `${siteUrl}/familienaktivitaeten/${row.slug}`,
      lastModified: row.updated_at,
    })),
    ...microAdventures.map((row) => ({
      url: `${siteUrl}/mikro-familienabenteuer/${row.slug}`,
      lastModified: row.updated_at,
    })),
    ...articles.map((row) => ({
      url: `${siteUrl}/magazin/${row.slug}`,
      lastModified: row.updated_at,
    })),
  ];

  return [...staticEntries, ...contentEntries];
}
