import { TaskPriority, TaskStatus } from "@prisma/client";
import { z } from "zod";

export const TaskSchema = z.object({
  id: z.number().int().positive(),
  uuid: z.string().uuid(),
  title: z.string().max(100),
  description: z.string().max(1600).nullable(),
  dueDate: z
    .union([z.date(), z.string()])
    .nullable()
    .transform((val) => (val ? new Date(val) : null)),
  status: z.nativeEnum(TaskStatus).default("TODO"),
  priority: z.nativeEnum(TaskPriority).nullable(),
  
  userId: z.number().int().positive(),
  workspaceUuid: z.string().uuid(),
  tags: z.array(z.number()).nullable(),

  createdAt: z
    .union([z.date(), z.string()])
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  updatedAt: z
    .union([z.date(), z.string()])
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
});

export const PrimaryTaskStatuses = [
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.BLOCKED,
  TaskStatus.COMPLETED,
];

export const TaskStatusConfig = {
  [TaskStatus.BACKLOG]: {
    label: "Backlog",
    backgroundColor: "bg-neutral-500",
    color: "text-neutral-100",
  },
  [TaskStatus.TODO]: {
    label: "To Do",
    backgroundColor: "bg-yellow-500",
    color: "text-yellow-100",
  },
  [TaskStatus.IN_PROGRESS]: {
    label: "In Progress",
    backgroundColor: "bg-blue-400",
    color: "text-blue-100",
  },
  [TaskStatus.BLOCKED]: {
    label: "Blocked",
    backgroundColor: "bg-orange-600",
    color: "text-orange-100",
  },
  [TaskStatus.COMPLETED]: {
    label: "Completed",
    backgroundColor: "bg-emerald-600",
    color: "text-emerald-100",
  },
  [TaskStatus.CANCELLED]: {
    label: "Cancelled",
    backgroundColor: "bg-neutral-500",
    color: "text-neutral-100",
  },
  [TaskStatus.CLOSED]: {
    label: "Closed",
    backgroundColor: "bg-neutral-500",
    color: "text-neutral-100",
  },
};

export const getTaskLabel = (status: TaskStatus) => {
  return TaskStatusConfig[status].label;
};

export const getTaskColors = (status: TaskStatus) => {
  return TaskStatusConfig[status];
};

export type Task = z.infer<typeof TaskSchema>;
