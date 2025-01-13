import { PrismaClient, Task, TaskStatus, TaskPriority } from "@prisma/client";

const prisma = new PrismaClient();

export const TaskService = {
  getTasksByWorkspaceId: async (
    workspaceId: number,
    limit?: number
  ): Promise<Task[]> => {
    return prisma.task.findMany({
      where: {
        workspaceId,
      },
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  getTasksByUserId: async (userId: number, limit?: number): Promise<Task[]> => {
    return prisma.task.findMany({
      where: {
        workspace: {
          userId: userId,
        },
      },
      include: {
        workspace: {
          select: {
            name: true,
          },
        },
      },
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });
  },
  createTask: async (
    title: string,
    userId: number,
    workspaceId: number,
    description?: string,
    dueDate?: Date | null,
    status?: TaskStatus,
    priority?: TaskPriority
  ): Promise<Task> => {
    return prisma.task.create({
      data: {
        title,
        userId,
        workspaceId,
        description,
        dueDate,
        status,
        priority,
      },
    });
  },

  editTask: async (
    id: number,
    title?: string,
    description?: string,
    dueDate?: Date | null,
    status?: TaskStatus,
    priority?: TaskPriority | null,
    workspaceId?: number
  ): Promise<Task> => {
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (dueDate !== undefined) updateData.dueDate = dueDate;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (workspaceId !== undefined) updateData.workspaceId = workspaceId;

    return prisma.task.update({
      where: { id },
      data: updateData,
    });
  },

  deleteTask: async (id: number): Promise<void> => {
    await prisma.task.delete({
      where: { id },
    });
  },
};
