"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { en, Translations } from "@/locales/en";
import { ru } from "@/locales/ru";

type Locale = "en" | "ru";

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const translations: Record<Locale, Translations> = {
  en,
  ru,
};

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", newLocale);
    }
  }, []);

  const t = useCallback((key: string): string => {
    const keys = key.split(".");
    let value: any = translations[locale];
    
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return typeof value === "string" ? value : key;
  }, [locale]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLocale = localStorage.getItem("locale") as Locale;
      if (savedLocale && (savedLocale === "en" || savedLocale === "ru")) {
        setLocaleState(savedLocale);
      }
    }
  }, []);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
