import OpenAI from "openai";
import { readFile } from "fs/promises";
import path from "path";

export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async extractTextFromImage(imageUrlOrPath: string): Promise<string> {
    try {
      let imageContent: string;

      // Check if it's a local path or URL
      if (imageUrlOrPath.startsWith("http")) {
        // For production URLs, use the URL directly
        imageContent = imageUrlOrPath;
      } else {
        // For local development, convert file to base64
        const filePath = imageUrlOrPath.startsWith("/uploads/")
          ? path.join(process.cwd(), "public", imageUrlOrPath)
          : imageUrlOrPath;

        const fileBuffer = await readFile(filePath);
        const base64Image = fileBuffer.toString("base64");

        // Determine MIME type based on file extension
        const extension = path.extname(filePath).toLowerCase();
        let mimeType = "image/jpeg"; // default
        if (extension === ".png") mimeType = "image/png";
        if (extension === ".gif") mimeType = "image/gif";
        if (extension === ".webp") mimeType = "image/webp";

        imageContent = `data:${mimeType};base64,${base64Image}`;
      }

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Extract all text from this sermon image. Return only the raw text, no formatting. Preserve the original structure and content exactly as written.",
              },
              {
                type: "image_url",
                image_url: { url: imageContent },
              },
            ],
          },
        ],
        max_tokens: 1000,
      });

      return response.choices[0]?.message?.content || "";
    } catch (error) {
      console.error("Error extracting text from image:", error);
      throw new Error("Failed to extract text from image");
    }
  }

  async convertTextToMarkdown(text: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `Convert this sermon text to clean markdown format:

${text}

Format with:
# Main Title (if present)
## Key Points  
- Bullet points for important ideas
### Sub-sections as needed
**Bold** for emphasis where appropriate

Keep the spiritual and theological content intact. Organize the content logically while preserving the original meaning and structure.`,
          },
        ],
        max_tokens: 2000,
      });

      return response.choices[0]?.message?.content || "";
    } catch (error) {
      console.error("Error converting text to markdown:", error);
      throw new Error("Failed to convert text to markdown");
    }
  }
}
