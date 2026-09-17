"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

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
// Das Google-Skript wird von manchen Werbeblockern/Privacy-Extensions
// blockiert (translate.google.com steht auf gängigen Blocklisten) — in dem
// Fall bleibt der Button sichtbar, aber deaktiviert mit erklärendem Titel,
// statt scheinbar wirkungslos zu bleiben.
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
const INIT_TIMEOUT_MS = 6000;
const SCROLL_STORAGE_KEY = "famvaya-lang-scroll";

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

// Google setzt bei erfolgreicher Übersetzung die Klasse "translated-ltr"
// auf <html> — dient hier als zuverlässiges Erfolgssignal, weil der
// externe Übersetzungsdienst (translate-pa.googleapis.com) gelegentlich
// mit einem CORS-/Netzwerkfehler fehlschlägt, ohne dass das von außen
// sonst erkennbar wäre (siehe DECISIONS.md).
function isTranslated(): boolean {
  return document.documentElement.classList.contains("translated-ltr");
}

function waitForTranslation(onResult: (success: boolean) => void, attemptsLeft = 25) {
  if (isTranslated()) {
    onResult(true);
    return;
  }
  if (attemptsLeft <= 0) {
    onResult(false);
    return;
  }
  window.setTimeout(() => waitForTranslation(onResult, attemptsLeft - 1), 200);
}

export function LanguageToggle() {
  const [ready, setReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [isEnglish, setIsEnglish] = useState(false);
  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    // Nach einem Reload (Rücksprung auf Deutsch, siehe toggle()) die vorher
    // gemerkte Scroll-Position wiederherstellen, damit sich der Wechsel
    // weniger abrupt anfühlt.
    const savedScroll = window.sessionStorage.getItem(SCROLL_STORAGE_KEY);
    if (savedScroll) {
      window.sessionStorage.removeItem(SCROLL_STORAGE_KEY);
      window.scrollTo(0, Number(savedScroll));
    }

    // Ein vorhandenes googtrans-Cookie aus einer früheren Sitzung würde die
    // Initialisierung in den oben beschriebenen kaputten Zustand versetzen.
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    if (document.getElementById(WIDGET_ELEMENT_ID)) {
      setReady(true);
      return;
    }

    const timeout = window.setTimeout(() => setUnavailable(true), INIT_TIMEOUT_MS);

    const container = document.createElement("div");
    container.id = WIDGET_ELEMENT_ID;
    container.style.display = "none";
    document.body.appendChild(container);

    window.googleTranslateElementInit = () => {
      new window.google!.translate.TranslateElement(
        { pageLanguage: "de", includedLanguages: "en", autoDisplay: false },
        WIDGET_ELEMENT_ID
      );
      window.clearTimeout(timeout);
      setReady(true);
    };

    const script = document.createElement("script");
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    script.onerror = () => {
      window.clearTimeout(timeout);
      setUnavailable(true);
    };
    document.body.appendChild(script);

    return () => window.clearTimeout(timeout);
  }, []);

  function goToGerman() {
    if (unavailable || switching || !isEnglish) return;
    window.sessionStorage.setItem(SCROLL_STORAGE_KEY, String(window.scrollY));
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setSwitching(true);
    // Kurze Verzögerung, damit der Spinner noch sichtbar aufblitzt, bevor
    // der Reload den Seiteninhalt ersetzt — sonst wirkt der Klick wie ins
    // Leere gegangen.
    window.setTimeout(() => window.location.reload(), 120);
  }

  function goToEnglish(isRetry = false) {
    if (!isRetry && (unavailable || switching || isEnglish)) return;
    setSwitching(true);
    setIsEnglish(true);

    function apply() {
      setLanguage("en");
      waitForTranslation((success) => {
        if (success) {
          setSwitching(false);
          return;
        }
        if (!isRetry) {
          // Einmal automatisch erneut versuchen — der externe
          // Übersetzungsdienst schlägt gelegentlich transient fehl.
          goToEnglish(true);
          return;
        }
        // Auch der zweite Versuch ist gescheitert: Zustand zurücksetzen,
        // damit der Button nicht fälschlich "Englisch" behauptet.
        setSwitching(false);
        setIsEnglish(false);
      });
    }

    if (ready) {
      apply();
    } else {
      window.setTimeout(apply, 500);
    }
  }

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={goToGerman}
        aria-label="Auf Deutsch umschalten"
        aria-current={!isEnglish}
        title="Auf Deutsch umschalten"
        disabled={unavailable}
        className={`notranslate flex size-9 items-center justify-center rounded-lg text-xl leading-none hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40 ${
          !isEnglish ? "bg-muted ring-1 ring-inset ring-border" : "opacity-50"
        }`}
      >
        {switching && isEnglish ? (
          <Loader2 className="size-4 animate-spin text-foreground" aria-hidden />
        ) : (
          "🇩🇪"
        )}
      </button>
      <button
        type="button"
        onClick={() => goToEnglish()}
        aria-label={unavailable ? "Übersetzung nicht verfügbar" : "Switch to English"}
        aria-current={isEnglish}
        title={
          unavailable
            ? "Übersetzung aktuell nicht verfügbar (evtl. durch einen Werbeblocker blockiert)"
            : "Switch to English"
        }
        disabled={unavailable}
        className={`notranslate flex size-9 items-center justify-center rounded-lg text-xl leading-none hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40 ${
          isEnglish ? "bg-muted ring-1 ring-inset ring-border" : "opacity-50"
        }`}
      >
        {switching && !isEnglish ? (
          <Loader2 className="size-4 animate-spin text-foreground" aria-hidden />
        ) : (
          "🇬🇧"
        )}
      </button>
    </div>
  );
}
