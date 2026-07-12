import { createAdminClient } from "@/lib/supabase/admin";
import type { Article, ContentStatus } from "@/lib/types";
import type { AdminListRow } from "@/components/admin/content-table";

const DETAIL_SELECT = `
  id, title, slug, excerpt, content, author_id, category_id, cover_media_id,
  status, published_at, updated_at,
  category:categories(id, name, slug),
  cover_media:media(id, storage_path, alt_text)
`;

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
  return (data as unknown as Article) ?? null;
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
