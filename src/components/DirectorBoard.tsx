"use client";

import { useEffect, useState } from "react";
import { Mail, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Director {
  id: number;
  name: string;
  position: string;
  email: string;
  phone?: string;
  bio?: string;
  photoUrl?: string;
}

export default function DirectorBoard() {
  const [directors, setDirectors] = useState<Director[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDirectors();
  }, []);

  const loadDirectors = async () => {
    try {
      const response = await fetch("/api/directors");
      const data = await response.json();
      if (data.success) {
        setDirectors(data.data);
      }
    } catch (error) {
      console.error("Erro ao carregar diretores:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">
              Carregando diretoria...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (directors.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Diretoria
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Conheça os profissionais que lideram nossa organização com dedicação
            e transparência
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {directors.map((director) => (
            <Card
              key={director.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardContent className="flex flex-col items-center text-center p-6">
                {/* Avatar */}
                <div className="w-32 h-32 bg-gradient-to-br from-primary/80 to-primary rounded-full flex items-center justify-center mb-4">
                  {director.photoUrl ? (
                    <img
                      src={director.photoUrl}
                      alt={director.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-4xl font-bold">
                      {director.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  )}
                </div>

                {/* Info */}
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {director.name}
                </h3>
                <Badge variant="default" className="mb-4">
                  {director.position}
                </Badge>

                {director.bio && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {director.bio}
                  </p>
                )}

                {/* Contact */}
                <div className="w-full space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <Mail className="h-4 w-4" />
                    <a
                      href={`mailto:${director.email}`}
                      className="hover:text-primary transition-colors truncate"
                    >
                      {director.email}
                    </a>
                  </div>
                  {director.phone && (
                    <div className="flex items-center justify-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{director.phone}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
