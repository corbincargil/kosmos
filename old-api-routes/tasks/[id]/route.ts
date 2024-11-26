import { NextRequest, NextResponse } from "next/server";
import { TaskController } from "../../../../controllers/task-controller";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const taskId = parseInt(params.id, 10);
  if (isNaN(taskId)) {
    return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
  }
  return TaskController.editTask(req, taskId);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const taskId = parseInt(params.id, 10);
  if (isNaN(taskId)) {
    return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
  }
  return TaskController.deleteTask(req);
}
