import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Next-Default (1MB) reicht nicht für Medien-Uploads im Admin-Bereich
    // (lib/data/media.ts), siehe DECISIONS.md.
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
  images: {
    // Echte Uploads landen im öffentlichen "content-media"-Storage-Bucket
    // (supabase/migrations/0014_admin_storage.sql) — next/image muss die
    // Supabase-Storage-Domain kennen, sonst schlägt das Laden fehl.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // Basis-Sicherheits-Header (Phase 6 Härtung). Bewusst keine CSP: eine
  // korrekte Policy müsste Supabase-/Vercel-Analytics-Domains exakt
  // allowlisten und ließe sich ohne laufendes Deployment nicht verlässlich
  // verifizieren (siehe DECISIONS.md).
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
