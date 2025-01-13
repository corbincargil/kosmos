/*
  Warnings:

  - Made the column `workspaceUuid` on table `Note` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_workspaceId_fkey";

-- AlterTable
ALTER TABLE "Note" ALTER COLUMN "workspaceUuid" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_workspaceUuid_fkey" FOREIGN KEY ("workspaceUuid") REFERENCES "Workspace"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
