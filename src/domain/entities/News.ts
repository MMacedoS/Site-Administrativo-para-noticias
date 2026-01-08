// Domain - News Entity
export interface News {
  id: number;
  title: string;
  slug: string;
  content: string;
  summary: string;
  category?: string;
  authorId: number;
  published: boolean;
  views: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateNewsDTO = Omit<
  News,
  "id" | "slug" | "createdAt" | "updatedAt" | "views"
>;

export type UpdateNewsDTO = Partial<
  Omit<News, "id" | "slug" | "authorId" | "createdAt" | "updatedAt" | "views">
>;
