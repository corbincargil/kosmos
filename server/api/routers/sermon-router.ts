import { CreateSermonNoteSchema } from "@/types/sermon-note";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { existsSync } from "fs";
import path from "path";

export const sermonRouter = createTRPCRouter({
  createSermonNote: protectedProcedure
    .input(CreateSermonNoteSchema)
    .mutation(async ({ ctx, input }) => {
      const { title, workspaceId, uploadId, imageUrl } = input;

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
              id: workspaceId,
            },
          },
        },
      });

      return sermonNote;
    }),
});
