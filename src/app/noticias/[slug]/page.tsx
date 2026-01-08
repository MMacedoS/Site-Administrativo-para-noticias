"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, Eye, ArrowLeft, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface News {
  id: number;
  title: string;
  slug: string;
  content: string;
  summary: string;
  category: string;
  imageUrl?: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export default function NoticiaDetalhePage() {
  const params = useParams();
  const router = useRouter();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.slug) {
      fetchNews(params.slug as string);
    }
  }, [params.slug]);

  const fetchNews = async (slug: string) => {
    try {
      const response = await fetch(`/api/news/slug/${slug}`);
      const data = await response.json();
      if (data.success) {
        setNews(data.data);

        // Incrementar visualizações
        fetch(`/api/news/${data.data.id}/views`, { method: "POST" }).catch(
          () => {
            // Ignorar erros ao incrementar views
          }
        );
      }
    } catch (error) {
      console.error("Erro ao carregar notícia:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Notícia não encontrada</h1>
          <Button onClick={() => router.push("/noticias")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para notícias
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/noticias")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para notícias
        </Button>

        <Card>
          <CardContent className="pt-6">
            {/* Imagem de destaque */}
            {news.imageUrl && (
              <div className="aspect-video relative bg-muted rounded-lg overflow-hidden mb-6">
                <img
                  src={news.imageUrl}
                  alt={news.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Categoria e meta info */}
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <Badge variant="default" className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {news.category}
              </Badge>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(news.createdAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {news.views} visualizações
              </span>
            </div>

            {/* Título */}
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {news.title}
            </h1>

            {/* Resumo */}
            <p className="text-xl text-muted-foreground mb-8 border-l-4 border-primary pl-4">
              {news.summary}
            </p>

            {/* Conteúdo */}
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap">{news.content}</div>
            </div>

            {/* Data de atualização */}
            {news.updatedAt !== news.createdAt && (
              <div className="mt-8 pt-6 border-t text-sm text-muted-foreground">
                Última atualização:{" "}
                {new Date(news.updatedAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
