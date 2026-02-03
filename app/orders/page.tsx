"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/status-badge";
import { useI18n } from "@/contexts/i18n-context";
import { useCurrency } from "@/contexts/currency-context";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Plus } from "lucide-react";
import { formatDate } from "@/lib/date";

export default function OrdersPage() {
  const { t, locale } = useI18n();
  const { formatCurrency } = useCurrency();
  const orders = useQuery(api.orders.list, {});

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)]">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">
              {t("orders.title")}
            </h1>
            <Button className="bg-[var(--accent-orange)] hover:bg-[var(--accent-orange-hover)]">
              <Plus className="mr-2 h-4 w-4" />
              {t("orders.newOrder")}
            </Button>
          </div>

          <div className="space-y-4">
            {orders?.map((order) => (
              <Card key={order._id} className="bg-[var(--bg-secondary)] border-[var(--border-default)] hover:border-[var(--accent-orange)] transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white text-lg">
                        {order.orderNumber}
                      </CardTitle>
                      <p className="text-gray-400 mt-1">{order.customerName}</p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Parts List */}
                    <div className="border-t border-[var(--border-default)] pt-3">
                      {order.parts.map((part, idx) => (
                        <div key={idx} className="flex justify-between text-sm py-1">
                          <span className="text-gray-300">
                            {part.partName} × {part.quantity}
                          </span>
                          <span className="text-gray-400">
                            {formatCurrency(part.priceAtOrder * part.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-[var(--border-default)]">
                      <div className="text-sm text-gray-400">
                        {formatDate(order.createdAt, "PPP", locale)}
                      </div>
                      <div className="text-lg font-bold text-white">
                        {formatCurrency(order.total)}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm">
                        {t("common.edit")}
                      </Button>
                      <Button variant="outline" size="sm">
                        {t("orders.updateStatus")}
                      </Button>
                      <Button variant="outline" size="sm">
                        {t("orders.printLabel")}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {orders && orders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">{t("common.noData")}</p>
              <Button className="bg-[var(--accent-orange)] hover:bg-[var(--accent-orange-hover)]">
                <Plus className="mr-2 h-4 w-4" />
                {t("orders.newOrder")}
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
