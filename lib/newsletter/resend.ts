import "server-only";

// Resend Batch-E-Mail-API — bis zu 100 Nachrichten pro Aufruf. Rohaufrufe
// per fetch() statt des "resend"-npm-Pakets, gleicher Stil wie
// lib/instagram/graph-api.ts (kein neues SDK nur für einen Endpunkt).
//
// ACHTUNG: Endpunkt/Payload nach bestem Wissen (Stand dieser
// Implementierung) — bei der Einrichtung gegen die aktuelle Resend-
// Dokumentation prüfen (siehe DECISIONS.md, Phase 14).
const RESEND_API_BASE = "https://api.resend.com";
const BATCH_SIZE = 100;

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
}

function requireConfig(): { apiKey: string; fromEmail: string } {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !fromEmail) {
    throw new Error(
      "Newsletter-Versand noch nicht eingerichtet (RESEND_API_KEY/RESEND_FROM_EMAIL fehlen)."
    );
  }
  return { apiKey, fromEmail };
}

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
  return chunks;
}

export async function sendCampaignEmails(params: {
  subject: string;
  recipients: { email: string; html: string }[];
}): Promise<void> {
  const { apiKey, fromEmail } = requireConfig();
  if (params.recipients.length === 0) return;

  for (const batch of chunk(params.recipients, BATCH_SIZE)) {
    const response = await fetch(`${RESEND_API_BASE}/emails/batch`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        batch.map((recipient) => ({
          from: fromEmail,
          to: recipient.email,
          subject: params.subject,
          html: recipient.html,
        }))
      ),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const message = body?.message ?? `Resend-API-Fehler (HTTP ${response.status})`;
      throw new Error(message);
    }
  }
}
