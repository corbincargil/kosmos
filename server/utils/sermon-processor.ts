import { db } from "@/server/db";
import { OpenAIService } from "@/server/services/openai-service";

const openaiService = new OpenAIService();

export async function processSermonNote(
  sermonNoteId: number,
  imageUrl: string
): Promise<void> {
  try {
    console.log(`Starting processing for sermon note ${sermonNoteId}`);

    // Update status to PROCESSING
    await db.sermonNote.update({
      where: { id: sermonNoteId },
      data: { status: "PROCESSING" },
    });

    console.log(`Extracting text from image: ${imageUrl}`);

    // Convert full URL to local path for development, or use URL for production
    let imagePath: string;
    if (imageUrl.includes("localhost") || imageUrl.includes("127.0.0.1")) {
      // Extract the path from localhost URL
      const url = new URL(imageUrl);
      imagePath = url.pathname; // e.g., "/uploads/sermon-abc123.jpg"
    } else {
      // Production URL, use as-is
      imagePath = imageUrl;
    }

    // Step 1: Extract text from image
    const ocrText = await openaiService.extractTextFromImage(imagePath);

    console.log(`OCR extraction completed, text length: ${ocrText.length}`);

    // Step 2: Convert text to markdown
    const markdown = await openaiService.convertTextToMarkdown(ocrText);

    console.log(
      `Markdown conversion completed, markdown length: ${markdown.length}`
    );

    // Update sermon note with results
    await db.sermonNote.update({
      where: { id: sermonNoteId },
      data: {
        ocrText,
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
