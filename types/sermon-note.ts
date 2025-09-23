import { SermonNoteStatus } from "@prisma/client";
import { z } from "zod";
import { ImageSchema } from "./image";

export const SermonNoteSchema = z.object({
  id: z.number().int().positive(),
  cuid: z.string().cuid(),
  title: z.string().max(100),
  markdown: z.string().nullable(),
  ocrText: z.string().nullable(),
  status: z.nativeEnum(SermonNoteStatus),
  userId: z.number().int().positive(),
  workspaceId: z.number().int().positive(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const SermonNoteWithImagesSchema = SermonNoteSchema.extend({
  images: z.array(ImageSchema),
});

export const CreateSermonNoteSchema = z.object({
  title: z.string().max(100),
  workspaceId: z.string(),
});

export const UpdateSermonNoteSchema = z.object({
  cuid: z.string(),
  title: z.string().max(100),
  markdown: z.string(),
});

export type SermonNote = z.infer<typeof SermonNoteSchema>;
export type SermonNoteWithImages = z.infer<typeof SermonNoteWithImagesSchema>;
export type CreateSermonNote = z.infer<typeof CreateSermonNoteSchema>;
export type UpdateSermonNote = z.infer<typeof UpdateSermonNoteSchema>;
