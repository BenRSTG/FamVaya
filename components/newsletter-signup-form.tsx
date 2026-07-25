import { Button } from "@/components/ui/button";
import { filterInputClass } from "@/components/filter-field";
import { subscribeNewsletter } from "@/lib/actions/newsletter";

type NewsletterStatus = "success" | "duplicate" | "error" | undefined;

// Wiederverwendbare Anmelde-Komponente (Phase 14) — bisher nur inline auf
// der Startseite. `compact` blendet Wohnort/Kinderanzahl aus und wird für
// die Platzierung im Footer genutzt, die auf jeder Seite sichtbar ist.
// Erfolgs-/Fehlermeldung (`status`) kommt nur von der Startseite, da
// subscribeNewsletter() immer auf "/?newsletter=..." umleitet.
export function NewsletterSignupForm({
  status,
  compact = false,
}: {
  status?: NewsletterStatus;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "w-full max-w-md" : "mx-auto max-w-xl text-center"}>
      {!compact && (
        <>
          <h2 className="mb-2 text-2xl font-semibold text-foreground">
            Neue Ideen direkt ins Postfach
          </h2>
          <p className="mb-6 text-muted-foreground">
            Neue Familienideen, passende Unterkünfte und besondere Abenteuer
            direkt ins Postfach.
          </p>
        </>
      )}

      {status === "success" && (
        <p className="mb-4 rounded-lg bg-success/10 px-3 py-2 text-sm text-success">
          Danke für deine Anmeldung!
        </p>
      )}
      {status === "duplicate" && (
        <p className="mb-4 rounded-lg bg-accent/40 px-3 py-2 text-sm text-foreground">
          Diese E-Mail-Adresse ist schon angemeldet.
        </p>
      )}
      {status === "error" && (
        <p className="mb-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Da ist etwas schiefgelaufen — bitte versuch es noch einmal.
        </p>
      )}

      <form
        action={subscribeNewsletter}
        className={compact ? "flex flex-wrap items-end gap-2" : "flex flex-wrap items-end justify-center gap-3"}
      >
        <label className="flex w-56 flex-col gap-1 text-left text-sm">
          E-Mail
          <input
            type="email"
            name="email"
            required
            placeholder="deine@email.de"
            className={filterInputClass}
          />
        </label>
        {!compact && (
          <>
            <label className="flex w-36 flex-col gap-1 text-left text-sm">
              Wohnort (optional)
              <input type="text" name="city" className={filterInputClass} />
            </label>
            <label className="flex w-28 flex-col gap-1 text-left text-sm">
              Kinder (optional)
              <input type="number" name="children_count" min={0} className={filterInputClass} />
            </label>
          </>
        )}
        <Button type="submit" size={compact ? "sm" : "default"}>
          Anmelden
        </Button>
      </form>
    </div>
  );
}
