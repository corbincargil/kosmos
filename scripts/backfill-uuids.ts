import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

async function backfillUuids() {
  try {
    // Get all workspaces with their tasks
    const workspaces = await prisma.workspace.findMany({
      //   where: {
      //     userId: 1,
      //   },
      include: {
        tasks: true,
      },
    });

    console.log(`Found ${workspaces.length} workspaces to process`);

    // Update tasks for each workspace
    for (const workspace of workspaces) {
      // Update all tasks for this workspace to use the workspace's UUID
      await prisma.note.updateMany({
        where: { workspaceId: workspace.id },
        data: { workspaceUuid: workspace.uuid },
      });
    }

    console.log("Successfully updated all tasks to use workspace UUIDs");
  } catch (error) {
    console.error("Error updating task workspaceIds:", error);
  } finally {
    await prisma.$disconnect();
  }
}

backfillUuids();
