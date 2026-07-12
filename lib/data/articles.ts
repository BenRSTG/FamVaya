import { createAdminClient } from "@/lib/supabase/admin";
import type { Article, ContentStatus } from "@/lib/types";
import type { AdminListRow } from "@/components/admin/content-table";

const DETAIL_SELECT = `
  id, title, slug, excerpt, content, author_id, category_id, cover_media_id,
  status, published_at, updated_at,
  category:categories(id, name, slug),
  cover_media:media(id, storage_path, alt_text),
  author:users(display_name)
`;

const LIST_SELECT = `
  id, title, slug, excerpt, author_id, category_id, cover_media_id,
  status, published_at, updated_at,
  category:categories(id, name, slug),
  cover_media:media(id, storage_path, alt_text),
  author:users(display_name)
`;

function mapArticleRow(row: Record<string, unknown>): Article {
  const author = row.author as { display_name: string | null } | null;
  return {
    ...(row as unknown as Article),
    author_name: author?.display_name ?? null,
  };
}

export interface ArticleInput {
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  author_id: string | null;
  category_id: string | null;
  cover_media_id: string | null;
  status: ContentStatus;
  published_at: string | null;
}

export async function getAllArticlesForAdmin(): Promise<AdminListRow[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("articles")
    .select("id, title, status, updated_at")
    .order("updated_at", { ascending: false });
  return data ?? [];
}

export async function getArticleByIdForAdmin(id: string): Promise<Article | null> {
  const supabase = createAdminClient();
  const { data } = await supabase.from("articles").select(DETAIL_SELECT).eq("id", id).maybeSingle();
  return data ? mapArticleRow(data) : null;
}

// Ab hier: öffentliche Lesefunktionen (Phase 6). Gleiches includeUnpublished-
// Muster wie getAccommodationBySlug/getActivityBySlug/getMicroAdventureBySlug.

export async function getPublishedArticles(
  filters: { categorySlug?: string } = {}
): Promise<Article[]> {
  const supabase = createAdminClient();
  let query = supabase.from("articles").select(LIST_SELECT).eq("status", "published");

  if (filters.categorySlug) {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("content_type", "article")
      .eq("slug", filters.categorySlug)
      .maybeSingle();
    query = query.eq("category_id", category?.id ?? "00000000-0000-0000-0000-000000000000");
  }

  const { data } = await query.order("published_at", { ascending: false });
  return (data ?? []).map(mapArticleRow);
}

export async function getFeaturedArticles(limit: number): Promise<Article[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("articles")
    .select(LIST_SELECT)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);
  return (data ?? []).map(mapArticleRow);
}

export async function getArticleBySlug(
  slug: string,
  options: { includeUnpublished?: boolean } = {}
): Promise<Article | null> {
  const supabase = createAdminClient();
  let query = supabase.from("articles").select(DETAIL_SELECT).eq("slug", slug);
  if (!options.includeUnpublished) {
    query = query.eq("status", "published");
  }
  const { data } = await query.maybeSingle();
  return data ? mapArticleRow(data) : null;
}

export async function getRelatedArticles(article: Article, limit: number): Promise<Article[]> {
  if (!article.category_id) return [];
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("articles")
    .select(LIST_SELECT)
    .eq("status", "published")
    .eq("category_id", article.category_id)
    .neq("id", article.id)
    .order("published_at", { ascending: false })
    .limit(limit);
  return (data ?? []).map(mapArticleRow);
}

export async function createArticleRow(input: ArticleInput): Promise<string> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("articles").insert(input).select("id").single();
  if (error) throw error;
  return data.id as string;
}

export async function updateArticleRow(id: string, input: ArticleInput): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("articles").update(input).eq("id", id);
  if (error) throw error;
}

export async function deleteArticleRow(id: string): Promise<void> {
  const supabase = createAdminClient();
  await supabase.from("articles").delete().eq("id", id);
}

export async function duplicateArticleRow(id: string): Promise<string> {
  const original = await getArticleByIdForAdmin(id);
  if (!original) throw new Error("Artikel nicht gefunden");

  const newSlug = await findAvailableArticleSlug(original.slug);
  return createArticleRow({
    title: original.title,
    slug: newSlug,
    excerpt: original.excerpt,
    content: original.content,
    author_id: original.author_id,
    category_id: original.category_id,
    cover_media_id: null,
    status: "draft",
    published_at: null,
  });
}

async function findAvailableArticleSlug(baseSlug: string): Promise<string> {
  const supabase = createAdminClient();
  let candidate = `${baseSlug}-kopie`;
  let suffix = 2;
  while (true) {
    const { data } = await supabase.from("articles").select("id").eq("slug", candidate).maybeSingle();
    if (!data) return candidate;
    candidate = `${baseSlug}-kopie-${suffix}`;
    suffix += 1;
  }
}
