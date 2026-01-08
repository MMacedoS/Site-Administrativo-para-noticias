"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageUpload from "@/components/ImageUpload";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface Settings {
  siteName: string;
  siteLogo: string;
  showCarousel: boolean;
  showRecentNews: boolean;
  showTopNews: boolean;
  showDirectors: boolean;
  menuHome: boolean;
  menuNews: boolean;
  menuAbout: boolean;
  menuContact: boolean;
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Settings>({
    siteName: "Unooba",
    siteLogo: "",
    showCarousel: true,
    showRecentNews: true,
    showTopNews: true,
    showDirectors: true,
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
        setFormData({
          siteName: data.data.siteName || "Unooba",
          siteLogo: data.data.siteLogo || "",
          showCarousel: Boolean(data.data.showCarousel),
          showRecentNews: Boolean(data.data.showRecentNews),
          showTopNews: Boolean(data.data.showTopNews),
          showDirectors: Boolean(data.data.showDirectors),
          menuHome: Boolean(data.data.menuHome),
          menuNews: Boolean(data.data.menuNews),
          menuAbout: Boolean(data.data.menuAbout),
          menuContact: Boolean(data.data.menuContact),
        });
      }
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const token = localStorage.getItem("token");
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Configurações salvas com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      alert("Erro ao salvar configurações");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Configurações do Site</h1>
            <p className="text-muted-foreground">
              Configure a aparência e comportamento do site
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push("/admin/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>Configure o nome e logo do site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome do Site</label>
                <Input
                  value={formData.siteName}
                  onChange={(e) =>
                    setFormData({ ...formData, siteName: e.target.value })
                  }
                  placeholder="Nome do site"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Logo do Site</label>
                <ImageUpload
                  value={formData.siteLogo}
                  onChange={(url) =>
                    setFormData({ ...formData, siteLogo: url })
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Recomendado: imagem em formato PNG com fundo transparente
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Seções da Home */}
          <Card>
            <CardHeader>
              <CardTitle>Seções da Página Inicial</CardTitle>
              <CardDescription>
                Ative ou desative seções que aparecem na home
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">
                    Carrossel de Eventos
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Banner rotativo com eventos em destaque
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.showCarousel}
                  onChange={(e) =>
                    setFormData({ ...formData, showCarousel: e.target.checked })
                  }
                  className="h-5 w-5"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">
                    Notícias Recentes
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Últimas notícias publicadas
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.showRecentNews}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      showRecentNews: e.target.checked,
                    })
                  }
                  className="h-5 w-5"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">
                    Notícias Mais Acessadas
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Notícias ordenadas por visualizações
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.showTopNews}
                  onChange={(e) =>
                    setFormData({ ...formData, showTopNews: e.target.checked })
                  }
                  className="h-5 w-5"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Diretoria</label>
                  <p className="text-sm text-muted-foreground">
                    Membros da diretoria
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.showDirectors}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      showDirectors: e.target.checked,
                    })
                  }
                  className="h-5 w-5"
                />
              </div>
            </CardContent>
          </Card>

          {/* Menu de Navegação */}
          <Card>
            <CardHeader>
              <CardTitle>Menu de Navegação</CardTitle>
              <CardDescription>
                Controle quais páginas aparecem no menu principal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Início</label>
                <input
                  type="checkbox"
                  checked={formData.menuHome}
                  onChange={(e) =>
                    setFormData({ ...formData, menuHome: e.target.checked })
                  }
                  className="h-5 w-5"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Notícias</label>
                <input
                  type="checkbox"
                  checked={formData.menuNews}
                  onChange={(e) =>
                    setFormData({ ...formData, menuNews: e.target.checked })
                  }
                  className="h-5 w-5"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Quem Somos</label>
                <input
                  type="checkbox"
                  checked={formData.menuAbout}
                  onChange={(e) =>
                    setFormData({ ...formData, menuAbout: e.target.checked })
                  }
                  className="h-5 w-5"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Contato</label>
                <input
                  type="checkbox"
                  checked={formData.menuContact}
                  onChange={(e) =>
                    setFormData({ ...formData, menuContact: e.target.checked })
                  }
                  className="h-5 w-5"
                />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" disabled={saving} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </form>
      </div>
    </div>
  );
}
