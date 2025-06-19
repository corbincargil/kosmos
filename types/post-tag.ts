import { z } from "zod";

export const PostTagSchema = z.object({
  postId: z.number().int().positive(),
  tagId: z.number().int().positive(),
  createdAt: z.date(),
});

export type PostTag = z.infer<typeof PostTagSchema>; 