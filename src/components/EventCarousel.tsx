"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl?: string;
}

export default function EventCarousel() {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (events.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [events.length]);

  const loadEvents = async () => {
    try {
      const response = await fetch("/api/events");
      const data = await response.json();
      if (data.success && data.data.length > 0) {
        setEvents(data.data);
      } else {
        // Fallback to default event if none in database
        setEvents([
          {
            id: 1,
            title: "Bem-vindo ao Unooba",
            description: "Sistema de gestão de notícias e informações públicas",
            date: new Date().toISOString(),
            location: "Online",
            imageUrl:
              "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
          },
        ]);
      }
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
      setEvents([
        {
          id: 1,
          title: "Bem-vindo ao Unooba",
          description: "Sistema de gestão de notícias e informações públicas",
          date: new Date().toISOString(),
          location: "Online",
          imageUrl:
            "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + events.length) % events.length
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
  };

  if (loading || events.length === 0) {
    return (
      <div className="relative w-full h-100 md:h-125 linear-gradient-to-r from-primary/90 to-primary overflow-hidden rounded-lg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  const currentEvent = events[currentIndex];

  return (
    <div className="relative w-full h-100 md:h-125 linear-gradient-to-r from-primary/90 to-primary overflow-hidden rounded-lg">
      {/* Background Image */}
      {currentEvent.imageUrl && (
        <div className="absolute inset-0">
          <img
            src={currentEvent.imageUrl}
            alt={currentEvent.title}
            className="w-full h-full object-cover opacity-75"
          />
        </div>
      )}

      {/* Slides */}
      <div className="relative h-full">
        {events.map((event, index) => (
          <div
            key={event.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="flex items-center justify-center h-full px-4">
              <div className="max-w-4xl text-center text-white">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  {event.title}
                </h2>
                <p className="text-xl md:text-2xl mb-4">{event.description}</p>
                <div className="flex flex-wrap items-center justify-center gap-4 text-lg md:text-xl text-primary-foreground/90">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <span>
                      {new Date(event.date).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <span>{event.location}</span>
                  </div>
                </div>
                {/* <Button size="lg" variant="secondary" className="mt-8">
                  Saiba Mais
                </Button> */}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {events.length > 1 && (
        <>
          <Button
            variant="secondary"
            size="icon"
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm"
            aria-label="Próximo"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Dots Navigation */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {events.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? "bg-white" : "bg-white/50"
                }`}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
