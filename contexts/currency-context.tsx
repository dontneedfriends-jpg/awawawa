"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Currency, formatCurrency as formatCurrencyUtil } from "@/lib/currency";

interface ExchangeRates {
  USD: number;
  EUR: number;
  CNY: number;
}

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  exchangeRates: ExchangeRates;
  formatCurrency: (amount: number) => string;
  convertFromRUB: (amount: number) => number;
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

// Default exchange rates (RUB base)
const defaultRates: ExchangeRates = {
  USD: 0.011,  // 1 RUB = 0.011 USD
  EUR: 0.010,  // 1 RUB = 0.010 EUR
  CNY: 0.078,  // 1 RUB = 0.078 CNY
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("RUB");
  const [exchangeRates] = useState<ExchangeRates>(defaultRates);

  const setCurrency = useCallback((newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    if (typeof window !== "undefined") {
      localStorage.setItem("currency", newCurrency);
    }
  }, []);

  const formatCurrency = useCallback((amount: number): string => {
    const rate = currency === "RUB" ? 1 : exchangeRates[currency];
    return formatCurrencyUtil(amount, currency, rate);
  }, [currency, exchangeRates]);

  const convertFromRUB = useCallback((amount: number): number => {
    if (currency === "RUB") return amount;
    return amount * exchangeRates[currency];
  }, [currency, exchangeRates]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCurrency = localStorage.getItem("currency") as Currency;
      if (savedCurrency && ["RUB", "USD", "EUR", "CNY"].includes(savedCurrency)) {
        setCurrencyState(savedCurrency);
      }
    }
  }, []);

  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrency, exchangeRates, formatCurrency, convertFromRUB }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
