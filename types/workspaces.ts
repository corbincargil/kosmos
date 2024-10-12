import { z } from "zod";

export const WorkspaceSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  ownerId: z.number().int().positive(),
});

export type Workspace = z.infer<typeof WorkspaceSchema>;
