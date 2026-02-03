"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useI18n } from "@/contexts/i18n-context";

type OrderStatus = "new" | "printing" | "finished" | "delivered";

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const statusStyles: Record<OrderStatus, string> = {
  new: "bg-[var(--status-new)] border-[var(--status-new)]",
  printing: "bg-[var(--status-printing)] border-[var(--status-printing)] animate-pulse-slow",
  finished: "bg-[var(--status-finished)] border-[var(--status-finished)]",
  delivered: "bg-[var(--status-delivered)] border-[var(--status-delivered)]",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { t } = useI18n();

  return (
    <Badge
      className={cn(
        "text-white font-medium",
        statusStyles[status],
        className
      )}
    >
      {t(`orders.statuses.${status}`)}
    </Badge>
  );
}
