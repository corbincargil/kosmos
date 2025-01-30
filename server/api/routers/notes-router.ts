import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { CreateNoteSchema, NoteSchema, UpdateNoteSchema } from "@/types/note";

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
    .input(CreateNoteSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.note.create({
        data: { ...input, userId: Number(ctx.userId) },
      });
    }),

  updateNote: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: UpdateNoteSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.note.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  deleteNote: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.note.delete({ where: { id: input } });
    }),
});
