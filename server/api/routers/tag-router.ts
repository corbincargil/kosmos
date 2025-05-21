import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { CreateTagSchema, TagSchema } from "@/types/tag";

export const tagRouter = createTRPCRouter({
  getTagsByWorkspaceId: protectedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .query(async ({ ctx, input }) => {
        //todo: remove this after switching db to connect everything with autoId
        console.log("input.workspaceId", input.workspaceId);
        const workspace = await ctx.db.workspace.findUnique({
            where: {
                uuid: input.workspaceId,
            },
        });

        if (!workspace) {
            throw new Error("Workspace not found");
        }

      return ctx.db.tag.findMany({
        where: {
          workspaceId: workspace.id,
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
});
    