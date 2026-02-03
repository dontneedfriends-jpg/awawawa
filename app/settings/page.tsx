"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/i18n-context";
import { useCurrency } from "@/contexts/currency-context";
import { Settings as SettingsIcon, Globe, DollarSign } from "lucide-react";

export default function SettingsPage() {
  const { t, locale, setLocale } = useI18n();
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)]">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <SettingsIcon className="text-[var(--accent-orange)]" />
            {t("settings.title")}
          </h1>

          <div className="space-y-6">
            {/* Language Settings */}
            <Card className="bg-[var(--bg-secondary)] border-[var(--border-default)]">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe size={20} />
                  {t("settings.language")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <Button
                    variant={locale === "en" ? "default" : "outline"}
                    onClick={() => setLocale("en")}
                    className={locale === "en" ? "bg-[var(--accent-orange)]" : ""}
                  >
                    English
                  </Button>
                  <Button
                    variant={locale === "ru" ? "default" : "outline"}
                    onClick={() => setLocale("ru")}
                    className={locale === "ru" ? "bg-[var(--accent-orange)]" : ""}
                  >
                    Русский
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Currency Settings */}
            <Card className="bg-[var(--bg-secondary)] border-[var(--border-default)]">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <DollarSign size={20} />
                  {t("settings.currency")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(["RUB", "USD", "EUR", "CNY"] as const).map((curr) => (
                    <Button
                      key={curr}
                      variant={currency === curr ? "default" : "outline"}
                      onClick={() => setCurrency(curr)}
                      className={currency === curr ? "bg-[var(--accent-orange)]" : ""}
                    >
                      {curr}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Business Settings */}
            <Card className="bg-[var(--bg-secondary)] border-[var(--border-default)]">
              <CardHeader>
                <CardTitle className="text-white">
                  Business Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    {t("settings.defaultMarkup")}
                  </label>
                  <input
                    type="number"
                    className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-md px-3 py-2 text-white"
                    placeholder="30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    {t("settings.taxRate")}
                  </label>
                  <input
                    type="number"
                    className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-md px-3 py-2 text-white"
                    placeholder="0"
                  />
                </div>
                <Button className="bg-[var(--accent-orange)] hover:bg-[var(--accent-orange-hover)]">
                  {t("common.save")}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
