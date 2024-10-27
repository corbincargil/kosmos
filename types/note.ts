import { z } from "zod";

export const NoteSchema = z.object({
  id: z.number().int().positive(),
  uuid: z.string().uuid(),
  title: z.string().max(100),
  content: z.string(),
  userId: z.number().int().positive(),
  workspaceId: z.number().int().positive(),
  createdAt: z.union([z.date(), z.string()]).transform((val) => new Date(val)),
  updatedAt: z.union([z.date(), z.string()]).transform((val) => new Date(val)),
});

export type Note = z.infer<typeof NoteSchema>;
