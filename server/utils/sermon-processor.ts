import { db } from "@/server/db";
import { OpenAIService } from "@/server/services/openai-service";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ImageEntityType } from "@prisma/client";

const openaiService = new OpenAIService();

const s3Client = new S3Client({
  region: process.env.S3_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

export async function processSermonNote(sermonNoteId: number): Promise<void> {
  try {
    console.log(`Starting processing for sermon note ${sermonNoteId}`);

    // Update status to PROCESSING
    await db.sermonNote.update({
      where: { id: sermonNoteId },
      data: { status: "PROCESSING" },
    });

    // Query database for sermon images
    const images = await db.image.findMany({
      where: {
        entityType: ImageEntityType.SERMON_NOTE,
        entityId: sermonNoteId,
      },
      orderBy: { createdAt: "asc" },
    });

    if (images.length === 0) {
      throw new Error("No images found for sermon note");
    }

    console.log(`Found ${images.length} images for processing`);

    // Generate presigned URLs for all images
    const imageUrls: string[] = [];
    for (const image of images) {
      const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: image.s3Key,
      });

      const presignedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 3600, // 1 hour
      });

      imageUrls.push(presignedUrl);
    }

    console.log(`Generated presigned URLs for ${imageUrls.length} images`);

    // Process all images through OCR with updated prompt
    const combinedOcrText = await openaiService.extractTextFromMultipleImages(
      imageUrls
    );

    console.log(
      `OCR extraction completed, text length: ${combinedOcrText.length}`
    );

    // Convert combined text to markdown
    const markdown = await openaiService.convertTextToMarkdown(combinedOcrText);

    console.log(
      `Markdown conversion completed, markdown length: ${markdown.length}`
    );

    // Update sermon note with results
    await db.sermonNote.update({
      where: { id: sermonNoteId },
      data: {
        ocrText: combinedOcrText,
        markdown,
        status: "COMPLETED",
      },
    });

    console.log(
      `Processing completed successfully for sermon note ${sermonNoteId}`
    );
  } catch (error) {
    console.error(`Processing failed for sermon note ${sermonNoteId}:`, error);

    // Update status to FAILED
    await db.sermonNote.update({
      where: { id: sermonNoteId },
      data: { status: "FAILED" },
    });

    throw error;
  }
}
