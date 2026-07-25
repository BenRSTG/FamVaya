// E-Mail-HTML als reiner String mit Inline-CSS (E-Mail-Clients ignorieren
// externe/`<style>`-Stylesheets weitgehend) — kein React-Email-Paket, siehe
// DECISIONS.md Phase 14. Farben aus app/globals.css dupliziert, gleiches
// Muster wie lib/instagram/template.tsx.
const BRAND_TEAL = "#2FA4A3";
const BRAND_GREY = "#7A7A7A";
const BRAND_CREAM = "#FBF8F3";
const BRAND_PETROL_DARK = "#173B3A";
const BRAND_BORDER = "#E4DED2";

export interface CampaignTeaser {
  imageUrl: string;
  title: string;
  description: string | null;
  factLine: string | null;
  url: string;
}

export interface RenderCampaignEmailInput {
  subject: string;
  /** Klartext, Absätze durch Leerzeile getrennt — wird escaped, kein HTML-Input. */
  introText: string;
  teaser?: CampaignTeaser;
  unsubscribeUrl: string;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function textToParagraphsHtml(text: string): string {
  return text
    .split(/\n{2,}/)
    .map(
      (paragraph) =>
        `<p style="margin:0 0 12px;">${escapeHtml(paragraph).replace(/\n/g, "<br/>")}</p>`
    )
    .join("");
}

function renderTeaser(teaser: CampaignTeaser): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;border:1px solid ${BRAND_BORDER};border-radius:12px;overflow:hidden;">
      <tr><td>
        <img src="${teaser.imageUrl}" alt="" width="100%" style="display:block;width:100%;max-height:280px;object-fit:cover;" />
      </td></tr>
      <tr><td style="padding:20px;">
        <h2 style="margin:0 0 8px;font-size:20px;color:${BRAND_PETROL_DARK};">${escapeHtml(teaser.title)}</h2>
        ${teaser.factLine ? `<p style="margin:0 0 8px;font-size:14px;color:${BRAND_GREY};">${escapeHtml(teaser.factLine)}</p>` : ""}
        ${teaser.description ? `<p style="margin:0 0 16px;font-size:14px;color:${BRAND_PETROL_DARK};">${escapeHtml(teaser.description)}</p>` : ""}
        <a href="${teaser.url}" style="display:inline-block;background:${BRAND_TEAL};color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;">Jetzt ansehen</a>
      </td></tr>
    </table>`;
}

export function renderCampaignEmail(input: RenderCampaignEmailInput): string {
  return `<!DOCTYPE html>
<html lang="de">
  <head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
  <body style="margin:0;padding:0;background:${BRAND_CREAM};font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND_CREAM};padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" style="max-width:560px;" cellpadding="0" cellspacing="0">
          <tr><td style="padding-bottom:24px;text-align:center;">
            <span style="font-size:24px;font-weight:700;color:${BRAND_TEAL};">Fam<span style="color:${BRAND_GREY};">Vaya</span></span>
          </td></tr>
          <tr><td style="background:#ffffff;border-radius:16px;padding:32px;">
            <h1 style="margin:0 0 16px;font-size:22px;color:${BRAND_PETROL_DARK};">${escapeHtml(input.subject)}</h1>
            <div style="font-size:15px;line-height:1.6;color:${BRAND_PETROL_DARK};">${textToParagraphsHtml(input.introText)}</div>
            ${input.teaser ? renderTeaser(input.teaser) : ""}
          </td></tr>
          <tr><td style="padding-top:24px;text-align:center;font-size:12px;color:${BRAND_GREY};">
            FamVaya · <a href="${input.unsubscribeUrl}" style="color:${BRAND_GREY};">Newsletter abbestellen</a>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}
