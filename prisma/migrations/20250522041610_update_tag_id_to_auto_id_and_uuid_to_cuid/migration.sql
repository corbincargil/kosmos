/*
  Warnings:

  - The primary key for the `TaskType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `TaskType` table. All the data in the column will be lost.
  - You are about to drop the column `uuid` on the `TaskType` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cuid]` on the table `TaskType` will be added. If there are existing duplicate values, this will fail.
  - The required column `cuid` was added to the `TaskType` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_taskTypeId_fkey";

-- DropIndex
DROP INDEX "TaskType_uuid_key";

-- AlterTable
ALTER TABLE "TaskType" DROP CONSTRAINT "TaskType_pkey",
DROP COLUMN "id",
DROP COLUMN "uuid",
ADD COLUMN     "autoId" SERIAL NOT NULL,
ADD COLUMN     "cuid" TEXT NOT NULL,
ADD CONSTRAINT "TaskType_pkey" PRIMARY KEY ("autoId");

-- CreateIndex
CREATE UNIQUE INDEX "TaskType_cuid_key" ON "TaskType"("cuid");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_taskTypeId_fkey" FOREIGN KEY ("taskTypeId") REFERENCES "TaskType"("autoId") ON DELETE SET NULL ON UPDATE CASCADE;
