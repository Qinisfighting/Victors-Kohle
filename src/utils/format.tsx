import { Language, localeMap } from "@/i18n/translations";

export const formatAmount = (value: number | bigint, language: Language) => {
  return new Intl.NumberFormat(localeMap[language], {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

// Firestore stores amounts as dot-decimal strings regardless of UI language.
// These helpers convert between that canonical format and the display format.
export const toDisplayNumberString = (value: string, language: Language) =>
  language === "de" ? value.replace(".", ",") : value;

export const toCanonicalNumberString = (value: string, language: Language) =>
  language === "de" ? value.replace(",", ".") : value;
