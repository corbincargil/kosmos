import { z } from "zod";


export const TagSchema = z.object({
  autoId: z.number().int().positive(),
  name: z.string(),
  color: z.string(),
  workspaceId: z.number().int().positive(),
});

export const CreateTagSchema = TagSchema.omit({ autoId: true });