import { PrismaClient } from "@prisma/client";
import type { Note } from "@prisma/client";

const prisma = new PrismaClient();

export const NoteService = {
  getNotesByWorkspaceId: async (workspaceId: number): Promise<Note[]> => {
    return prisma.note.findMany({
      where: {
        workspaceId,
      },
    });
  },

  getNotesByUserId: async (userId: number): Promise<Note[]> => {
    return prisma.note.findMany({
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
    });
  },

  getNoteById: async (id: number): Promise<Note | null> => {
    return prisma.note.findUnique({
      where: { id },
    });
  },

  getNoteByUuid: async (uuid: string): Promise<Note | null> => {
    return prisma.note.findUnique({
      where: { uuid },
    });
  },

  createNote: async (data: {
    title: string;
    content: string;
    workspaceId: number;
    userId: number;
  }): Promise<Note> => {
    return prisma.note.create({
      data: {
        ...data,
      },
    });
  },

  updateNote: async (
    id: number,
    data: {
      title: string;
      content: string;
    }
  ): Promise<Note> => {
    return prisma.note.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        updatedAt: new Date(),
      },
    });
  },
};
