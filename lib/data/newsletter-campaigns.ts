import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAccommodationByIdForAdmin } from "@/lib/data/accommodations";
import { getActivityByIdForAdmin } from "@/lib/data/activities";
import { getMicroAdventureByIdForAdmin } from "@/lib/data/micro-adventures";
import { getArticleByIdForAdmin } from "@/lib/data/articles";
import {
  accommodationToPostContent,
  activityToPostContent,
  articleToPostContent,
  microAdventureToPostContent,
} from "@/lib/instagram/content-mapping";
// Gleiche 4-Werte-Aufzählung wie bei Instagram-Posts (accommodation/
// activity/micro_adventure/article) — hier wiederverwendet statt erneut
// definiert.
import type { InstagramContentType } from "@/lib/instagram/types";
import { contentToEmailInput } from "@/lib/newsletter/content-to-email";
import { renderCampaignEmail, type CampaignTeaser } from "@/lib/newsletter/template";
import { sendCampaignEmails } from "@/lib/newsletter/resend";
import { getSiteUrl } from "@/lib/site-url";

export interface NewsletterCampaign {
  id: string;
  subject: string;
  content_type: InstagramContentType | null;
  content_id: string | null;
  intro_text: string;
  teaser: CampaignTeaser | null;
  status: "draft" | "sent" | "failed";
  recipient_count: number | null;
  error_message: string | null;
  sent_at: string | null;
  created_at: string;
}

const SELECT = `
  id, subject, content_type, content_id, intro_text, teaser, status,
  recipient_count, error_message, sent_at, created_at
`;

const DETAIL_PATH_BY_CONTENT_TYPE: Record<InstagramContentType, string> = {
  accommodation: "/familienunterkuenfte",
  activity: "/familienaktivitaeten",
  micro_adventure: "/mikro-familienabenteuer",
  article: "/magazin",
};

// Platzhalter statt eines fertigen Abmelde-Links: erst beim Versand wird
// pro Empfänger:in der echte Token eingesetzt (siehe sendCampaign()).
const UNSUBSCRIBE_TOKEN_PLACEHOLDER = "{{UNSUBSCRIBE_TOKEN}}";

function unsubscribeUrlTemplate(): string {
  return `${getSiteUrl()}/newsletter/abmelden/${UNSUBSCRIBE_TOKEN_PLACEHOLDER}`;
}

// Rendert das vollständige E-Mail-HTML für Vorschau/Versand — wird nicht
// gespeichert, sondern immer frisch aus den strukturierten Feldern
// erzeugt (siehe Kommentar in der Migration).
export function renderCampaignHtml(campaign: Pick<NewsletterCampaign, "subject" | "intro_text" | "teaser">): string {
  return renderCampaignEmail({
    subject: campaign.subject,
    introText: campaign.intro_text,
    teaser: campaign.teaser ?? undefined,
    unsubscribeUrl: unsubscribeUrlTemplate(),
  });
}

async function loadContentAndBuildEmail(contentType: InstagramContentType, contentId: string) {
  const siteUrl = getSiteUrl();
  const detailPath = DETAIL_PATH_BY_CONTENT_TYPE[contentType];

  switch (contentType) {
    case "accommodation": {
      const content = await getAccommodationByIdForAdmin(contentId);
      if (!content) throw new Error("Unterkunft nicht gefunden.");
      return contentToEmailInput(accommodationToPostContent(content), `${siteUrl}${detailPath}/${content.slug}`);
    }
    case "activity": {
      const content = await getActivityByIdForAdmin(contentId);
      if (!content) throw new Error("Aktivität nicht gefunden.");
      return contentToEmailInput(activityToPostContent(content), `${siteUrl}${detailPath}/${content.slug}`);
    }
    case "micro_adventure": {
      const content = await getMicroAdventureByIdForAdmin(contentId);
      if (!content) throw new Error("Mikro-Abenteuer nicht gefunden.");
      return contentToEmailInput(microAdventureToPostContent(content), `${siteUrl}${detailPath}/${content.slug}`);
    }
    case "article": {
      const content = await getArticleByIdForAdmin(contentId);
      if (!content) throw new Error("Magazinartikel nicht gefunden.");
      return contentToEmailInput(articleToPostContent(content), `${siteUrl}${detailPath}/${content.slug}`);
    }
  }
}

export async function createCampaignFromContent(
  contentType: InstagramContentType,
  contentId: string
): Promise<NewsletterCampaign> {
  const supabase = createAdminClient();
  const email = await loadContentAndBuildEmail(contentType, contentId);

  const { data, error } = await supabase
    .from("newsletter_campaigns")
    .insert({
      subject: email.subject,
      content_type: contentType,
      content_id: contentId,
      intro_text: email.introText,
      teaser: email.teaser,
      status: "draft",
    })
    .select(SELECT)
    .single();
  if (error) throw error;
  return data as unknown as NewsletterCampaign;
}

export async function createManualCampaign(subject: string, introText: string): Promise<NewsletterCampaign> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("newsletter_campaigns")
    .insert({ subject, intro_text: introText, status: "draft" })
    .select(SELECT)
    .single();
  if (error) throw error;
  return data as unknown as NewsletterCampaign;
}

export async function getCampaignsForAdmin(): Promise<NewsletterCampaign[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("newsletter_campaigns")
    .select(SELECT)
    .order("created_at", { ascending: false });
  return (data ?? []) as unknown as NewsletterCampaign[];
}

export async function getCampaignForContent(
  contentType: InstagramContentType,
  contentId: string
): Promise<NewsletterCampaign | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("newsletter_campaigns")
    .select(SELECT)
    .eq("content_type", contentType)
    .eq("content_id", contentId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data as unknown as NewsletterCampaign | null;
}

export async function getCampaignById(id: string): Promise<NewsletterCampaign | null> {
  const supabase = createAdminClient();
  const { data } = await supabase.from("newsletter_campaigns").select(SELECT).eq("id", id).maybeSingle();
  return data as unknown as NewsletterCampaign | null;
}

export async function updateCampaign(id: string, params: { subject: string; introText: string }): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("newsletter_campaigns")
    .update({ subject: params.subject, intro_text: params.introText })
    .eq("id", id);
  if (error) throw error;
}

export async function sendCampaign(id: string): Promise<void> {
  const supabase = createAdminClient();
  const campaign = await getCampaignById(id);
  if (!campaign) throw new Error("Kampagne nicht gefunden.");

  const html = renderCampaignHtml(campaign);

  const { data: subscribers } = await supabase
    .from("newsletter_subscribers")
    .select("email, unsubscribe_token")
    .eq("confirmed", true);
  const recipients = (subscribers ?? []) as { email: string; unsubscribe_token: string }[];

  try {
    await sendCampaignEmails({
      subject: campaign.subject,
      recipients: recipients.map((r) => ({
        email: r.email,
        html: html.replace(UNSUBSCRIBE_TOKEN_PLACEHOLDER, r.unsubscribe_token),
      })),
    });
    await supabase
      .from("newsletter_campaigns")
      .update({ status: "sent", recipient_count: recipients.length, sent_at: new Date().toISOString() })
      .eq("id", id);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unbekannter Fehler beim Versenden.";
    await supabase.from("newsletter_campaigns").update({ status: "failed", error_message: message }).eq("id", id);
    throw err;
  }
}

export async function unsubscribeByToken(token: string): Promise<boolean> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .update({ confirmed: false })
    .eq("unsubscribe_token", token)
    .select("id")
    .maybeSingle();
  if (error) throw error;
  return Boolean(data);
}
