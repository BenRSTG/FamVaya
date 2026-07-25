import type { PostContentInput } from "@/lib/instagram/content-mapping";
import type { CampaignTeaser } from "@/lib/newsletter/template";

export interface CampaignEmailInput {
  subject: string;
  introText: string;
  teaser: CampaignTeaser;
}

// Baut auf den bereits vorhandenen {image, caption}-Daten aus
// lib/instagram/content-mapping.ts auf, statt Content-Felder erneut
// abzufragen/zu mappen (siehe DECISIONS.md Phase 14).
export function contentToEmailInput(postContent: PostContentInput, detailUrl: string): CampaignEmailInput {
  const { image, caption } = postContent;
  const factLine = [caption.location, caption.priceText].filter(Boolean).join(" · ") || null;

  return {
    subject: `Neu bei FamVaya: ${caption.title}`,
    introText: "Wir haben ein neues Angebot für euch entdeckt:",
    teaser: {
      imageUrl: image.imageUrl,
      title: caption.title,
      description: caption.description,
      factLine,
      url: detailUrl,
    },
  };
}
