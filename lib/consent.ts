import { cookies } from "next/headers";

export const CONSENT_COOKIE_NAME = "famvaya-consent";

export type ConsentValue = "accepted" | "declined" | null;

// Serverseitig gelesen im Root-Layout, um <Analytics/> (Spec: "nur
// notwendige Cookies vor Einwilligung") nur nach Zustimmung zu rendern.
export async function getConsent(): Promise<ConsentValue> {
  const cookieStore = await cookies();
  const value = cookieStore.get(CONSENT_COOKIE_NAME)?.value;
  return value === "accepted" || value === "declined" ? value : null;
}
