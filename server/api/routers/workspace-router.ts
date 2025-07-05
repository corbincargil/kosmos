import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { WorkspaceType } from "@prisma/client";
import { WorkspaceFormSchema } from "@/types/workspace";

export const workspaceRouter = createTRPCRouter({
  getUserWorkspaces: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) throw new Error("User not found");

    return ctx.db.workspace.findMany({
      where: {
        userId: Number(ctx.userId),
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  addWorkspace: protectedProcedure
    .input(WorkspaceFormSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.workspace.create({
        data: {
          name: input.name,
          color: input.color,
          type: input.type,
          icon: input.icon,
          userId: Number(ctx.userId),
        },
      });
    }),

  editWorkspace: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: WorkspaceFormSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.workspace.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  deleteWorkspace: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.workspace.delete({ where: { id: input } });
    }),
});
