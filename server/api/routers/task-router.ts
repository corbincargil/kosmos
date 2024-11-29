import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const taskRouter = createTRPCRouter({
  getCurrentUserTasks: protectedProcedure
    .input(
      z
        .object({
          workspaceId: z.number().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.userId) throw new Error("User not found");

      return ctx.db.task.findMany({
        where: {
          userId: Number(ctx.userId),
        },
      });
    }),

  // getCurrentWorkspaceTasks: protectedProcedure.query(async ({ ctx }) => {
  //   return ctx.db.task.findMany({
  //     where: { workspaceId: ctx.workspaceId },
  //   });
  // }),
});
