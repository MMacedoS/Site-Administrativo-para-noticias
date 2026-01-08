"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

interface ContactData {
  email: string;
  phone: string;
  address: string;
  workingHours?: string;
}

interface Settings {
  siteName: string;
}

export default function Footer() {
  const [contact, setContact] = useState<ContactData>({
    email: "contato@unooba.com.br",
    phone: "(00) 0000-0000",
    address: "Endereço da Sede",
  });
  const [siteName, setSiteName] = useState("Unooba");

  useEffect(() => {
    fetchContact();
    fetchSettings();
  }, []);

  const fetchContact = async () => {
    try {
      const response = await fetch("/api/contact");
      const data = await response.json();
      if (data.success && data.data) {
        setContact({
          email: data.data.email || "contato@unooba.com.br",
          phone: data.data.phone || "(00) 0000-0000",
          address: data.data.address || "Endereço da Sede",
          workingHours: data.data.workingHours,
        });
      }
    } catch (error) {
      console.error("Erro ao carregar dados de contato:", error);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      const data = await response.json();
      if (data.success && data.data) {
        setSiteName(data.data.siteName || "Unooba");
      }
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
    }
  };

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-primary mb-4">{siteName}</h3>
            <p className="text-gray-400 mb-4">
              Sistema de gestão de notícias e informações públicas.
              Transparência e comunicação eficiente.
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Início
                </a>
              </li>
              <li>
                <a
                  href="/noticias"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Notícias
                </a>
              </li>
              <li>
                <a
                  href="/quem-somos"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Quem Somos
                </a>
              </li>
              <li>
                <a
                  href="/consulta-publica"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Consulta Pública
                </a>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {contact.email}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {contact.phone}
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {contact.address}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} {siteName}. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
