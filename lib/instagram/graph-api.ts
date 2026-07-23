import "server-only";

// Instagram Content Publishing API (Meta Graph API), Zwei-Schritt-Flow:
// 1. Media-Container anlegen (Bild-URL + Caption), 2. Container
// veröffentlichen. Erfordert ein Instagram-Business-/Creator-Konto,
// verknüpft mit einer Facebook-Seite, sowie einen langlebigen
// Zugriffs-Token — siehe README.md "Instagram-Anbindung aktivieren".
//
// ACHTUNG: Graph-API-Version/Endpunkte nach bestem Wissen (Stand dieser
// Implementierung) — Metas Anforderungen ändern sich gelegentlich, bei der
// Einrichtung gegen die aktuelle Meta-Dokumentation prüfen (siehe
// DECISIONS.md, Phase 11).
const GRAPH_API_VERSION = "v21.0";
const GRAPH_API_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

export function isInstagramConfigured(): boolean {
  return Boolean(process.env.INSTAGRAM_ACCESS_TOKEN && process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID);
}

function requireConfig(): { accessToken: string; businessAccountId: string } {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const businessAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
  if (!accessToken || !businessAccountId) {
    throw new Error(
      "Instagram-Zugang noch nicht eingerichtet (INSTAGRAM_ACCESS_TOKEN/INSTAGRAM_BUSINESS_ACCOUNT_ID fehlen)."
    );
  }
  return { accessToken, businessAccountId };
}

async function graphApiFetch(path: string, params: Record<string, string>): Promise<{ id: string }> {
  const url = new URL(`${GRAPH_API_BASE}${path}`);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);

  const response = await fetch(url.toString(), { method: "POST" });
  const body = await response.json();
  if (!response.ok) {
    const message = body?.error?.message ?? `Instagram-API-Fehler (HTTP ${response.status})`;
    throw new Error(message);
  }
  return body as { id: string };
}

export async function publishToInstagram(params: {
  imageUrl: string;
  caption: string;
}): Promise<{ instagramMediaId: string }> {
  const { accessToken, businessAccountId } = requireConfig();

  const container = await graphApiFetch(`/${businessAccountId}/media`, {
    image_url: params.imageUrl,
    caption: params.caption,
    access_token: accessToken,
  });

  const published = await graphApiFetch(`/${businessAccountId}/media_publish`, {
    creation_id: container.id,
    access_token: accessToken,
  });

  return { instagramMediaId: published.id };
}
