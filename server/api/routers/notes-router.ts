import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { NoteSchema } from "@/types/note";

export const noteRouter = createTRPCRouter({
  getCurrentWorkspaceNotes: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.note.findMany({
        where: {
          userId: Number(ctx.userId),
          workspaceUuid: input.workspaceId,
        },
      });
    }),

  getCurrentUserNotes: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.note.findMany({
      where: { userId: Number(ctx.userId) },
    });
  }),

  getNoteByUuid: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.note.findUnique({ where: { uuid: input } });
    }),

  createNote: protectedProcedure
    .input(
      NoteSchema.omit({
        id: true,
        uuid: true,
        createdAt: true,
        updatedAt: true,
        workspaceId: true,
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.note.create({
        data: { ...input },
      });
    }),

  updateNote: protectedProcedure
    .input(
      NoteSchema.omit({
        createdAt: true,
        updatedAt: true,
        uuid: true,
        userId: true,
        workspaceId: true,
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.note.update({
        where: { id: input.id },
        data: input,
      });
    }),

  deleteNote: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.note.delete({ where: { id: input } });
    }),
});
