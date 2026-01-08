import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Autenticação - Unooba",
  description: "Login e registro no sistema",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
