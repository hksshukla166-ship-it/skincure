"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
  variant?: "navbar" | "hero";
}

export function LanguageSwitcher({ className, variant = "navbar" }: LanguageSwitcherProps) {
  const { language, setLanguage, tr } = useLanguage();

  if (variant === "hero") {
    return (
      <div className={cn("inline-flex items-center rounded-full glass p-1 gap-1", className)}>
        <button
          onClick={() => setLanguage("en")}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300",
            language === "en"
              ? "bg-primary-800 text-white shadow-md"
              : "text-primary-700 hover:bg-primary-50"
          )}
          aria-pressed={language === "en"}
        >
          English
        </button>
        <button
          onClick={() => setLanguage("hi")}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300",
            language === "hi"
              ? "bg-primary-800 text-white shadow-md"
              : "text-primary-700 hover:bg-primary-50"
          )}
          aria-pressed={language === "hi"}
        >
          हिंदी
        </button>
      </div>
    );
  }

  return (
    <div className={cn("relative group", className)}>
      <button
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-primary-50 transition-colors text-primary-700 font-medium text-sm"
        aria-label={tr("language.switch")}
      >
        <Languages className="w-4 h-4" />
        <span>{language === "en" ? "EN" : "हि"}</span>
      </button>
      <div className="absolute top-full right-0 mt-1 py-1 bg-white rounded-xl shadow-premium border border-primary-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-[120px]">
        <button
          onClick={() => setLanguage("en")}
          className={cn(
            "block w-full text-left px-4 py-2 text-sm hover:bg-primary-50 transition-colors",
            language === "en" && "text-primary-800 font-semibold bg-primary-50"
          )}
        >
          {tr("language.en")}
        </button>
        <button
          onClick={() => setLanguage("hi")}
          className={cn(
            "block w-full text-left px-4 py-2 text-sm hover:bg-primary-50 transition-colors",
            language === "hi" && "text-primary-800 font-semibold bg-primary-50"
          )}
        >
          {tr("language.hi")}
        </button>
      </div>
    </div>
  );
}
