/*
  Warnings:

  - Made the column `uuid` on table `Task` required. This step will fail if there are existing NULL values in that column.
  - Made the column `uuid` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `uuid` on table `Workspace` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "uuid" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "uuid" SET NOT NULL;

-- AlterTable
ALTER TABLE "Workspace" ALTER COLUMN "uuid" SET NOT NULL;
