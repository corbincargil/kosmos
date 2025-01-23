import { z } from "zod";

export const NoteSchema = z.object({
  id: z.number().int().positive(),
  uuid: z.string().uuid(),
  title: z.string().max(100),
  content: z.string(),
  userId: z.number().int().positive(),
  workspaceId: z.number().int().positive().nullable(),
  workspaceUuid: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateNoteSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  content: z.string().min(1, "Content is required"),
  workspaceUuid: z.string().uuid(),
});

export const UpdateNoteSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters")
    .optional(),
  content: z.string().min(1, "Content is required").optional(),
  workspaceUuid: z.string().uuid().optional(),
});

export type Note = z.infer<typeof NoteSchema>;
export type CreateNoteInput = z.infer<typeof CreateNoteSchema>;
export type UpdateNoteInput = z.infer<typeof UpdateNoteSchema>;
