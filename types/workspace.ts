import { WorkspaceType } from "@prisma/client";
import { z } from "zod";

export const WorkspaceSchema = z.object({
  id: z.number().int().positive(),
  uuid: z.string(),
  name: z.string(),
  type: z.nativeEnum(WorkspaceType),
  icon: z.string(),
  color: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.number().int().positive(),
});

export const WorkspaceFormSchema = WorkspaceSchema.omit({
  id: true,
  uuid: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
});

export type Workspace = z.infer<typeof WorkspaceSchema>;
