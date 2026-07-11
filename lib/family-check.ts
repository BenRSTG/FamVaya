// Phase-1-Vereinfachung des vollen Familienchecks aus Spec §10.3: leitet aus
// max_children eine 3/4/5+-Kinder-Checkliste ab. Feingranulare redaktionelle
// Kriterien (Schlafsituation, Kostenbewertung, ...) bleiben einer späteren
// Phase vorbehalten, da dafür keine eigenen Spalten existieren.

export interface ChildSuitability {
  label: string;
  suitable: boolean;
}

export function getChildSuitability(maxChildren: number | null): ChildSuitability[] {
  const max = maxChildren ?? 0;
  return [
    { label: "Geeignet für 3 Kinder", suitable: max >= 3 },
    { label: "Geeignet für 4 Kinder", suitable: max >= 4 },
    { label: "Geeignet für 5 oder mehr Kinder", suitable: max >= 5 },
  ];
}
