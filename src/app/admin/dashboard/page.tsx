"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Newspaper,
  Users,
  Calendar,
  FileText,
  Eye,
  TrendingUp,
  Plus,
  Phone,
  Settings,
  AlertCircle,
  Database,
  Download,
  Upload,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DashboardStats {
  totalNews: number;
  publishedNews: number;
  draftNews: number;
  totalDirectors: number;
  totalEvents: number;
  totalViews: number;
  recentNews: Array<{
    id: number;
    title: string;
    views: number;
    createdAt: string;
  }>;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch("/api/dashboard/stats");
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  const handleBackup = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Você precisa estar autenticado para fazer backup");
        router.push("/auth/login");
        return;
      }

      const response = await fetch("/api/database/backup", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ error: "Erro desconhecido" }));
        throw new Error(error.error || "Erro ao fazer backup");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `backup-unooba-${new Date()
        .toISOString()
        .replace(/[:.]/g, "-")}.db`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      alert("Backup realizado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao fazer backup:", error);
      alert(`Erro ao fazer backup do banco de dados: ${error.message}`);
    }
  };

  const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".db")) {
      alert("Por favor, selecione um arquivo .db válido");
      return;
    }

    if (
      !confirm(
        "ATENÇÃO: Esta ação substituirá todos os dados atuais. Um backup automático será criado. Deseja continuar?"
      )
    ) {
      event.target.value = "";
      return;
    }

    setRestoring(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Token de autenticação não encontrado");
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/database/restore", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao restaurar banco de dados");
      }

      alert(
        `Banco de dados restaurado com sucesso!\n\nBackup do banco anterior: ${data.backupFile}\n\nA página será recarregada.`
      );
      window.location.reload();
    } catch (error: any) {
      console.error("Erro ao restaurar banco:", error);
      alert(`Erro ao restaurar banco de dados: ${error.message}`);
    } finally {
      setRestoring(false);
      event.target.value = "";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Dashboard Administrativo
              </h1>
              <p className="text-sm text-muted-foreground">
                Sistema de Gestão Unooba
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link href="/">Ver Site</Link>
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Notícias
              </CardTitle>
              <Newspaper className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalNews || 0}</div>
              <div className="flex gap-2 mt-2">
                <Badge variant="default">
                  {stats?.publishedNews || 0} Publicadas
                </Badge>
                <Badge variant="secondary">
                  {stats?.draftNews || 0} Rascunhos
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Visualizações
              </CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.totalViews.toLocaleString() || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Todas as notícias publicadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Diretores</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.totalDirectors || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Membros da diretoria
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Eventos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.totalEvents || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Eventos cadastrados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Gerenciar conteúdo do sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button asChild className="h-auto py-4 flex-col gap-2">
                <Link href="/admin/news">
                  <Newspaper className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-semibold">Gerenciar Notícias</div>
                    <div className="text-xs opacity-80">
                      Criar, editar e publicar
                    </div>
                  </div>
                </Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                className="h-auto py-4 flex-col gap-2"
              >
                <Link href="/admin/directors">
                  <Users className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-semibold">Gerenciar Diretores</div>
                    <div className="text-xs opacity-80">
                      Adicionar e atualizar
                    </div>
                  </div>
                </Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                className="h-auto py-4 flex-col gap-2"
              >
                <Link href="/admin/users">
                  <Users className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-semibold">Usuários</div>
                    <div className="text-xs opacity-80">Gerenciar acessos</div>
                  </div>
                </Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                className="h-auto py-4 flex-col gap-2"
              >
                <Link href="/admin/events">
                  <Calendar className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-semibold">Gerenciar Eventos</div>
                    <div className="text-xs opacity-80">
                      Organizar calendário
                    </div>
                  </div>
                </Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                className="h-auto py-4 flex-col gap-2"
              >
                <Link href="/admin/about">
                  <TrendingUp className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-semibold">Quem Somos</div>
                    <div className="text-xs opacity-80">
                      Atualizar informações
                    </div>
                  </div>
                </Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                className="h-auto py-4 flex-col gap-2"
              >
                <Link href="/admin/contact">
                  <FileText className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-semibold">Contato</div>
                    <div className="text-xs opacity-80">Dados de contato</div>
                  </div>
                </Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                className="h-auto py-4 flex-col gap-2"
              >
                <Link href="/admin/settings">
                  <Settings className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-semibold">Configurações</div>
                    <div className="text-xs opacity-80">
                      Logo, menus e seções
                    </div>
                  </div>
                </Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                className="h-auto py-4 flex-col gap-2"
              >
                <Link href="/admin/pendencias">
                  <AlertCircle className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-semibold">Pendências</div>
                    <div className="text-xs opacity-80">Gerenciar por CPF</div>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Database Management */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Gerenciamento de Banco de Dados
            </CardTitle>
            <CardDescription>
              Faça backup ou restaure o banco de dados completo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleBackup}
                variant="default"
                className="flex-1 h-auto py-4 flex-col gap-2"
              >
                <Download className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-semibold">Baixar Backup</div>
                  <div className="text-xs opacity-80">
                    Download do banco de dados
                  </div>
                </div>
              </Button>

              <div className="flex-1">
                <input
                  type="file"
                  accept=".db"
                  onChange={handleRestore}
                  disabled={restoring}
                  id="restore-input"
                  className="hidden"
                />
                <label htmlFor="restore-input" className="block">
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full h-auto py-4 flex-col gap-2"
                    disabled={restoring}
                    onClick={() =>
                      document.getElementById("restore-input")?.click()
                    }
                  >
                    <Upload className="h-6 w-6" />
                    <div className="text-center">
                      <div className="font-semibold">
                        {restoring ? "Restaurando..." : "Restaurar Backup"}
                      </div>
                      <div className="text-xs opacity-80">
                        Importar banco de dados
                      </div>
                    </div>
                  </Button>
                </label>
              </div>
            </div>
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-md">
              <p className="text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>
                  <strong>Importante:</strong> Ao restaurar um backup, todos os
                  dados atuais serão substituídos. Um backup automático do banco
                  atual será criado antes da restauração.
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
