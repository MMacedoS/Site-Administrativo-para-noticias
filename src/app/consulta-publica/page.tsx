"use client";

import { useState } from "react";
import {
  Search,
  AlertCircle,
  CheckCircle,
  UserCheck,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
}

export default function ConsultaPublicaPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Se parecer ser CPF (números), formata
    if (/^\d+$/.test(value.replace(/\D/g, ""))) {
      setSearchQuery(formatCPF(value));
    } else {
      setSearchQuery(value);
    }
  };

  const handleConsulta = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setProfessionals([]);
    setSearched(false);
    setLoading(true);

    if (searchQuery.trim().length < 3) {
      setError("Por favor, digite pelo menos 3 caracteres");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/professionals/search/${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();

      if (data.success) {
        setProfessionals(data.data || []);
        setSearched(true);
      } else {
        setError(data.message || "Erro ao consultar profissional");
      }
    } catch (err) {
      setError("Erro ao realizar consulta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "regular") {
      return "bg-green-100 text-green-800 border-green-200";
    } else if (statusLower === "irregular") {
      return "bg-red-100 text-red-800 border-red-200";
    } else if (statusLower === "suspenso") {
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Consulta de Registro CBOO
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Verifique o status de registro de profissionais no CBOO por CPF ou
            nome
          </p>
        </div>

        {/* Formulário de Consulta */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Consultar Profissional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleConsulta} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  CPF ou Nome do Profissional
                </label>
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Digite o CPF (000.000.000-00) ou nome"
                  required
                />
                <p className="text-xs text-gray-500">
                  Digite pelo menos 3 caracteres para realizar a busca
                </p>
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
        {searched && (
          <div className="space-y-4">
            {professionals.length > 0 ? (
              <>
                <div className="flex items-center gap-2 text-green-600 mb-4">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">
                    {professionals.length} profissional(is) encontrado(s)
                  </span>
                </div>

                {professionals.map((professional) => (
                  <Card key={professional.id} className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <UserCheck className="h-6 w-6 text-blue-600" />
                          <div>
                            <CardTitle className="text-xl">
                              {professional.name}
                            </CardTitle>
                            <p className="text-sm text-gray-600 mt-1">
                              Registro CBOO: {professional.registrationNumber}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                            professional.status
                          )}`}
                        >
                          {professional.status}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">
                            CPF
                          </h4>
                          <p className="text-gray-900">
                            {formatCPF(professional.cpf)}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">
                            Formação
                          </h4>
                          <p className="text-gray-900">
                            {professional.formation}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">
                            Localização
                          </h4>
                          <p className="text-gray-900">
                            {professional.city} - {professional.state}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Data de Cadastro
                          </h4>
                          <p className="text-gray-900">
                            {new Date(
                              professional.registrationDate
                            ).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>

                      {professional.status.toLowerCase() === "regular" && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-800 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Este profissional está com registro regular no CBOO
                          </p>
                        </div>
                      )}

                      {professional.status.toLowerCase() === "irregular" && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-800 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Este profissional está com pendências no CBOO
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhum profissional encontrado
                    </h3>
                    <p className="text-gray-600">
                      Não foram encontrados registros com os dados informados.
                      <br />
                      Verifique se o CPF ou nome estão corretos e tente
                      novamente.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
