// src/app/layout.tsx
import "@/styles/globals.css";
import { NextIntlClientProvider } from "next-intl";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";
import { getLocale } from "next-intl/server";

export const metadata = {
  title: "Pickly",
  description: "Modern app with i18n",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <html lang={locale} dir={locale === "fa" ? "rtl" : "ltr"}>
      <body className="min-h-screen antialiased">
        <NextIntlClientProvider>
          <AuthProvider>
            {children}
            <Toaster richColors duration={3000} />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
