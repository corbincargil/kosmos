import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const workspaceRouter = createTRPCRouter({
  getUserWorkspaces: protectedProcedure
    .input(
      z
        .object({
          workspaceId: z.number().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.userId) throw new Error("User not found");

      return ctx.db.workspace.findMany({
        where: {
          userId: Number(ctx.userId),
        },
      });
    }),
});
