import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const MAX_FILE_SIZE = 2.4 * 1024 * 1024; // 2.4MB per file
const MAX_TOTAL_SIZE = 7.2 * 1024 * 1024; // 7.2MB total
const MAX_FILE_COUNT = 4;
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

interface UploadedImageData {
  s3Key: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
}

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

    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    // File count validation
    if (files.length > MAX_FILE_COUNT) {
      return NextResponse.json(
        { error: `Maximum ${MAX_FILE_COUNT} files allowed` },
        { status: 400 }
      );
    }

    // Total size validation
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > MAX_TOTAL_SIZE) {
      return NextResponse.json(
        {
          error: `Total file size exceeds ${
            MAX_TOTAL_SIZE / (1024 * 1024)
          }MB limit`,
        },
        { status: 400 }
      );
    }

    // Validate all files and collect valid ones
    const validationErrors: string[] = [];
    const validFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Check individual file size
      if (file.size > MAX_FILE_SIZE) {
        validationErrors.push(
          `File ${i + 1} (${file.name}) exceeds ${
            MAX_FILE_SIZE / (1024 * 1024)
          }MB limit`
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

      validFiles.push(file);
    }

    if (validFiles.length === 0) {
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

    // Upload all valid files to S3
    const uploadedImages: UploadedImageData[] = [];
    const uploadErrors: string[] = [];

    for (const file of validFiles) {
      try {
        const uploadId = crypto.randomBytes(16).toString("hex");
        const extension = path.extname(file.name).toLowerCase();
        const fileName = `${uploadId}${extension}`;
        const s3Key = `${ENV}/sermons/${userId}/${fileName}`;

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const params = {
          Bucket: S3_BUCKET_NAME,
          Key: s3Key,
          Body: buffer,
          ContentType: file.type,
          Metadata: {
            userId: userId,
            uploadId: uploadId,
            originalName: file.name,
          },
        };

        const command = new PutObjectCommand(params);
        await client.send(command);

        uploadedImages.push({
          s3Key,
          originalName: file.name,
          mimeType: file.type,
          fileSize: file.size,
        });
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        uploadErrors.push(`Failed to upload ${file.name}`);
      }
    }

    const allUploadsSuccessful = uploadErrors.length === 0;

    return NextResponse.json({
      success: true,
      images: uploadedImages,
      totalUploaded: uploadedImages.length,
      totalFiles: files.length,
      uploadErrors: uploadErrors.length > 0 ? uploadErrors : undefined,
      allUploadsSuccessful,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
