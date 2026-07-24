import { ImageResponse } from "next/og";

// iOS-Homescreen-Icon. Kein eigenes Abrunden — iOS wendet automatisch
// seine eigene Squircle-Maske an (Apple-Konvention), siehe app/icon.tsx
// für das gleiche Farbschema am Browser-Tab-Favicon.
const BRAND_TEAL = "#2FA4A3";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
        }}
      >
        <span
          style={{
            fontSize: 120,
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
