import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { I18nProvider } from "@/contexts/i18n-context";
import { CurrencyProvider } from "@/contexts/currency-context";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "3D Printing Workshop CRM",
  description: "Complete CRM for managing 3D printing workshop operations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ConvexClientProvider>
          <I18nProvider>
            <CurrencyProvider>
              {children}
              <Toaster position="top-right" richColors />
            </CurrencyProvider>
          </I18nProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
