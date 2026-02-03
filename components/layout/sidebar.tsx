"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Layers, 
  Printer, 
  Calculator,
  FileText,
  Settings,
} from "lucide-react";
import { useI18n } from "@/contexts/i18n-context";
import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}

function NavItem({ href, icon, label, isActive }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
        isActive
          ? "bg-[var(--accent-orange)] text-white"
          : "text-gray-300 hover:bg-[var(--bg-tertiary)] hover:text-white"
      )}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useI18n();

  const navItems = [
    {
      href: "/",
      icon: <LayoutDashboard size={20} />,
      label: t("nav.dashboard"),
    },
    {
      href: "/orders",
      icon: <ShoppingCart size={20} />,
      label: t("nav.orders"),
    },
    {
      href: "/parts",
      icon: <Package size={20} />,
      label: t("nav.parts"),
    },
    {
      href: "/materials",
      icon: <Layers size={20} />,
      label: t("nav.materials"),
    },
    {
      href: "/printers",
      icon: <Printer size={20} />,
      label: t("nav.printers"),
    },
    {
      href: "/estimate",
      icon: <Calculator size={20} />,
      label: t("nav.quickEstimate"),
    },
    {
      href: "/reports",
      icon: <FileText size={20} />,
      label: t("nav.reports"),
    },
  ];

  return (
    <aside className="w-64 h-screen bg-[var(--bg-secondary)] border-r border-[var(--border-default)] flex flex-col">
      <div className="p-6 border-b border-[var(--border-default)]">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Printer className="text-[var(--accent-orange)]" size={24} />
          3D Print CRM
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            {...item}
            isActive={pathname === item.href}
          />
        ))}
      </nav>

      <div className="p-4 border-t border-[var(--border-default)]">
        <NavItem
          href="/settings"
          icon={<Settings size={20} />}
          label={t("nav.settings")}
          isActive={pathname === "/settings"}
        />
      </div>
    </aside>
  );
}
