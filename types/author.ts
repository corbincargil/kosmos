import { z } from "zod";

export const AuthorSchema = z.object({
  autoId: z.number().int().positive(),
  firstName: z.string().max(100),
  lastName: z.string().max(100),
  userId: z.number().int().positive(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateAuthorSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name must be less than 100 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Last name must be less than 100 characters"),
});

export const UpdateAuthorSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name must be less than 100 characters")
    .optional(),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Last name must be less than 100 characters")
    .optional(),
});

export type Author = z.infer<typeof AuthorSchema>;
export type CreateAuthorInput = z.infer<typeof CreateAuthorSchema>;
export type UpdateAuthorInput = z.infer<typeof UpdateAuthorSchema>; 