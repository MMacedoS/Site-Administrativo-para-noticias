"use client";

import { useEffect, useState } from "react";
import EventCarousel from "@/components/EventCarousel";
import NewsCard from "@/components/NewsCard";
import DirectorBoard from "@/components/DirectorBoard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  summary: string;
  category: string;
  views: number;
  imageUrl?: string;
  createdAt: string;
}

interface Settings {
  showCarousel: boolean;
  showRecentNews: boolean;
  showTopNews: boolean;
  showDirectors: boolean;
}

export default function HomePage() {
  const [topNews, setTopNews] = useState<NewsItem[]>([]);
  const [recentNews, setRecentNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<Settings>({
    showCarousel: true,
    showRecentNews: true,
    showTopNews: true,
    showDirectors: true,
  });

  useEffect(() => {
    loadSettings();
    loadTopNews();
    loadRecentNews();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      const data = await response.json();
      if (data.success && data.data) {
        setSettings({
          showCarousel: Boolean(data.data.showCarousel),
          showRecentNews: Boolean(data.data.showRecentNews),
          showTopNews: Boolean(data.data.showTopNews),
          showDirectors: Boolean(data.data.showDirectors),
        });
      }
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
    }
  };

  const loadTopNews = async () => {
    try {
      const response = await fetch("/api/news/top?limit=10");
      const data = await response.json();
      if (data.success) {
        setTopNews(data.data);
      }
    } catch (error) {
      console.error("Erro ao carregar notícias:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentNews = async () => {
    try {
      const response = await fetch("/api/news?published=true");
      const data = await response.json();
      if (data.success) {
        setRecentNews(data.data.slice(0, 6));
      }
    } catch (error) {
      console.error("Erro ao carregar notícias recentes:", error);
    }
  };

  return (
    <div>
      {/* Carousel de Eventos */}
      {settings.showCarousel && <EventCarousel />}

      {/* Notícias Recentes */}
      {settings.showRecentNews && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Notícias Recentes
              </h2>
              <p className="text-lg text-muted-foreground">
                Últimas publicações e atualizações
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentNews.map((news) => (
                <Link
                  key={news.id}
                  href={`/noticias/${news.slug}`}
                  className="block"
                >
                  <NewsCard
                    id={news.id}
                    slug={news.slug}
                    title={news.title}
                    summary={news.summary}
                    date={new Date(news.createdAt).toLocaleDateString("pt-BR")}
                    views={news.views}
                    category={news.category}
                    imageUrl={news.imageUrl}
                  />
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button size="lg" variant="outline" asChild>
                <Link href="/noticias">Ver Todas as Notícias</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Notícias Mais Acessadas */}
      {settings.showTopNews && (
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Notícias Mais Acessadas
              </h2>
              <p className="text-lg text-muted-foreground">
                Fique por dentro das informações que mais interessam à
                comunidade
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">
                  Carregando notícias...
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {topNews.map((news) => (
                    <Link
                      key={news.id}
                      href={`/noticias/${news.slug}`}
                      className="block"
                    >
                      <NewsCard
                        id={news.id}
                        slug={news.slug}
                        title={news.title}
                        summary={news.summary}
                        date={new Date(news.createdAt).toLocaleDateString(
                          "pt-BR"
                        )}
                        views={news.views}
                        category={news.category}
                        imageUrl={news.imageUrl}
                      />
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* Diretoria */}
      {settings.showDirectors && <DirectorBoard />}

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-primary/90 to-primary text-primary-foreground">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Participe das Consultas Públicas
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Sua opinião é fundamental para construirmos uma gestão mais
            transparente e participativa
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/consulta-publica">Acessar Consultas Públicas</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
