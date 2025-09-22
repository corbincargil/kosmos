/*
  Warnings:

  - You are about to drop the column `s3Key` on the `SermonNote` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ImageEntityType" AS ENUM ('SERMON_NOTE', 'NOTE', 'POST');

-- AlterTable
ALTER TABLE "SermonNote" DROP COLUMN "s3Key";

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "cuid" TEXT NOT NULL,
    "s3Key" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "alt" TEXT,
    "entityType" "ImageEntityType" NOT NULL,
    "entityId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Image_cuid_key" ON "Image"("cuid");

-- CreateIndex
CREATE INDEX "Image_entityType_entityId_idx" ON "Image"("entityType", "entityId");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_SermonNote" FOREIGN KEY ("entityId") REFERENCES "SermonNote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
