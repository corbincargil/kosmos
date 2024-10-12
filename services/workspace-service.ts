import { PrismaClient, Workspace } from "@prisma/client";

const prisma = new PrismaClient();

export const WorkspaceService = {
  createWorkspace: async (userId: number, name: string): Promise<Workspace> => {
    return prisma.workspace.create({
      data: {
        name,
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
};
