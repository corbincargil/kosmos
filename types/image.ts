import { ImageEntityType } from "@prisma/client";
import { z } from "zod";

export const ImageSchema = z.object({
  id: z.number().int().positive(),
  cuid: z.string().cuid(),
  s3Key: z.string(),
  originalName: z.string(),
  mimeType: z.string(),
  fileSize: z.number().int().positive(),
  width: z.number().int().positive().nullable(),
  height: z.number().int().positive().nullable(),
  alt: z.string().nullable(),
  entityType: z.nativeEnum(ImageEntityType),
  entityId: z.number().int().positive(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateImageSchema = z.object({
  s3Key: z.string(),
  originalName: z.string(),
  mimeType: z.string(),
  fileSize: z.number().int().positive(),
  width: z.number().int().positive().nullable(),
  height: z.number().int().positive().nullable(),
  alt: z.string().nullable(),
  entityType: z.nativeEnum(ImageEntityType),
  entityId: z.number().int().positive(),
});

export type Image = z.infer<typeof ImageSchema>;
export type CreateImage = z.infer<typeof CreateImageSchema>;
