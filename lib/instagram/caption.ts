import type { InstagramContentType } from "@/lib/instagram/types";

export interface PostCaptionInput {
  title: string;
  description: string | null;
  location: string | null;
  priceText: string | null;
  contentType: InstagramContentType;
}

const BASE_HASHTAGS = ["#FamVaya", "#Familienurlaub", "#GroßeFamilie"];

const TYPE_HASHTAGS: Record<InstagramContentType, string> = {
  accommodation: "#Familienunterkunft",
  activity: "#Familienaktivität",
  micro_adventure: "#Mikroabenteuer",
  article: "#FamVayaMagazin",
};

function regionHashtag(location: string | null): string | null {
  if (!location) return null;
  const cleaned = location.replace(/[^a-zA-ZäöüÄÖÜß]/g, "");
  return cleaned ? `#${cleaned}` : null;
}

export function generateCaption(input: PostCaptionInput): string {
  const lines: string[] = [`${input.title}`];

  if (input.description) {
    lines.push("", input.description);
  }

  const factLines: string[] = [];
  if (input.location) factLines.push(`📍 ${input.location}`);
  if (input.priceText) factLines.push(`💶 ${input.priceText}`);
  if (factLines.length > 0) lines.push("", factLines.join("\n"));

  lines.push("", "Mehr auf famvaya.com — Link in Bio");

  const hashtags = [...BASE_HASHTAGS, TYPE_HASHTAGS[input.contentType], regionHashtag(input.location)].filter(
    (tag): tag is string => Boolean(tag)
  );
  lines.push("", hashtags.join(" "));

  return lines.join("\n");
}
