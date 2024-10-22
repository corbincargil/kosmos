import { z } from "zod";

export const TaskSchema = z.object({
  id: z.number().int().positive().optional(),
  title: z.string().max(100),
  description: z.string().max(255).optional(),
  dueDate: z
    .union([z.date(), z.string()])
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]).default("TODO"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).nullable(),
  userId: z.number().int().positive(),
  workspaceId: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type TaskStatus = "TODO" | "IN_PROGRESS" | "COMPLETED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | null;

export type Task = z.infer<typeof TaskSchema>;
