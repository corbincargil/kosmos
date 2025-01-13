/*
  Warnings:

  - Made the column `workspaceUuid` on table `Task` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_workspaceId_fkey";

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "workspaceUuid" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_workspaceUuid_fkey" FOREIGN KEY ("workspaceUuid") REFERENCES "Workspace"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
