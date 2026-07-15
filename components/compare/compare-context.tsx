"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { COMPARE_MAX_ITEMS, type CompareContentType, type CompareItem } from "@/lib/compare";

const STORAGE_KEY = "famvaya-compare";

interface CompareContextValue {
  items: CompareItem[];
  isSelected: (contentType: CompareContentType, id: string) => boolean;
  toggle: (contentType: CompareContentType, id: string) => void;
  clear: () => void;
  isFull: boolean;
}

const CompareContext = createContext<CompareContextValue | null>(null);

function readStoredItems(): CompareItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CompareItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readStoredItems());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  function isSelected(contentType: CompareContentType, id: string): boolean {
    return items.some((item) => item.contentType === contentType && item.id === id);
  }

  function toggle(contentType: CompareContentType, id: string) {
    setItems((current) => {
      if (current.some((item) => item.contentType === contentType && item.id === id)) {
        return current.filter((item) => !(item.contentType === contentType && item.id === id));
      }
      if (current.length >= COMPARE_MAX_ITEMS) return current;
      return [...current, { contentType, id }];
    });
  }

  function clear() {
    setItems([]);
  }

  return (
    <CompareContext.Provider
      value={{ items, isSelected, toggle, clear, isFull: items.length >= COMPARE_MAX_ITEMS }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare(): CompareContextValue {
  const context = useContext(CompareContext);
  if (!context) throw new Error("useCompare must be used within a CompareProvider");
  return context;
}
