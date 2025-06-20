import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { CreatePostSchema, UpdatePostSchema } from "@/types/post";

export const postRouter = createTRPCRouter({
  publicGetCurrentWorkspacePosts: publicProcedure
    .input(
      z.object({
        workspaceId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const workspace = await ctx.db.workspace.findUnique({
        where: {
          uuid: input.workspaceId,
        },
      });

      if (!workspace) {
        throw new Error("Workspace not found");
      }

      return ctx.db.post.findMany({
        where: {
          workspaceId: workspace?.id,
        },
        select: {
          cuid: true,
          title: true,
          slug: true,
          content: true,
          status: true,
          publishedAt: true,
          image: true,
          readTime: true,
          views: true,
          createdAt: true,
          updatedAt: true, 
          author: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          tags: {
            select: {
              tag: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });
    }),

  getPostByCuid: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.post.findUnique({
        where: { cuid: input },
        include: {
          author: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });
    }),

  createPost: protectedProcedure
    .input(CreatePostSchema)
    .mutation(async ({ ctx, input }) => {
      // Get the author ID for the current user
      const author = await ctx.db.author.findFirst({
        where: { userId: Number(ctx.userId) },
      });

      if (!author) {
        throw new Error("Author not found for current user");
      }

      const workspace = await ctx.db.workspace.findUnique({
        where: { uuid: input.workspaceId },
      });

      if (!workspace) {
        throw new Error("Workspace not found");
      }

      return ctx.db.post.create({
        data: {
          ...input,
          authorId: author.autoId,
          workspaceId: workspace.id,
        },
      });
    }),

  updatePost: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: UpdatePostSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.update({
        where: { autoId: input.id },
        data: input.data,
      });
    }),

  deletePost: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.delete({ where: { autoId: input } });
    }),

  incrementPostViews: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.update({
        where: { autoId: input },
        data: {
          views: {
            increment: 1,
          },
        },
      });
    }),
}); 