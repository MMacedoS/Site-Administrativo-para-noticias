import { Eye, Calendar, Newspaper } from "lucide-react";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface NewsCardProps {
  id: number;
  slug: string;
  title: string;
  summary: string;
  date: string;
  views: number;
  category?: string;
  imageUrl?: string;
}

export default function NewsCard({
  id,
  title,
  summary,
  date,
  views,
  category,
  imageUrl,
}: NewsCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-gradient-to-r from-primary/80 to-primary flex items-center justify-center">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <Newspaper className="w-20 h-20 text-white/50" strokeWidth={1.5} />
        )}
      </div>
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          {category && <Badge variant="secondary">{category}</Badge>}
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span>{views.toLocaleString()}</span>
          </div>
        </div>
        <CardTitle className="line-clamp-2 hover:text-primary cursor-pointer transition-colors">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-3">{summary}</CardDescription>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{date}</span>
        </div>
        <Button variant="default" className="w-full mt-2">
          Ler mais
        </Button>
      </CardFooter>
    </Card>
  );
}
