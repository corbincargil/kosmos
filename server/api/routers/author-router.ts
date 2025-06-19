import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { CreateAuthorSchema, UpdateAuthorSchema } from "@/types/author";

export const authorRouter = createTRPCRouter({
  getCurrentUserAuthors: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.author.findMany({
      where: { userId: Number(ctx.userId) },
    });
  }),

  createAuthor: protectedProcedure
    .input(CreateAuthorSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.author.create({
        data: { ...input, userId: Number(ctx.userId) },
      });
    }),

  updateAuthor: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: UpdateAuthorSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.author.update({
        where: { autoId: input.id },
        data: input.data,
      });
    }),
}); 