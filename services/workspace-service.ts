import { PrismaClient, Workspace } from "@prisma/client";

const prisma = new PrismaClient();

export const WorkspaceService = {
  createWorkspace: async (
    userId: number,
    name: string,
    color: string
  ): Promise<Workspace> => {
    return prisma.workspace.create({
      data: {
        name,
        color,
        userId,
      },
    });
  },

  getWorkspacesByUserId: async (userId: number): Promise<Workspace[]> => {
    return prisma.workspace.findMany({
      where: {
        userId,
      },
    });
  },

  editWorkspace: async (
    id: number,
    name: string,
    color: string
  ): Promise<Workspace> => {
    return prisma.workspace.update({
      where: { id },
      data: { name, color },
    });
  },
};
