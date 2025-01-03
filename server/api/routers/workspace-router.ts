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
});
