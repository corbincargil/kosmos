/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `SermonNote` table. All the data in the column will be lost.
  - Made the column `workspaceId` on table `SermonNote` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "SermonNote" DROP CONSTRAINT "SermonNote_workspaceId_fkey";

-- AlterTable
ALTER TABLE "SermonNote" DROP COLUMN "imageUrl",
ADD COLUMN     "s3Key" TEXT,
ALTER COLUMN "workspaceId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "SermonNote" ADD CONSTRAINT "SermonNote_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
