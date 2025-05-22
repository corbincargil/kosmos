import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { CreateTagSchema, TagSchema } from "@/types/tag";

export const tagRouter = createTRPCRouter({
  getTagsByWorkspaceId: protectedProcedure
    .input(z.object({ workspaceId: z.number() }))
    .query(async ({ ctx, input }) => {
       //todo: remove this query after switching db to connect everything with autoId
      const workspace = await ctx.db.workspace.findUnique({
        where: {
          id: input.workspaceId,
        },
      });

      if (!workspace) {
        throw new Error("Workspace not found");
      }

      return ctx.db.tag.findMany({
        where: {
          workspaceId: workspace.id,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });
    }),

  createTag: protectedProcedure
    .input(CreateTagSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.tag.create({
        data: input,
      });
    }),

  updateTag: protectedProcedure
    .input(TagSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.tag.update({
        where: { autoId: input.autoId },
        data: input,
      });
    }),

  deleteTag: protectedProcedure
    .input(z.object({ autoId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Check if tag is used by any tasks
      const taskCount = await ctx.db.taskTag.count({
        where: { tagId: input.autoId },
      });

      if (taskCount > 0) {
        throw new Error("Cannot delete tag that is in use by tasks");
      }

      return ctx.db.tag.delete({
        where: { autoId: input.autoId },
      });
    }),
});
    