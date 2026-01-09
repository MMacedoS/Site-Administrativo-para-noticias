"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface Pendencia {
  id: number;
  cpf: string;
  name: string;
  description: string;
  amount?: number;
  dueDate?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminPendenciasPage() {
  const router = useRouter();
  const [pendencias, setPendencias] = useState<Pendencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    cpf: "",
    name: "",
    description: "",
    amount: "",
    dueDate: "",
    status: "pendente",
  });

  useEffect(() => {
    fetchPendencias();
  }, []);

  const fetchPendencias = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/pendencias", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setPendencias(data.data);
      }
    } catch (error) {
      console.error("Erro ao carregar pendências:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    return value;
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setFormData({ ...formData, cpf: formatted });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const cpfNumbers = formData.cpf.replace(/\D/g, "");
    if (cpfNumbers.length !== 11) {
      alert("CPF inválido");
      return;
    }

    try {
      const url = editingId
        ? `/api/pendencias/${editingId}`
        : "/api/pendencias";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cpf: cpfNumbers,
          name: formData.name,
          description: formData.description,
          amount: formData.amount ? parseFloat(formData.amount) : null,
          dueDate: formData.dueDate || null,
          status: formData.status,
        }),
      });

      if (response.ok) {
        await fetchPendencias();
        setShowForm(false);
        setEditingId(null);
        setFormData({
          cpf: "",
          name: "",
          description: "",
          amount: "",
          dueDate: "",
          status: "pendente",
        });
      }
    } catch (error) {
      console.error("Erro ao salvar pendência:", error);
    }
  };

  const handleEdit = (item: Pendencia) => {
    setEditingId(item.id);
    setFormData({
      cpf: formatCPF(item.cpf),
      name: item.name,
      description: item.description,
      amount: item.amount?.toString() || "",
      dueDate: item.dueDate ? item.dueDate.split("T")[0] : "",
      status: item.status,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta pendência?")) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/api/pendencias/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchPendencias();
      }
    } catch (error) {
      console.error("Erro ao excluir pendência:", error);
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Gerenciar Pendências</h1>
            <p className="text-muted-foreground">
              Cadastre e gerencie pendências vinculadas a CPF
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push("/admin/dashboard")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <Button
              onClick={() => {
                setShowForm(!showForm);
                setEditingId(null);
                setFormData({
                  cpf: "",
                  name: "",
                  description: "",
                  amount: "",
                  dueDate: "",
                  status: "pendente",
                });
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Pendência
            </Button>
          </div>
        </div>

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {editingId ? "Editar Pendência" : "Nova Pendência"}
              </CardTitle>
              <CardDescription>
                Preencha os dados abaixo para {editingId ? "editar" : "criar"} a
                pendência
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">CPF *</label>
                    <Input
                      value={formData.cpf}
                      onChange={handleCPFChange}
                      placeholder="000.000.000-00"
                      maxLength={14}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nome/Título *</label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Ex: Taxa de IPTU 2025"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Descrição *</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Detalhes sobre a pendência"
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Valor (R$)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Vencimento</label>
                    <Input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) =>
                        setFormData({ ...formData, dueDate: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status *</label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    >
                      <option value="pendente">Pendente</option>
                      <option value="pago">Pago</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit">
                    {editingId ? "Atualizar" : "Criar"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {pendencias.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Nenhuma pendência cadastrada
              </CardContent>
            </Card>
          ) : (
            pendencias.map((item) => (
              <Card key={item.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                        <h3 className="text-xl font-bold">{item.name}</h3>
                        <Badge
                          variant={
                            item.status === "pago"
                              ? "default"
                              : item.status === "pendente"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {item.status.charAt(0).toUpperCase() +
                            item.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        CPF: {formatCPF(item.cpf)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(item)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-3">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {item.amount && (
                      <span>
                        <strong>Valor:</strong> R${" "}
                        {Number(item.amount).toFixed(2)}
                      </span>
                    )}
                    {item.dueDate && (
                      <span>
                        <strong>Vencimento:</strong>{" "}
                        {new Date(item.dueDate).toLocaleDateString("pt-BR")}
                      </span>
                    )}
                    <span>
                      <strong>Cadastrado em:</strong>{" "}
                      {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
