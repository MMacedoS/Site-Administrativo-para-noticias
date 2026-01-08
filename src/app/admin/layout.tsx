import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Painel Admin - Unooba",
  description: "Área administrativa do sistema",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
