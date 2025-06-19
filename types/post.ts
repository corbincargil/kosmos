import { z } from "zod";
import { PostStatus } from "@prisma/client";

export const PostSchema = z.object({
  autoId: z.number().int().positive(),
  cuid: z.string(),
  title: z.string().max(100),
  slug: z.string(),
  content: z.string(),
  image: z.string().nullable(),
  readTime: z.number().int().positive(),
  views: z.number().int().nonnegative(),
  status: z.nativeEnum(PostStatus),
  publishedAt: z.date().nullable(),
  authorId: z.number().int().positive(),
  workspaceId: z.number().int().positive(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreatePostSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  content: z.string().min(1, "Content is required"),
  image: z.string().nullable().optional(),
  readTime: z.number().int().positive(),
  status: z.nativeEnum(PostStatus).default("DRAFT"),
  publishedAt: z.date().nullable().optional(),
  workspaceId: z.string(),
  authorId: z.number().int().positive(),
});

export const UpdatePostSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters")
    .optional(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens")
    .optional(),
  content: z.string().min(1, "Content is required").optional(),
  image: z.string().nullable().optional(),
  readTime: z.number().int().positive().optional(),
  status: z.nativeEnum(PostStatus).optional(),
  publishedAt: z.date().nullable().optional(),
  authorId: z.number().int().positive().optional(),
});

export type Post = z.infer<typeof PostSchema>;
export type CreatePostInput = z.infer<typeof CreatePostSchema>;
export type UpdatePostInput = z.infer<typeof UpdatePostSchema>; 