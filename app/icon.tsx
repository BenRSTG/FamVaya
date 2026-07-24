import { ImageResponse } from "next/og";

// Browser-Tab-Favicon. Rundes Badge in Markenfarbe mit "F"-Monogramm
// (angelehnt an den Schriftzug) statt des Next.js-Standard-Icons.
// Satori kann keine Tailwind-Klassen/CSS-Variablen verarbeiten, deshalb
// hier feste Hex-Werte aus app/globals.css dupliziert (siehe
// lib/instagram/template.tsx für dasselbe Muster).
const BRAND_TEAL = "#2FA4A3";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: BRAND_TEAL,
          borderRadius: 8,
        }}
      >
        <span
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1,
          }}
        >
          F
        </span>
      </div>
    ),
    { ...size }
  );
}
