export type Currency = "RUB" | "USD" | "EUR" | "CNY";

export interface CurrencyConfig {
  symbol: string;
  locale: string;
  position: "before" | "after";
}

export const currencyConfig: Record<Currency, CurrencyConfig> = {
  RUB: { symbol: "₽", locale: "ru-RU", position: "after" },
  USD: { symbol: "$", locale: "en-US", position: "before" },
  EUR: { symbol: "€", locale: "de-DE", position: "after" },
  CNY: { symbol: "¥", locale: "zh-CN", position: "before" },
};

export function formatCurrency(
  amount: number,
  currency: Currency,
  exchangeRate: number = 1
): string {
  const convertedAmount = amount * exchangeRate;
  const config = currencyConfig[currency];
  
  const formatted = new Intl.NumberFormat(config.locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(convertedAmount);
  
  return config.position === "before"
    ? `${config.symbol}${formatted}`
    : `${formatted} ${config.symbol}`;
}

export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[^\d.,]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
}
