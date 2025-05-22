import { z } from "zod";

export const TaskTypeSchema = z.object({
  autoId: z.number().int().positive(),
  name: z.string(),
  color: z.string(),
  icon: z.string(),
  workspaceId: z.number().int().positive(),
  taskCount: z.number().optional(),
});

export const CreateTaskTypeSchema = TaskTypeSchema.omit({ autoId: true, taskCount: true });

export const UpdateTaskTypeSchema = TaskTypeSchema.pick({
  name: true,
  color: true,
  icon: true,
});

export type TaskType = z.infer<typeof TaskTypeSchema>; 