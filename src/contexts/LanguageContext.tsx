"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Language, t } from "@/lib/i18n/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  tr: (key: string, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "skin_cure_language";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (saved === "en" || saved === "hi") {
      setLanguageState(saved);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, language);
      document.documentElement.lang = language === "hi" ? "hi" : "en";
    }
  }, [language, mounted]);

  const setLanguage = (lang: Language) => setLanguageState(lang);

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === "en" ? "hi" : "en"));
  };

  const tr = (key: string, vars?: Record<string, string | number>) => t(language, key, vars);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, tr }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
