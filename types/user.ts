import { z } from "zod";

export const UserSchema = z.object({
  id: z.number().int().positive(),
  email: z.string().email(),
  clerkUserId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;
