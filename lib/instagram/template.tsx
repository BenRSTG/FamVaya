import { ImageResponse } from "next/og";

// Instagram-Quadratformat. Farben aus den Marken-Tokens in
// app/globals.css (--brand-teal, --brand-cream, --brand-petrol-dark) —
// Satori (der ImageResponse-Renderer) kann keine Tailwind-Klassen oder
// CSS-Variablen verarbeiten, deshalb hier als feste Hex-Werte dupliziert.
const SIZE = 1080;
const BRAND_TEAL = "#2FA4A3";
const BRAND_CREAM = "#FBF8F3";
const BRAND_PETROL_DARK = "#173B3A";

export interface PostImageInput {
  imageUrl: string;
  title: string;
  subtitle: string;
  badges: string[];
}

export async function renderPostImage(input: PostImageInput): Promise<Buffer> {
  const response = new ImageResponse(
    (
      <div style={{ width: SIZE, height: SIZE, display: "flex", position: "relative" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={input.imageUrl}
          width={SIZE}
          height={SIZE}
          style={{ position: "absolute", top: 0, left: 0, objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 48,
            display: "flex",
            padding: "0 48px",
          }}
        >
          <div
            style={{
              display: "flex",
              background: BRAND_CREAM,
              padding: "14px 28px",
              borderRadius: 999,
              fontSize: 32,
              fontWeight: 700,
              color: BRAND_PETROL_DARK,
            }}
          >
            FamVaya
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 560,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: 64,
            background:
              "linear-gradient(to top, rgba(23,59,58,0.94) 0%, rgba(23,59,58,0.75) 45%, rgba(23,59,58,0) 100%)",
          }}
        >
          {input.badges.length > 0 && (
            <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
              {input.badges.map((badge) => (
                <div
                  key={badge}
                  style={{
                    display: "flex",
                    background: BRAND_TEAL,
                    color: BRAND_CREAM,
                    padding: "10px 22px",
                    borderRadius: 999,
                    fontSize: 28,
                    fontWeight: 600,
                  }}
                >
                  {badge}
                </div>
              ))}
            </div>
          )}
          <div
            style={{
              display: "flex",
              fontSize: 58,
              fontWeight: 700,
              color: BRAND_CREAM,
              lineHeight: 1.15,
            }}
          >
            {input.title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 32,
              color: BRAND_CREAM,
              marginTop: 16,
              opacity: 0.9,
            }}
          >
            {input.subtitle}
          </div>
        </div>
      </div>
    ),
    { width: SIZE, height: SIZE }
  );

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
