"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/i18n-context";
import { FileText, Download } from "lucide-react";

export default function ReportsPage() {
  const { t } = useI18n();

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)]">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <FileText className="text-[var(--accent-orange)]" />
            {t("reports.title")}
          </h1>

          <div className="space-y-4">
            <Card className="bg-[var(--bg-secondary)] border-[var(--border-default)]">
              <CardHeader>
                <CardTitle className="text-white">
                  Generate Reports
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      {t("reports.from")}
                    </label>
                    <input
                      type="date"
                      className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-md px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      {t("reports.to")}
                    </label>
                    <input
                      type="date"
                      className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-md px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="bg-[var(--accent-orange)] hover:bg-[var(--accent-orange-hover)]">
                    <Download className="mr-2 h-4 w-4" />
                    {t("reports.exportCSV")}
                  </Button>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    {t("reports.exportPDF")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
