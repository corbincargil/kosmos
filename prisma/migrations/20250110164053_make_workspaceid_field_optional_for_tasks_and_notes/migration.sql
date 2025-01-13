-- AlterTable
ALTER TABLE "Note" ALTER COLUMN "workspaceId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "workspaceId" DROP NOT NULL;
