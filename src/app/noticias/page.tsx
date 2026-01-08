"use client";

import { useEffect, useState } from "react";
import { Search, Calendar, Tag, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface News {
  id: number;
  title: string;
  slug: string;
  summary: string;
  category: string;
  imageUrl?: string;
  views: number;
  createdAt: string;
}

export default function NoticiasPage() {
  const [news, setNews] = useState<News[]>([]);
  const [filteredNews, setFilteredNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    filterNews();
  }, [news, searchTerm, selectedCategory]);

  const fetchNews = async () => {
    try {
      const response = await fetch("/api/news");
      const data = await response.json();
      if (data.success) {
        const publishedNews = data.data.filter((n: News) => n);
        setNews(publishedNews);

        // Extrair categorias únicas
        const uniqueCategories = [
          "Todas",
          ...new Set(publishedNews.map((n: News) => n.category)),
        ] as string[];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      // Erro ao carregar
    } finally {
      setLoading(false);
    }
  };

  const filterNews = () => {
    let filtered = [...news];

    // Filtrar por busca
    if (searchTerm) {
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          n.summary.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por categoria
    if (selectedCategory !== "Todas") {
      filtered = filtered.filter((n) => n.category === selectedCategory);
    }

    setFilteredNews(filtered);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-2">Todas as Notícias</h1>
        <p className="text-muted-foreground mb-8">
          Encontre as últimas notícias e atualizações
        </p>

        {/* Filtros */}
        <div className="mb-8 space-y-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar notícias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Categorias */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Contador */}
        <div className="mb-6 text-sm text-muted-foreground">
          {filteredNews.length}{" "}
          {filteredNews.length === 1
            ? "notícia encontrada"
            : "notícias encontradas"}
        </div>

        {/* Lista de Notícias */}
        {filteredNews.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Nenhuma notícia encontrada
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredNews.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <Link href={`/noticias/${item.slug}`}>
                  <div className="aspect-video relative bg-muted">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-linear-to-r from-primary/80 to-primary">
                        <span className="text-primary-foreground text-4xl">
                          📰
                        </span>
                      </div>
                    )}
                  </div>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                    <h3 className="text-xl font-bold mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {item.summary}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {item.views}
                      </span>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
