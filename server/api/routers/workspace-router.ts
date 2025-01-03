import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const workspaceRouter = createTRPCRouter({
  getUserWorkspaces: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) throw new Error("User not found");

    return ctx.db.workspace.findMany({
      where: {
        userId: Number(ctx.userId),
      },
    });
  }),

  addWorkspace: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        color: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.workspace.create({
        data: {
          name: input.name,
          color: input.color,
          userId: Number(ctx.userId),
        },
      });
    }),

  editWorkspace: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        color: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.workspace.update({
        where: { id: input.id },
        data: input,
      });
    }),

  deleteWorkspace: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.workspace.delete({ where: { id: input } });
    }),
});
