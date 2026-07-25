"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminOrEditor } from "@/lib/auth";
import {
  createCampaignFromContent,
  createManualCampaign,
  sendCampaign,
  updateCampaign,
} from "@/lib/data/newsletter-campaigns";
import type { InstagramContentType } from "@/lib/instagram/types";
import { requiredString } from "@/lib/form-utils";

export async function generateCampaignAction(formData: FormData) {
  await requireAdminOrEditor();
  const contentType = requiredString(formData, "contentType") as InstagramContentType;
  const contentId = requiredString(formData, "contentId");
  const campaign = await createCampaignFromContent(contentType, contentId);
  revalidatePath("/admin/newsletter");
  redirect(`/admin/newsletter/${campaign.id}`);
}

export async function createManualCampaignAction(formData: FormData) {
  await requireAdminOrEditor();
  const subject = requiredString(formData, "subject");
  const introText = requiredString(formData, "introText");
  const campaign = await createManualCampaign(subject, introText);
  revalidatePath("/admin/newsletter");
  redirect(`/admin/newsletter/${campaign.id}`);
}

export async function updateCampaignAction(formData: FormData) {
  await requireAdminOrEditor();
  const id = requiredString(formData, "id");
  const subject = requiredString(formData, "subject");
  const introText = requiredString(formData, "introText");
  // Teaser (Bild/Titel/Link) bleibt unangetastet — wird beim Rendern aus
  // dem gespeicherten teaser-Feld der Kampagne wieder eingesetzt, siehe
  // lib/data/newsletter-campaigns.ts#renderCampaignHtml().
  await updateCampaign(id, { subject, introText });
  revalidatePath(`/admin/newsletter/${id}`);
}

export async function sendCampaignAction(formData: FormData) {
  await requireAdminOrEditor();
  const id = requiredString(formData, "id");
  await sendCampaign(id);
  revalidatePath("/admin/newsletter");
  revalidatePath(`/admin/newsletter/${id}`);
}
