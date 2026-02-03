"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/i18n-context";
import { useCurrency } from "@/contexts/currency-context";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Calculator } from "lucide-react";
import { calculatePartCost } from "@/lib/cost-calculator";

export default function EstimatePage() {
  const { t } = useI18n();
  const { formatCurrency } = useCurrency();
  const materials = useQuery(api.materials.list);
  const printers = useQuery(api.printers.list);

  const [formData, setFormData] = useState({
    materialId: "",
    weightGrams: 0,
    printTimeMinutes: 0,
    markupPercent: 30,
  });

  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    if (!materials || !printers) return;
    
    const material = materials.find(m => m._id === formData.materialId);
    const printer = printers.find(p => p.isActive);
    
    if (!material || !printer) return;

    const calc = calculatePartCost({
      weightGrams: formData.weightGrams,
      printTimeMinutes: formData.printTimeMinutes,
      materialCostPerGram: material.costPerGram,
      printerHourlyRate: printer.hourlyRate,
    });

    setResult({
      ...calc,
      finalPrice: calc.suggestedPrice(formData.markupPercent),
    });
  };

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)]">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <Calculator className="text-[var(--accent-orange)]" />
            {t("estimate.title")}
          </h1>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Input Form */}
            <Card className="bg-[var(--bg-secondary)] border-[var(--border-default)]">
              <CardHeader>
                <CardTitle className="text-white">
                  {t("parts.partName")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    {t("parts.material")}
                  </label>
                  <select
                    className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-md px-3 py-2 text-white"
                    value={formData.materialId}
                    onChange={(e) => setFormData({ ...formData, materialId: e.target.value })}
                  >
                    <option value="">{t("parts.selectPart")}</option>
                    {materials?.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.name} ({m.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    {t("parts.weight")}
                  </label>
                  <input
                    type="number"
                    className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-md px-3 py-2 text-white"
                    value={formData.weightGrams}
                    onChange={(e) => setFormData({ ...formData, weightGrams: parseFloat(e.target.value) })}
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    {t("parts.printTime")}
                  </label>
                  <input
                    type="number"
                    className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-md px-3 py-2 text-white"
                    value={formData.printTimeMinutes}
                    onChange={(e) => setFormData({ ...formData, printTimeMinutes: parseFloat(e.target.value) })}
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    {t("parts.defaultMarkup")}
                  </label>
                  <input
                    type="number"
                    className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-md px-3 py-2 text-white"
                    value={formData.markupPercent}
                    onChange={(e) => setFormData({ ...formData, markupPercent: parseFloat(e.target.value) })}
                    placeholder="30"
                  />
                </div>

                <Button 
                  className="w-full bg-[var(--accent-orange)] hover:bg-[var(--accent-orange-hover)]"
                  onClick={handleCalculate}
                >
                  <Calculator className="mr-2 h-4 w-4" />
                  {t("estimate.calculate")}
                </Button>
              </CardContent>
            </Card>

            {/* Result */}
            <Card className="bg-[var(--bg-secondary)] border-[var(--border-default)]">
              <CardHeader>
                <CardTitle className="text-white">
                  {t("estimate.result")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result ? (
                  <>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-400">{t("parts.materialCost")}</span>
                      <span className="text-white font-medium">
                        {formatCurrency(result.materialCost)}
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-400">{t("parts.printCost")}</span>
                      <span className="text-white font-medium">
                        {formatCurrency(result.printCost)}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-t border-[var(--border-default)]">
                      <span className="text-gray-400">{t("parts.baseCost")}</span>
                      <span className="text-white font-medium">
                        {formatCurrency(result.baseCost)}
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-400">
                        {t("orders.markup")} ({formData.markupPercent}%)
                      </span>
                      <span className="text-white font-medium">
                        {formatCurrency(result.finalPrice - result.baseCost)}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-t-2 border-[var(--accent-orange)]">
                      <span className="text-xl font-bold text-white">
                        {t("estimate.finalPrice")}
                      </span>
                      <span className="text-2xl font-bold text-[var(--accent-orange)]">
                        {formatCurrency(result.finalPrice)}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    {t("common.noData")}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
