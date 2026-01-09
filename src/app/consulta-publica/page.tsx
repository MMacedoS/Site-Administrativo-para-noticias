"use client";

import { useState } from "react";
import { Search, AlertCircle, CheckCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Pendencia {
  id: number;
  name: string;
  description: string;
  amount?: number;
  dueDate?: string;
  status: string;
  createdAt: string;
}

interface ConsultaResult {
  cpf: string;
  hasPendencias: boolean;
  pendencias: Pendencia[];
}

export default function ConsultaPublicaPage() {
  const [cpf, setCpf] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ConsultaResult | null>(null);
  const [error, setError] = useState("");

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
    setCpf(formatted);
  };

  const handleConsulta = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    const cpfNumbers = cpf.replace(/\D/g, "");

    if (cpfNumbers.length !== 11) {
      setError("Por favor, insira um CPF válido");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/pendencias/cpf/${cpfNumbers}`);
      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.message || "Erro ao consultar pendências");
      }
    } catch (err) {
      setError("Erro ao realizar consulta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Consulta de Pendências
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Verifique se existem pendências cadastradas em seu CPF
          </p>
        </div>

        {/* Formulário de Consulta */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Consultar CPF
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleConsulta} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">CPF</label>
                <Input
                  type="text"
                  value={cpf}
                  onChange={handleCPFChange}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  required
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Consultando..." : "Consultar"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Resultado da Consulta */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.hasPendencias ? (
                  <>
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <span className="text-yellow-600">
                      Pendências Encontradas
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-green-600">Nenhuma Pendência</span>
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.hasPendencias ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Foram encontradas {result.pendencias.length} pendência(s)
                    para o CPF {formatCPF(result.cpf)}
                  </p>

                  {result.pendencias.map((pendencia) => (
                    <div
                      key={pendencia.id}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <h3 className="font-semibold text-gray-900">
                            {pendencia.name}
                          </h3>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            pendencia.status === "pendente"
                              ? "bg-yellow-100 text-yellow-800"
                              : pendencia.status === "pago"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {pendencia.status.charAt(0).toUpperCase() +
                            pendencia.status.slice(1)}
                        </span>
                      </div>

                      <p className="text-sm text-gray-700 mb-3">
                        {pendencia.description}
                      </p>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        {pendencia.amount && (
                          <div>
                            <span className="font-medium">Valor:</span> R${" "}
                            {Number(pendencia.amount).toFixed(2)}
                          </div>
                        )}
                        {pendencia.dueDate && (
                          <div>
                            <span className="font-medium">Vencimento:</span>{" "}
                            {new Date(pendencia.dueDate).toLocaleDateString(
                              "pt-BR"
                            )}
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Cadastrado em:</span>{" "}
                          {new Date(pendencia.createdAt).toLocaleDateString(
                            "pt-BR"
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">
                  Não foram encontradas pendências para o CPF{" "}
                  {formatCPF(result.cpf)}
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
