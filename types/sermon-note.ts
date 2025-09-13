import { SermonNoteStatus } from "@prisma/client";
import { z } from "zod";

export const SermonNoteSchema = z.object({
  id: z.number().int().positive(),
  cuid: z.string().cuid(),
  title: z.string().max(100),
  markdown: z.string().nullable(),
  ocrText: z.string().nullable(),
  imageUrl: z.string().nullable(),
  status: z.nativeEnum(SermonNoteStatus),

  userId: z.number().int().positive(),
  workspaceId: z.number().int().positive().nullable(),

  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateSermonNoteSchema = z.object({
  title: z.string().max(100),
  workspaceId: z.string(),
  uploadId: z.string().optional(),
  imageUrl: z.string().optional(),
});

export type SermonNote = z.infer<typeof SermonNoteSchema>;
