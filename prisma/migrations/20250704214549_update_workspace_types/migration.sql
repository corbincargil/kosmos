/*
  Warnings:

  - The values [DEV,FAMILY,FITNESS,PERSONAL] on the enum `WorkspaceType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "WorkspaceType_new" AS ENUM ('BLOG', 'DEFAULT', 'DEVELOPMENT', 'FAITH', 'FINANCE', 'HEALTH', 'SCHOOL', 'WORK');
ALTER TABLE "Workspace" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Workspace" ALTER COLUMN "type" TYPE "WorkspaceType_new" USING ("type"::text::"WorkspaceType_new");
ALTER TYPE "WorkspaceType" RENAME TO "WorkspaceType_old";
ALTER TYPE "WorkspaceType_new" RENAME TO "WorkspaceType";
DROP TYPE "WorkspaceType_old";
ALTER TABLE "Workspace" ALTER COLUMN "type" SET DEFAULT 'DEFAULT';
COMMIT;
