"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/contexts/i18n-context";
import { useCurrency } from "@/contexts/currency-context";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Plus, Printer, Activity } from "lucide-react";

export default function PrintersPage() {
  const { t } = useI18n();
  const { formatCurrency } = useCurrency();
  const printers = useQuery(api.printers.list);

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)]">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">
              {t("printers.title")}
            </h1>
            <Button className="bg-[var(--accent-orange)] hover:bg-[var(--accent-orange-hover)]">
              <Plus className="mr-2 h-4 w-4" />
              {t("printers.newPrinter")}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {printers?.map((printer) => (
              <Card key={printer._id} className="bg-[var(--bg-secondary)] border-[var(--border-default)]">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white text-lg flex items-center gap-2">
                        <Printer size={20} />
                        {printer.name}
                      </CardTitle>
                      {printer.model && (
                        <p className="text-sm text-gray-400 mt-1">{printer.model}</p>
                      )}
                    </div>
                    <Badge 
                      className={printer.isActive 
                        ? "bg-green-600" 
                        : "bg-gray-600"
                      }
                    >
                      {printer.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{t("printers.hourlyRate")}</span>
                    <span className="text-white font-medium">
                      {formatCurrency(printer.hourlyRate)}/h
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{t("printers.totalHours")}</span>
                    <span className="text-white">{printer.totalPrintHours}h</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{t("printers.totalPrints")}</span>
                    <span className="text-white">{printer.totalPrintCount}</span>
                  </div>
                  {printer.lastMaintenanceAt && (
                    <div className="pt-2 border-t border-[var(--border-default)]">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Activity size={14} />
                        {t("printers.lastMaintenance")}
                      </div>
                      <div className="text-sm text-white mt-1">
                        {new Date(printer.lastMaintenanceAt).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                  <div className="pt-3 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      {t("common.edit")}
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      {t("printers.logMaintenance")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {printers && printers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">{t("common.noData")}</p>
              <Button className="bg-[var(--accent-orange)] hover:bg-[var(--accent-orange-hover)]">
                <Plus className="mr-2 h-4 w-4" />
                {t("printers.newPrinter")}
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
