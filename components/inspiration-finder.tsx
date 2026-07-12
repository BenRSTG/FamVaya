"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterField, filterInputClass } from "@/components/filter-field";
import { AccommodationCard } from "@/components/cards/accommodation-card";
import { ActivityCard } from "@/components/cards/activity-card";
import { MicroAdventureCard } from "@/components/cards/micro-adventure-card";
import { findMatches } from "@/app/lass-dich-inspirieren/actions";
import type { FinderArea, FinderInput, FinderResults, Tag } from "@/lib/types";

const BUDGET_OPTIONS = [
  { label: "Egal", value: "" },
  { label: "Kostenlos", value: "0" },
  { label: "Unter 50 €", value: "50" },
  { label: "Unter 100 €", value: "100" },
  { label: "Unter 250 €", value: "250" },
  { label: "Unter 500 €", value: "500" },
  { label: "Unter 1.000 €", value: "1000" },
];

const STEP_TITLES = [
  "Wie groß ist eure Familie?",
  "Was sucht ihr?",
  "Wann soll es losgehen?",
  "Wie viel möchtet ihr ausgeben?",
  "Was interessiert euch?",
];

export function InspirationFinder({ tags }: { tags: Tag[] }) {
  const [step, setStep] = useState(0);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(3);
  const [area, setArea] = useState<FinderArea>("unentschlossen");
  const [spontaneous, setSpontaneous] = useState(true);
  const [budget, setBudget] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<FinderResults | null>(null);

  const lastInputStep = STEP_TITLES.length - 1;

  function toggleTag(id: string) {
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  }

  async function handleFindResults() {
    setLoading(true);
    const input: FinderInput = {
      adults,
      children,
      area,
      spontaneous,
      maxBudget: budget === "" ? undefined : Number(budget),
      interestTags: tags.filter((t) => selectedTagIds.includes(t.id)),
    };
    const res = await findMatches(input);
    setResults(res);
    setLoading(false);
  }

  function reset() {
    setStep(0);
    setResults(null);
    setSelectedTagIds([]);
  }

  if (results) {
    const totalCount =
      results.accommodations.length +
      results.activities.length +
      results.microAdventures.length;

    return (
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-foreground">
            Eure Vorschläge
          </h2>
          <Button variant="outline" onClick={reset}>
            Neu starten
          </Button>
        </div>

        {totalCount === 0 && (
          <p className="text-muted-foreground">
            Keine Vorschläge für diese Auswahl gefunden. Versucht es mit
            weniger Einschränkungen.
          </p>
        )}

        {results.accommodations.length > 0 && (
          <ResultSection title="Familienunterkünfte">
            {results.accommodations.map(({ item, reasons }) => (
              <ResultWithReasons key={item.id} reasons={reasons}>
                <AccommodationCard accommodation={item} />
              </ResultWithReasons>
            ))}
          </ResultSection>
        )}

        {results.activities.length > 0 && (
          <ResultSection title="Familienaktivitäten">
            {results.activities.map(({ item, reasons }) => (
              <ResultWithReasons key={item.id} reasons={reasons}>
                <ActivityCard activity={item} />
              </ResultWithReasons>
            ))}
          </ResultSection>
        )}

        {results.microAdventures.length > 0 && (
          <ResultSection title="Mikro-Familienabenteuer">
            {results.microAdventures.map(({ item, reasons }) => (
              <ResultWithReasons key={item.id} reasons={reasons}>
                <MicroAdventureCard adventure={item} />
              </ResultWithReasons>
            ))}
          </ResultSection>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="size-4 text-primary" aria-hidden />
        Schritt {step + 1} von {STEP_TITLES.length}
      </div>

      <h2 className="mb-6 text-xl font-semibold text-foreground">
        {STEP_TITLES[step]}
      </h2>

      {step === 0 && (
        <div className="flex gap-4">
          <FilterField label="Erwachsene" htmlFor="finder-adults">
            <input
              id="finder-adults"
              type="number"
              min={1}
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value) || 1)}
              className={filterInputClass}
            />
          </FilterField>
          <FilterField label="Kinder" htmlFor="finder-children">
            <input
              id="finder-children"
              type="number"
              min={0}
              value={children}
              onChange={(e) => setChildren(Number(e.target.value) || 0)}
              className={filterInputClass}
            />
          </FilterField>
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-col gap-2">
          {(
            [
              ["unterkunft", "Eine Unterkunft"],
              ["aktivitaet", "Eine Aktivität"],
              ["mikroabenteuer", "Ein Mikro-Abenteuer"],
              ["unentschlossen", "Noch unentschlossen"],
            ] as [FinderArea, string][]
          ).map(([value, label]) => (
            <RadioOption
              key={value}
              name="area"
              value={value}
              checked={area === value}
              onChange={() => setArea(value)}
              label={label}
            />
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-2">
          <RadioOption
            name="spontaneous"
            value="spontan"
            checked={spontaneous}
            onChange={() => setSpontaneous(true)}
            label="Heute / spontan"
          />
          <RadioOption
            name="spontaneous"
            value="flexibel"
            checked={!spontaneous}
            onChange={() => setSpontaneous(false)}
            label="Ich plane im Voraus"
          />
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-2">
          {BUDGET_OPTIONS.map((option) => (
            <RadioOption
              key={option.label}
              name="budget"
              value={option.value}
              checked={budget === option.value}
              onChange={() => setBudget(option.value)}
              label={option.label}
            />
          ))}
        </div>
      )}

      {step === 4 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            const active = selectedTagIds.includes(tag.id);
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:bg-muted"
                }`}
              >
                {tag.name}
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          Zurück
        </Button>

        {step < lastInputStep ? (
          <Button type="button" onClick={() => setStep((s) => s + 1)}>
            Weiter
          </Button>
        ) : (
          <Button type="button" onClick={handleFindResults} disabled={loading}>
            {loading ? "Suche läuft…" : "Passende Ideen finden"}
          </Button>
        )}
      </div>
    </div>
  );
}

function RadioOption({
  name,
  value,
  checked,
  onChange,
  label,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm text-foreground has-[:checked]:border-primary has-[:checked]:bg-accent/40">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="size-4"
      />
      {label}
    </label>
  );
}

function ResultSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <h3 className="mb-4 text-lg font-semibold text-foreground">{title}</h3>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  );
}

function ResultWithReasons({
  reasons,
  children,
}: {
  reasons: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <ul className="flex flex-wrap gap-1.5">
        {reasons.map((reason) => (
          <li
            key={reason}
            className="rounded-full bg-success/10 px-2.5 py-1 text-xs text-success"
          >
            {reason}
          </li>
        ))}
      </ul>
      {children}
    </div>
  );
}
