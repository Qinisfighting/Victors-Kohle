import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  Language,
  localeMap,
  translations,
  TranslationKey,
} from "@/i18n/translations";

const STORAGE_KEY = "language";

const getInitialLanguage = (): Language => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "en" ? "en" : "de";
  } catch {
    return "de";
  }
};

interface LanguageContextType {
  language: Language;
  locale: string;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // localStorage unavailable (e.g. private browsing); language just won't persist.
    }
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: TranslationKey) => translations[language][key];

  return (
    <LanguageContext.Provider
      value={{ language, locale: localeMap[language], setLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
