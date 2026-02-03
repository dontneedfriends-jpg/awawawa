import { format, formatDistance, formatRelative } from "date-fns";
import { enUS, ru } from "date-fns/locale";

const locales = { en: enUS, ru };

export function formatDate(
  date: number | Date,
  formatStr: string = "PPP",
  locale: "en" | "ru" = "en"
): string {
  return format(date, formatStr, { locale: locales[locale] });
}

export function formatRelativeTime(
  date: number | Date,
  baseDate: number | Date = new Date(),
  locale: "en" | "ru" = "en"
): string {
  return formatRelative(date, baseDate, { locale: locales[locale] });
}

export function formatTimeAgo(
  date: number | Date,
  baseDate: number | Date = new Date(),
  locale: "en" | "ru" = "en"
): string {
  return formatDistance(date, baseDate, { addSuffix: true, locale: locales[locale] });
}

export function formatDuration(minutes: number, locale: "en" | "ru" = "en"): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (locale === "ru") {
    if (hours > 0) {
      return mins > 0 ? `${hours}ч ${mins}м` : `${hours}ч`;
    }
    return `${mins}м`;
  }
  
  if (hours > 0) {
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
  return `${mins}m`;
}
