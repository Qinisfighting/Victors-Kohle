import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Currency = "EUR" | "USD" | "GBP" | "CHF" | "CNY";

export const currencySymbols: Record<Currency, string> = {
  EUR: "€",
  USD: "$",
  GBP: "£",
  CHF: "CHF",
  CNY: "¥",
};

const STORAGE_KEY = "currency";

const getInitialCurrency = (): Currency => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored && stored in currencySymbols ? (stored as Currency) : "EUR";
  } catch {
    return "EUR";
  }
};

interface CurrencyContextType {
  currency: Currency;
  symbol: string;
  setCurrency: (currency: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<Currency>(getInitialCurrency);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, currency);
    } catch {
      // localStorage unavailable (e.g. private browsing); currency just won't persist.
    }
  }, [currency]);

  return (
    <CurrencyContext.Provider
      value={{ currency, symbol: currencySymbols[currency], setCurrency }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
