import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
const S3_BUCKET_REGION = process.env.S3_BUCKET_REGION;
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY;
const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY;
const ENV = process.env.ENV || "development";

const client = new S3Client({
  region: S3_BUCKET_REGION,
  credentials: {
    accessKeyId: S3_ACCESS_KEY!,
    secretAccessKey: S3_SECRET_ACCESS_KEY!,
  },
});

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
    const uploadId = crypto.randomBytes(16).toString("hex");
    const extension = path.extname(firstValidFile.name).toLowerCase();
    const fileName = `${uploadId}${extension}`;

    // Folder structure: sermons/userId/fileName
    const s3Key = `${ENV}/sermons/${userId}/${fileName}`;

    // Convert file to buffer and save
    const bytes = await firstValidFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const params = {
      Bucket: S3_BUCKET_NAME,
      Key: s3Key,
      Body: buffer,
      ContentType: firstValidFile.type,
      Metadata: {
        userId: userId,
        uploadId: uploadId,
        originalName: firstValidFile.name,
      },
    };

    const command = new PutObjectCommand(params);
    await client.send(command);

    // Return success response
    return NextResponse.json({
      uploadId,
      fileName,
      s3Key,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
