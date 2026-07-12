import type { UserRole } from "@/lib/types";

// Reine Rollen-Prädikate, extrahiert aus lib/auth.ts (requireAdminOrEditor/
// requireAdmin/canPreview) — testbar ohne Supabase-/next-navigation-Mocking
// (Spec §34: "Berechtigungsprüfung"). lib/auth.ts ruft diese Funktionen auf,
// statt die role-Vergleiche mehrfach zu duplizieren.

export function canAccessAdmin(role: UserRole | null | undefined): boolean {
  return role === "admin" || role === "editor";
}

export function isAdmin(role: UserRole | null | undefined): boolean {
  return role === "admin";
}
