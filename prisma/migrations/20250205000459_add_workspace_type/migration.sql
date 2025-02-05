-- CreateEnum
CREATE TYPE "WorkspaceType" AS ENUM ('DEFAULT', 'DEV', 'FAITH', 'FAMILY', 'FITNESS', 'PERSONAL', 'SCHOOL', 'WORK');

-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "type" "WorkspaceType" NOT NULL DEFAULT 'DEFAULT';
