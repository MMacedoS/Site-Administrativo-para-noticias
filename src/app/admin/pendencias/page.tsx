"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  Search,
  Trash2,
  ArrowLeft,
  UserCheck,
  Download,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface Professional {
  id: number;
  name: string;
  cpf: string;
  registrationNumber: string;
  status: string;
  formation: string;
  city: string;
  state: string;
  registrationDate: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminProfessionalsPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProfessionals();
  }, [page, searchTerm]);

  const fetchProfessionals = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = `/api/professionals?page=${page}&limit=50${
        searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ""
      }`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        setProfessionals(data.data);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar profissionais:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("token");
      const response = await fetch("/api/professionals/import", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        alert(
          `Importação concluída!\n\nNovos: ${data.data.inserted}\nAtualizados: ${data.data.updated}\nTotal: ${data.data.total}`
        );
        setPage(1);
        await fetchProfessionals();
      } else {
        alert(`Erro: ${data.message}`);
      }
    } catch (error) {
      console.error("Erro ao importar arquivo:", error);
      alert("Erro ao importar arquivo. Tente novamente.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleClearAll = async () => {
    if (
      !confirm(
        "Tem certeza que deseja remover TODOS os profissionais? Esta ação não pode ser desfeita!"
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/professionals", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        alert("Todos os profissionais foram removidos");
        await fetchProfessionals();
      }
    } catch (error) {
      console.error("Erro ao limpar profissionais:", error);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/professionals/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (data.success) {
        setProfessionals((prev) =>
          prev.map((prof) =>
            prof.id === id ? { ...prof, status: newStatus } : prof
          )
        );
      } else {
        alert(`Erro ao atualizar status: ${data.message}`);
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Erro ao atualizar status. Tente novamente.");
    }
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "regular") return "default";
    if (statusLower === "irregular") return "destructive";
    if (statusLower === "suspenso") return "secondary";
    return "outline";
  };

  const downloadCSVTemplate = () => {
    const csvContent = `Nome,CPF,Nº Registro CBOO,Status,Formacao,Cidade,UF,Data Cadastro
Jurandi de Farias Lins Junior,56690851591,05.00199-5,Regular,Técnico em Óptica e Optometria,Seabra,BA,15/9/2018`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", "modelo_importacao_cboo.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Profissionais CBOO</h1>
            <p className="text-muted-foreground">
              Gerencie o banco de dados de profissionais registrados
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

        {/* Ações de Importação */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Importar Planilha
            </CardTitle>
            <CardDescription>
              Faça upload de uma planilha CSV com os dados dos profissionais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? "Importando..." : "Selecionar Arquivo CSV"}
              </Button>

              <Button variant="outline" onClick={downloadCSVTemplate}>
                <Download className="h-4 w-4 mr-2" />
                Baixar Modelo CSV
              </Button>

              <Button
                variant="outline"
                onClick={fetchProfessionals}
                disabled={loading}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>

              <Button variant="destructive" onClick={handleClearAll}>
                <Trash2 className="h-4 w-4 mr-2" />
                Limpar Todos
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">
                Formato do arquivo CSV:
              </h4>
              <p className="text-sm text-blue-800">
                O arquivo deve conter as seguintes colunas (nesta ordem):
              </p>
              <ul className="text-sm text-blue-800 list-disc list-inside mt-2 space-y-1">
                <li>Nome</li>
                <li>CPF (apenas números)</li>
                <li>Nº Registro CBOO</li>
                <li>Status (Regular, Irregular, etc)</li>
                <li>Formacao</li>
                <li>Cidade</li>
                <li>UF</li>
                <li>Data Cadastro (formato: DD/MM/AAAA)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Busca e Listagem */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Profissionais Cadastrados</CardTitle>
                <CardDescription>
                  Total de {professionals.length} profissionais
                </CardDescription>
              </div>
              <div className="w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome ou CPF..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setPage(1);
                    }}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {professionals.length === 0 ? (
              <div className="py-12 text-center">
                <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm
                    ? "Nenhum profissional encontrado"
                    : "Nenhum profissional cadastrado. Importe uma planilha para começar."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {professionals.map((prof) => (
                  <div
                    key={prof.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-lg">{prof.name}</h3>
                          <Badge variant={getStatusColor(prof.status)}>
                            {prof.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Registro CBOO: {prof.registrationNumber}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <select
                          value={prof.status}
                          onChange={(e) =>
                            handleStatusChange(prof.id, e.target.value)
                          }
                          className="px-3 py-1 border rounded-md text-sm"
                        >
                          <option value="Regular">Regular</option>
                          <option value="Irregular">Irregular</option>
                          <option value="Cancelado">Cancelado</option>
                          <option value="Cancelado (i)">Cancelado (i)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mt-3">
                      <div>
                        <span className="text-muted-foreground">CPF:</span>
                        <p className="font-medium">{formatCPF(prof.cpf)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Formação:</span>
                        <p className="font-medium">{prof.formation}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Cidade:</span>
                        <p className="font-medium">
                          {prof.city} - {prof.state}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Data Cadastro:
                        </span>
                        <p className="font-medium">
                          {new Date(prof.registrationDate).toLocaleDateString(
                            "pt-BR"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Anterior
                </Button>
                <span className="flex items-center px-4">
                  Página {page} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Próxima
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
