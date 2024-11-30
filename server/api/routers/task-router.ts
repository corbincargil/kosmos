import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const taskRouter = createTRPCRouter({
  getCurrentUserTasks: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.userId) throw new Error("User not found");

      return ctx.db.task.findMany({
        where: {
          userId: Number(ctx.userId),
          ...(input.workspaceId && input.workspaceId !== "all"
            ? { workspaceId: parseInt(input.workspaceId) }
            : {}),
        },
      });
    }),

  getCurrentWorkspaceTasks: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.task.findMany({
        where: {
          userId: Number(ctx.userId),
          workspaceId: Number(input.workspaceId),
        },
      });
    }),
});
