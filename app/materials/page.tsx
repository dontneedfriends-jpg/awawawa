"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/i18n-context";
import { useCurrency } from "@/contexts/currency-context";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Plus, AlertTriangle } from "lucide-react";

export default function MaterialsPage() {
  const { t } = useI18n();
  const { formatCurrency } = useCurrency();
  const materials = useQuery(api.materials.list);
  const lowStock = useQuery(api.materials.getLowStock);

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)]">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">
              {t("materials.title")}
            </h1>
            <Button className="bg-[var(--accent-orange)] hover:bg-[var(--accent-orange-hover)]">
              <Plus className="mr-2 h-4 w-4" />
              {t("materials.newMaterial")}
            </Button>
          </div>

          {/* Low Stock Alerts */}
          {lowStock && lowStock.length > 0 && (
            <Card className="bg-[var(--bg-secondary)] border-yellow-600 mb-6">
              <CardHeader>
                <CardTitle className="text-yellow-500 flex items-center gap-2">
                  <AlertTriangle size={20} />
                  {t("materials.lowStock")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lowStock.map((material) => (
                    <div key={material._id} className="text-gray-300">
                      {material.name} - {material.currentStockGrams}g remaining
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Materials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials?.map((material) => (
              <Card key={material._id} className="bg-[var(--bg-secondary)] border-[var(--border-default)]">
                <CardHeader>
                  <CardTitle className="text-white text-lg">
                    {material.name}
                  </CardTitle>
                  <p className="text-sm text-gray-400">
                    {material.type} {material.color && `- ${material.color}`}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{t("materials.costPerGram")}</span>
                    <span className="text-white font-medium">
                      {formatCurrency(material.costPerGram)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{t("materials.currentStock")}</span>
                    <span className={material.currentStockGrams <= material.lowStockThreshold 
                      ? "text-yellow-500 font-medium" 
                      : "text-white font-medium"
                    }>
                      {material.currentStockGrams}g
                    </span>
                  </div>
                  {material.brand && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">{t("materials.brand")}</span>
                      <span className="text-white">{material.brand}</span>
                    </div>
                  )}
                  <div className="pt-3 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      {t("common.edit")}
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      {t("materials.addStock")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {materials && materials.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">{t("common.noData")}</p>
              <Button className="bg-[var(--accent-orange)] hover:bg-[var(--accent-orange-hover)]">
                <Plus className="mr-2 h-4 w-4" />
                {t("materials.newMaterial")}
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
