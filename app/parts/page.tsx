"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/i18n-context";
import { useCurrency } from "@/contexts/currency-context";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Plus, Package } from "lucide-react";
import { formatDuration } from "@/lib/date";
import { PartFormDialog } from "@/components/parts/part-form-dialog";

export default function PartsPage() {
  const { t, locale } = useI18n();
  const { formatCurrency } = useCurrency();
  const parts = useQuery(api.parts.list, {});
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)]">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">
              {t("parts.title")}
            </h1>
            <Button 
              className="bg-[var(--accent-orange)] hover:bg-[var(--accent-orange-hover)]"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              {t("parts.newPart")}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {parts?.map((part) => (
              <Card key={part._id} className="bg-[var(--bg-secondary)] border-[var(--border-default)] hover:border-[var(--accent-orange)] transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-white text-lg">
                      {part.name}
                    </CardTitle>
                    {part.photoUrl ? (
                      <img 
                        src={part.photoUrl} 
                        alt={part.name}
                        className="w-16 h-16 rounded object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded bg-[var(--bg-tertiary)] flex items-center justify-center">
                        <Package className="text-gray-600" size={24} />
                      </div>
                    )}
                  </div>
                  {part.description && (
                    <p className="text-sm text-gray-400 mt-2">
                      {part.description}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{t("parts.weight")}</span>
                    <span className="text-white">{part.weightGrams}g</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{t("parts.printTime")}</span>
                    <span className="text-white">
                      {formatDuration(part.printTimeMinutes, locale)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-[var(--border-default)]">
                    <span className="text-gray-400">{t("parts.baseCost")}</span>
                    <span className="text-white font-medium">
                      {formatCurrency(part.baseCost)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{t("parts.suggestedPrice")}</span>
                    <span className="text-[var(--accent-orange)] font-bold">
                      {formatCurrency(part.suggestedPrice)}
                    </span>
                  </div>
                  <div className="pt-3 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      {t("common.edit")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {parts && parts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">{t("common.noData")}</p>
              <Button 
                className="bg-[var(--accent-orange)] hover:bg-[var(--accent-orange-hover)]"
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                {t("parts.newPart")}
              </Button>
            </div>
          )}
        </div>
      </main>

      <PartFormDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
