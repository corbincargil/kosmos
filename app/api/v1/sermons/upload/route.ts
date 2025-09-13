import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { writeFile } from "fs/promises";
import path from "path";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const userId = formData.get("userId") as string;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // Get all files from form data
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    // Validate all files
    const validationErrors: string[] = [];
    let firstValidFile: File | null = null;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        validationErrors.push(
          `File ${i + 1} (${file.name}) exceeds 10MB limit`
        );
        continue;
      }

      // Check MIME type
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        validationErrors.push(
          `File ${i + 1} (${file.name}) has invalid type: ${file.type}`
        );
        continue;
      }

      // Check file extension
      const extension = path.extname(file.name).toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(extension)) {
        validationErrors.push(
          `File ${i + 1} (${file.name}) has invalid extension: ${extension}`
        );
        continue;
      }

      // If this is the first valid file, store it
      if (!firstValidFile) {
        firstValidFile = file;
      }
    }

    // If we have validation errors but no valid file, return errors
    if (!firstValidFile) {
      return NextResponse.json(
        {
          error:
            validationErrors.length > 0
              ? validationErrors.join(", ")
              : "No valid image files found",
        },
        { status: 400 }
      );
    }

    // Process the first valid file
    const uploadId = nanoid();
    const extension = path.extname(firstValidFile.name).toLowerCase();
    const fileName = `sermon-${uploadId}${extension}`;
    const filePath = path.join(process.cwd(), "public", "uploads", fileName);

    // Convert file to buffer and save
    const bytes = await firstValidFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Return success response
    return NextResponse.json({
      uploadId,
      fileName,
      imageUrl: `/uploads/${fileName}`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
