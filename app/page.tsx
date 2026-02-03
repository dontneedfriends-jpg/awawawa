"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/contexts/i18n-context";
import { useCurrency } from "@/contexts/currency-context";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { 
  ShoppingCart, 
  Package, 
  DollarSign, 
  TrendingUp 
} from "lucide-react";

export default function DashboardPage() {
  const { t } = useI18n();
  const { formatCurrency } = useCurrency();
  const stats = useQuery(api.analytics.getDashboardStats);

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)]">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">
            {t("nav.dashboard")}
          </h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-[var(--bg-secondary)] border-[var(--border-default)]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  {t("analytics.ordersThisMonth")}
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {stats?.ordersThisMonth ?? 0}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[var(--bg-secondary)] border-[var(--border-default)]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  {t("analytics.revenueThisMonth")}
                </CardTitle>
                <DollarSign className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {formatCurrency(stats?.revenueThisMonth ?? 0)}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[var(--bg-secondary)] border-[var(--border-default)]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  {t("analytics.averageOrderValue")}
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {formatCurrency(stats?.averageOrderValue ?? 0)}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[var(--bg-secondary)] border-[var(--border-default)]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Active Parts
                </CardTitle>
                <Package className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {stats?.totalParts ?? 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card className="bg-[var(--bg-secondary)] border-[var(--border-default)]">
            <CardHeader>
              <CardTitle className="text-white">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-400 text-center py-8">
                {t("common.noData")}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
