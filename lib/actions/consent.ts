"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { CONSENT_COOKIE_NAME } from "@/lib/consent";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export async function setConsent(accepted: boolean): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(CONSENT_COOKIE_NAME, accepted ? "accepted" : "declined", {
    maxAge: ONE_YEAR_SECONDS,
    sameSite: "lax",
    path: "/",
  });
  revalidatePath("/");
}

// Von "Cookie-Einstellungen" im Footer aufgerufen — setzt die Einwilligung
// zurück, damit das Banner erneut erscheint.
export async function resetConsent(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CONSENT_COOKIE_NAME);
  revalidatePath("/");
}
