"use client";

import { useEffect, useState } from "react";
import { Languages } from "lucide-react";

// Client-seitige Ganze-Seite-Übersetzung per Google Translate Website-Widget
// (kein next-intl/eigene Übersetzungsdateien) — bewusste Entscheidung, da
// Inhalte (Unterkunfts-/Aktivitätenbeschreibungen etc.) als freier Text aus
// der Datenbank kommen und nicht separat auf Englisch gepflegt werden.
// Baut auf dem bekannten Trick auf, das von Google erzeugte, unsichtbare
// <select class="goog-te-combo"> programmatisch zu bedienen, statt das von
// Google gerenderte Standard-Dropdown zu zeigen (siehe DECISIONS.md).
//
// Startet bei jedem harten Seitenaufruf/Reload bewusst auf Deutsch (siehe
// Anforderung "Default ist Deutsch") statt den Zustand über einen Cookie
// wiederherzustellen — ein programmatisches Wiederanwenden der Übersetzung
// direkt beim Laden (ohne echte Nutzer-Geste) hat sich als unzuverlässig
// erwiesen (das Dropdown zeigt "en", die Seite bleibt aber unübersetzt).
// Innerhalb einer Sitzung bleibt die Übersetzung über normale
// Next.js-Client-Navigation (<Link>) hinweg erhalten, da dabei kein
// vollständiges Neuladen der Seite stattfindet.
//
// Das versteckte <select class="goog-te-combo"> enthält bei
// includedLanguages: "en" ausschließlich die Option "en" — es gibt keine
// "de"-Option zum programmatischen Zurückschalten. Der einzige zuverlässige
// Weg zurück zur Ausgangssprache ist deshalb: Cookie löschen + neu laden.
//
// Bekannte Einschränkung: maschinelle Übersetzung, keine eigenen URLs pro
// Sprache, kein SEO-Effekt für die englische Fassung.

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages: string;
            autoDisplay: boolean;
          },
          elementId: string
        ) => void;
      };
    };
  }
}

const WIDGET_ELEMENT_ID = "google_translate_element";

function waitForCombo(callback: (combo: HTMLSelectElement) => void, attemptsLeft = 20) {
  const combo = document.querySelector<HTMLSelectElement>("select.goog-te-combo");
  if (combo) {
    callback(combo);
    return;
  }
  if (attemptsLeft <= 0) return;
  window.setTimeout(() => waitForCombo(callback, attemptsLeft - 1), 150);
}

function setLanguage(target: "de" | "en") {
  waitForCombo((combo) => {
    combo.value = target;
    combo.dispatchEvent(new Event("change"));
  });
}

export function LanguageToggle() {
  const [ready, setReady] = useState(false);
  const [isEnglish, setIsEnglish] = useState(false);

  useEffect(() => {
    // Ein vorhandenes googtrans-Cookie aus einer früheren Sitzung würde die
    // Initialisierung in den oben beschriebenen kaputten Zustand versetzen.
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    if (document.getElementById(WIDGET_ELEMENT_ID)) {
      setReady(true);
      return;
    }

    const container = document.createElement("div");
    container.id = WIDGET_ELEMENT_ID;
    container.style.display = "none";
    document.body.appendChild(container);

    window.googleTranslateElementInit = () => {
      new window.google!.translate.TranslateElement(
        { pageLanguage: "de", includedLanguages: "en", autoDisplay: false },
        WIDGET_ELEMENT_ID
      );
      setReady(true);
    };

    const script = document.createElement("script");
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  function toggle() {
    if (isEnglish) {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.reload();
      return;
    }
    if (ready) {
      setLanguage("en");
    } else {
      window.setTimeout(() => setLanguage("en"), 500);
    }
    setIsEnglish(true);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isEnglish ? "Auf Deutsch umschalten" : "Switch to English"}
      title={isEnglish ? "Auf Deutsch umschalten" : "Switch to English"}
      className="notranslate flex items-center gap-1 rounded-lg px-2 text-sm font-medium text-foreground hover:bg-muted"
    >
      <Languages className="size-4" aria-hidden />
      {isEnglish ? "DE" : "EN"}
    </button>
  );
}
