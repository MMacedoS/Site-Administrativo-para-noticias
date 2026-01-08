"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface AboutData {
  id: number;
  title: string;
  content: string;
  mission: string;
  vision: string;
  companyValues: string;
  imageUrl?: string;
}

export default function QuemSomosPage() {
  const [about, setAbout] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const response = await fetch("/api/about");
      const data = await response.json();
      if (data.success && data.data) {
        setAbout(data.data);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          {about?.title || "Quem Somos"}
        </h1>

        {about?.imageUrl && (
          <div className="mb-8 relative h-96 w-full rounded-lg overflow-hidden">
            <Image
              src={about.imageUrl}
              alt={about.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}

        {about?.content && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">
                {about.content}
              </p>
            </div>
          </div>
        )}

        {about?.mission && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Nossa Missão
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap">{about.mission}</p>
          </div>
        )}

        {about?.vision && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Nossa Visão
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap">{about.vision}</p>
          </div>
        )}

        {about?.companyValues && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Nossos Valores
            </h2>
            <div className="text-gray-700 whitespace-pre-wrap">
              {about.companyValues}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
