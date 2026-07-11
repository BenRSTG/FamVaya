"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FilterField, filterInputClass } from "@/components/filter-field";

type Area = "unterkunft" | "aktivitaet" | "mikroabenteuer" | "unentschlossen";

// Spec §7.2 "Schneller Familien-Check" — bewusst vereinfacht (siehe
// DECISIONS.md): keine Pro-Kind-Altersliste, kein echtes Suchbackend.
// Verlinkt stattdessen mit vorbefüllten Query-Parametern auf die
// bestehenden Übersichtsseiten-Filter.
export function QuickFamilyCheck() {
  const router = useRouter();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(3);
  const [area, setArea] = useState<Area>("unterkunft");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const totalGuests = adults + children;

    switch (area) {
      case "unterkunft":
        router.push(
          `/familienunterkuenfte?minGuests=${totalGuests}&minChildren=${children}`
        );
        break;
      case "aktivitaet":
        router.push("/familienaktivitaeten");
        break;
      case "mikroabenteuer":
        router.push("/mikro-familienabenteuer");
        break;
      case "unentschlossen":
        router.push("/#empfohlene-inhalte");
        break;
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-3xl flex-wrap items-end justify-center gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      <FilterField label="Erwachsene" htmlFor="quick-check-adults">
        <input
          id="quick-check-adults"
          type="number"
          min={1}
          value={adults}
          onChange={(e) => setAdults(Number(e.target.value) || 1)}
          className={filterInputClass}
        />
      </FilterField>

      <FilterField label="Kinder" htmlFor="quick-check-children">
        <input
          id="quick-check-children"
          type="number"
          min={0}
          value={children}
          onChange={(e) => setChildren(Number(e.target.value) || 0)}
          className={filterInputClass}
        />
      </FilterField>

      <FilterField label="Ich suche" htmlFor="quick-check-area">
        <select
          id="quick-check-area"
          value={area}
          onChange={(e) => setArea(e.target.value as Area)}
          className={filterInputClass}
        >
          <option value="unterkunft">Eine Unterkunft</option>
          <option value="aktivitaet">Eine Aktivität</option>
          <option value="mikroabenteuer">Ein Mikro-Abenteuer</option>
          <option value="unentschlossen">Noch unentschlossen</option>
        </select>
      </FilterField>

      <Button type="submit" size="lg">
        Passende Ideen finden
      </Button>
    </form>
  );
}
