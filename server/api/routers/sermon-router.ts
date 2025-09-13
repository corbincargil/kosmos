import {
  CreateSermonNoteSchema,
  SermonNoteWithS3Url,
} from "@/types/sermon-note";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { processSermonNote } from "@/server/utils/sermon-processor";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const client = new S3Client({
  region: process.env.S3_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

export const sermonRouter = createTRPCRouter({
  getCurrentWorkspaceSermonNotes: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
      })
    )
    .query(async ({ ctx, input }): Promise<SermonNoteWithS3Url[]> => {
      const workspace = await ctx.db.workspace.findUnique({
        where: { uuid: input.workspaceId },
      });

      if (!workspace) {
        return [];
      }

      const notes = await ctx.db.sermonNote.findMany({
        where: {
          userId: ctx.userId,
          workspaceId: workspace.id,
        },
        orderBy: { updatedAt: "desc" },
      });

      for (const note of notes) {
        if (!note.s3Key) {
          continue;
        }

        const command = new GetObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: note.s3Key,
        });

        const s3Url = await getSignedUrl(client, command, {
          expiresIn: 60 * 5, // 5 minutes
        });

        note.s3Key = s3Url;
      }

      return notes;
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
      const { title, workspaceId, s3Key } = input;

      // Convert workspace UUID to workspace ID
      const workspace = await ctx.db.workspace.findUnique({
        where: { uuid: workspaceId.toString() },
      });

      if (!workspace) {
        throw new Error("Workspace not found");
      }

      // Auto-generate title from uploadId if not provided
      const finalTitle = title || `Sermon ${new Date().toLocaleDateString()}`;

      const sermonNote = await ctx.db.sermonNote.create({
        data: {
          title: finalTitle,
          s3Key,
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

      const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: s3Key,
      });

      const s3Url = await getSignedUrl(client, command, {
        expiresIn: 60 * 5, // 5 minutes
      });

      // Fire-and-forget background processing
      processSermonNote(sermonNote.id, s3Url).catch((error) => {
        console.error("Background sermon processing failed:", error);
      });

      return sermonNote;
    }),
});
