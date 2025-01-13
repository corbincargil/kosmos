import { z } from "zod";

export const WorkspaceSchema = z.object({
  id: z.number().int().positive(),
  uuid: z.string(),
  name: z.string(),
  icon: z.string(),
  color: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.number().int().positive(),
});

export type Workspace = z.infer<typeof WorkspaceSchema>;
