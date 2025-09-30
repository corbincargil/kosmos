import {
  CreateSermonNoteSchema,
  UpdateSermonNoteSchema,
} from "@/types/sermon-note";
import { CreateImageSchema } from "@/types/image";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { processSermonNote } from "@/server/utils/sermon-processor";
import { ImageEntityType } from "@prisma/client";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
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
    .query(async ({ ctx, input }) => {
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
        include: {
          images: true,
        },
        orderBy: { updatedAt: "desc" },
      });

      for (const note of notes) {
        for (const image of note.images) {
          const command = new GetObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: image.s3Key,
          });

          const presignedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 5 * 60, // 5 minutes
          });

          image.s3Key = presignedUrl;
        }
      }

      return notes;
    }),

  getCurrentUserSermonNotes: protectedProcedure.query(async ({ ctx }) => {
    const notes = await ctx.db.sermonNote.findMany({
      where: { userId: ctx.userId },
      include: {
        images: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    for (const note of notes) {
      for (const image of note.images) {
        const command = new GetObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: image.s3Key,
        });

        const presignedUrl = await getSignedUrl(s3Client, command, {
          expiresIn: 5 * 60, // 5 minutes
        });

        image.s3Key = presignedUrl;
      }
    }

    return notes;
  }),

  getSermonNoteById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const note = await ctx.db.sermonNote.findUnique({
        where: { id: input.id },
        include: {
          images: true,
        },
      });

      if (!note) {
        return null;
      }

      // Generate presigned URLs for all images
      for (const image of note.images) {
        const command = new GetObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: image.s3Key,
        });

        const presignedUrl = await getSignedUrl(s3Client, command, {
          expiresIn: 5 * 60, // 5 minutes
        });

        image.s3Key = presignedUrl;
      }

      return note;
    }),

  getSermonNoteByCuid: protectedProcedure
    .input(z.object({ cuid: z.string() }))
    .query(async ({ ctx, input }) => {
      const note = await ctx.db.sermonNote.findUnique({
        where: { cuid: input.cuid },
        include: {
          images: true,
        },
      });

      if (!note) {
        return null;
      }

      // Generate presigned URLs for all images
      for (const image of note.images) {
        const command = new GetObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: image.s3Key,
        });

        const presignedUrl = await getSignedUrl(s3Client, command, {
          expiresIn: 5 * 60, // 5 minutes
        });

        image.s3Key = presignedUrl;
      }

      return note;
    }),

  createSermonNote: protectedProcedure
    .input(CreateSermonNoteSchema)
    .mutation(async ({ ctx, input }) => {
      const { title, workspaceId } = input;

      const workspace = await ctx.db.workspace.findUnique({
        where: { uuid: workspaceId.toString() },
      });

      if (!workspace) {
        throw new Error("Workspace not found");
      }

      const finalTitle = title || `Sermon ${new Date().toLocaleDateString()}`;

      const sermonNote = await ctx.db.sermonNote.create({
        data: {
          title: finalTitle,
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

      return sermonNote;
    }),

  createSermonNoteWithImages: protectedProcedure
    .input(
      z.object({
        title: z.string().max(100),
        workspaceId: z.string(),
        images: z.array(
          z.object({
            s3Key: z.string(),
            originalName: z.string(),
            mimeType: z.string(),
            fileSize: z.number(),
          })
        ),
        allUploadsSuccessful: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { title, workspaceId, images, allUploadsSuccessful } = input;

      const workspace = await ctx.db.workspace.findUnique({
        where: { uuid: workspaceId.toString() },
      });

      if (!workspace) {
        throw new Error("Workspace not found");
      }

      const finalTitle = title || `Sermon ${new Date().toLocaleDateString()}`;

      // Create SermonNote first
      const sermonNote = await ctx.db.sermonNote.create({
        data: {
          title: finalTitle,
          status: allUploadsSuccessful ? "UPLOADED" : "FAILED",
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

      // Create Image records for successful uploads
      if (images.length > 0) {
        await ctx.db.image.createMany({
          data: images.map((img) => ({
            s3Key: img.s3Key,
            originalName: img.originalName,
            mimeType: img.mimeType,
            fileSize: img.fileSize,
            width: null,
            height: null,
            alt: null,
            entityType: ImageEntityType.SERMON_NOTE,
            entityId: sermonNote.id,
          })),
        });
      }

      // Trigger AI processing only if all uploads succeeded
      if (allUploadsSuccessful && images.length > 0) {
        processSermonNote(sermonNote.id).catch((error) => {
          console.error("Background sermon processing failed:", error);
        });
      }

      return sermonNote;
    }),

  updateSermonNoteByCuid: protectedProcedure
    .input(z.object({ cuid: z.string(), data: UpdateSermonNoteSchema }))
    .mutation(async ({ ctx, input }) => {
      const { cuid, data } = input;
      const { title, markdown } = data;

      const sermonNote = await ctx.db.sermonNote.update({
        where: { cuid },
        data: {
          title,
          markdown,
        },
      });

      return sermonNote;
    }),
});
