import { NextRequest } from "next/server";
import { TaskController } from "../../../controllers/task-controller";

export async function POST(req: NextRequest) {
  return TaskController.createTask(req);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("workspaceId");

  if (workspaceId) {
    return TaskController.getTasksByWorkspaceId(req);
  } else {
    return TaskController.getTasksByUser(req);
  }
}

export async function PUT(req: NextRequest) {
  return TaskController.editTask(req);
}

export async function DELETE(req: NextRequest) {
  return TaskController.deleteTask(req);
}
