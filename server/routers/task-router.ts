import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const taskRouter = createTRPCRouter({
  // getCurrentUserTasks: protectedProcedure
  //   .input(
  //     z
  //       .object({
  //         workspaceId: z.number().optional(),
  //       })
  //       .optional()
  //   )
  //   .query(async ({ ctx, input }) => {
  //     return ctx.db.task.findMany({
  //       where: {
  //         userId: Number(ctx.userId),
  //         ...(input?.workspaceId && { workspaceId: input.workspaceId }),
  //       },
  //       orderBy: {
  //         createdAt: "desc",
  //       },
  //     });
  //   }),
  getCurrentUserTasks: protectedProcedure.query(async ({ ctx }) => {
    return "Testing";
  }),
});
