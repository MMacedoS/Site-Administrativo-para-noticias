// Validation - News Schemas using Zod
import { z } from "zod";

export const createNewsSchema = z.object({
  title: z.string().min(5, "Título deve ter no mínimo 5 caracteres"),
  content: z.string().min(20, "Conteúdo deve ter no mínimo 20 caracteres"),
  summary: z.string().min(10, "Resumo deve ter no mínimo 10 caracteres"),
  category: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  published: z.boolean().default(false),
});

export const updateNewsSchema = z.object({
  title: z.string().min(5, "Título deve ter no mínimo 5 caracteres").optional(),
  content: z
    .string()
    .min(20, "Conteúdo deve ter no mínimo 20 caracteres")
    .optional(),
  summary: z
    .string()
    .min(10, "Resumo deve ter no mínimo 10 caracteres")
    .optional(),
  category: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  published: z.boolean().optional(),
});

export type CreateNewsInput = z.infer<typeof createNewsSchema>;
export type UpdateNewsInput = z.infer<typeof updateNewsSchema>;
