import { NextRequest, NextResponse } from "next/server";
import { TaskController } from "../../../controllers/task-controller";

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const taskId = parseInt(params.id, 10);
  if (isNaN(taskId)) {
    return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
  }
  return TaskController.editTask(req, taskId);
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const taskId = parseInt(params.id, 10);
  if (isNaN(taskId)) {
    return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
  }
  return TaskController.deleteTask(req);
}
