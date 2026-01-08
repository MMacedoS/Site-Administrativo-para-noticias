"use client";

import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminRoute =
    pathname?.startsWith("/admin") || pathname?.startsWith("/auth");

  return (
    <html lang="pt-BR">
      <body className="flex flex-col min-h-screen">
        {!isAdminRoute && <Header />}
        <main className="grow">{children}</main>
        {!isAdminRoute && <Footer />}
      </body>
    </html>
  );
}
