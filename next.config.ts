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
};

export default nextConfig;
