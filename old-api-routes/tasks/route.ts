import { NextRequest, NextResponse } from "next/server";
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

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const taskId = parseInt(params.id, 10);
  if (isNaN(taskId)) {
    return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
  }
  return TaskController.editTask(req, taskId);
}

export async function DELETE(req: NextRequest) {
  return TaskController.deleteTask(req);
}
