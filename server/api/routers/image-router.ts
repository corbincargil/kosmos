import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { CreateImageSchema } from "@/types/image";
import { ImageEntityType } from "@prisma/client";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.S3_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

export const imageRouter = createTRPCRouter({
  createImages: protectedProcedure
    .input(z.array(CreateImageSchema))
    .mutation(async ({ ctx, input }) => {
      const images = await ctx.db.image.createMany({
        data: input,
        skipDuplicates: true,
      });

      return images;
    }),

  getImagesByEntity: protectedProcedure
    .input(
      z.object({
        entityType: z.nativeEnum(ImageEntityType),
        entityId: z.number().int().positive(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.image.findMany({
        where: {
          entityType: input.entityType,
          entityId: input.entityId,
        },
        orderBy: { createdAt: "asc" },
      });
    }),

  generatePresignedUrl: protectedProcedure
    .input(
      z.object({
        s3Key: z.string(),
        expiresIn: z.number().optional().default(300), // 5 minutes default
      })
    )
    .mutation(async ({ ctx, input }) => {
      const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: input.s3Key,
      });

      const presignedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: input.expiresIn,
      });

      return { presignedUrl };
    }),
});
