-- CreateEnum
CREATE TYPE "SermonNoteStatus" AS ENUM ('UPLOADED', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "SermonNote" (
    "id" SERIAL NOT NULL,
    "cuid" TEXT NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "markdown" TEXT,
    "ocrText" TEXT,
    "imageUrl" TEXT,
    "status" "SermonNoteStatus" NOT NULL DEFAULT 'UPLOADED',
    "userId" INTEGER NOT NULL,
    "workspaceId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SermonNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SermonNote_cuid_key" ON "SermonNote"("cuid");

-- AddForeignKey
ALTER TABLE "SermonNote" ADD CONSTRAINT "SermonNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SermonNote" ADD CONSTRAINT "SermonNote_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;
