"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Settings {
  siteName: string;
  siteLogo?: string;
  menuHome: boolean;
  menuNews: boolean;
  menuAbout: boolean;
  menuContact: boolean;
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    siteName: "Unooba",
    menuHome: true,
    menuNews: true,
    menuAbout: true,
    menuContact: true,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      const data = await response.json();
      if (data.success && data.data) {
        setSettings({
          siteName: data.data.siteName || "Nome do Site",
          siteLogo: data.data.siteLogo,
          menuHome: Boolean(data.data.menuHome),
          menuNews: Boolean(data.data.menuNews),
          menuAbout: Boolean(data.data.menuAbout),
          menuContact: Boolean(data.data.menuContact),
        });
      }
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
    }
  };

  const allMenuItems = [
    { label: "Início", href: "/", enabled: settings.menuHome },
    { label: "Notícias", href: "/noticias", enabled: settings.menuNews },
    { label: "Quem Somos", href: "/quem-somos", enabled: settings.menuAbout },
    { label: "Contato", href: "/contato", enabled: settings.menuContact },
    { label: "Consulta Pública", href: "/consulta-publica", enabled: true },
  ];

  const menuItems = allMenuItems.filter((item) => item.enabled);

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2 text-2xl font-bold text-primary hover:text-primary/90 transition-colors"
            >
              {settings.siteLogo ? (
                <div className="relative h-10 w-10">
                  <Image
                    src={settings.siteLogo}
                    alt={settings.siteName}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              ) : null}
              <span>{settings.siteName}</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-foreground/70 hover:text-foreground hover:bg-accent px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Button asChild className="ml-4">
              <Link href="/admin">Admin</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-foreground/70 hover:text-foreground hover:bg-accent px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2">
              <Button asChild className="w-full">
                <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
                  Admin
                </Link>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
