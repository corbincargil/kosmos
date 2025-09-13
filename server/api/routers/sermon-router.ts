import { CreateSermonNoteSchema } from "@/types/sermon-note";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { existsSync } from "fs";
import path from "path";
import { z } from "zod";
import { processSermonNote } from "@/server/utils/sermon-processor";

export const sermonRouter = createTRPCRouter({
  getCurrentWorkspaceSermonNotes: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Convert workspace UUID to workspace ID
      const workspace = await ctx.db.workspace.findUnique({
        where: { uuid: input.workspaceId },
      });

      if (!workspace) {
        return [];
      }

      return ctx.db.sermonNote.findMany({
        where: {
          userId: ctx.userId,
          workspaceId: workspace.id,
        },
        orderBy: { updatedAt: "desc" },
      });
    }),

  getCurrentUserSermonNotes: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.sermonNote.findMany({
      where: { userId: ctx.userId },
      orderBy: { updatedAt: "desc" },
    });
  }),

  getSermonNote: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.sermonNote.findUnique({
        where: { id: input.id },
      });
    }),

  createSermonNote: protectedProcedure
    .input(CreateSermonNoteSchema)
    .mutation(async ({ ctx, input }) => {
      const { title, workspaceId, uploadId, imageUrl } = input;

      // Convert workspace UUID to workspace ID
      const workspace = await ctx.db.workspace.findUnique({
        where: { uuid: workspaceId.toString() },
      });

      if (!workspace) {
        throw new Error("Workspace not found");
      }

      // If uploadId and imageUrl are provided, validate file exists
      if (uploadId && imageUrl) {
        const filePath = path.join(process.cwd(), "public", imageUrl);
        if (!existsSync(filePath)) {
          throw new Error("Uploaded file not found");
        }
      }

      // Auto-generate title from uploadId if not provided
      const finalTitle =
        title ||
        (uploadId
          ? `Sermon ${uploadId}`
          : `Sermon ${new Date().toISOString()}`);

      const sermonNote = await ctx.db.sermonNote.create({
        data: {
          title: finalTitle,
          imageUrl,
          user: {
            connect: {
              id: ctx.userId,
            },
          },
          workspace: {
            connect: {
              id: workspace.id,
            },
          },
        },
      });

      // Start background processing if we have an image
      if (imageUrl) {
        // Construct full URL for OpenAI API
        const baseUrl =
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        const fullImageUrl = `${baseUrl}${imageUrl}`;

        // Fire-and-forget background processing
        processSermonNote(sermonNote.id, fullImageUrl).catch((error) => {
          console.error("Background sermon processing failed:", error);
        });
      }

      return sermonNote;
    }),
});
