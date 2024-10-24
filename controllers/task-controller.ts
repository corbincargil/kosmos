import { NextRequest, NextResponse } from "next/server";
import { TaskService } from "../services/task-service";
import { TaskSchema } from "../types/task";

export const TaskController = {
  getTasksByWorkspaceId: async (req: NextRequest) => {
    try {
      const { searchParams } = new URL(req.url);
      const workspaceId = searchParams.get("workspaceId");

      if (!workspaceId) {
        return NextResponse.json(
          { error: "Workspace ID is required" },
          { status: 400 }
        );
      }

      const tasks = await TaskService.getTasksByWorkspaceId(
        Number(workspaceId)
      );
      return NextResponse.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return NextResponse.json(
        { error: "Failed to fetch tasks" },
        { status: 500 }
      );
    }
  },

  getTasksByUser: async (req: NextRequest) => {
    try {
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get("userId");

      if (!userId) {
        return NextResponse.json(
          { error: "User ID is required" },
          { status: 400 }
        );
      }

      const tasks = await TaskService.getTasksByUserId(Number(userId));
      return NextResponse.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks for user:", error);
      return NextResponse.json(
        { error: "Failed to fetch tasks for user" },
        { status: 500 }
      );
    }
  },

  createTask: async (req: NextRequest) => {
    try {
      const taskData = await req.json();
      const validatedData = TaskSchema.omit({
        id: true,
        createdAt: true,
        updatedAt: true,
      }).parse(taskData);

      if (!validatedData.userId) {
        throw new Error("User ID is required");
      }

      const task = await TaskService.createTask(
        validatedData.title,
        validatedData.userId,
        validatedData.workspaceId,
        validatedData.description,
        validatedData.dueDate,
        validatedData.status,
        validatedData.priority ?? undefined
      );
      return NextResponse.json(task, { status: 201 });
    } catch (error) {
      console.error("Error creating task:", error);
      return NextResponse.json(
        { error: "Failed to create task", details: error },
        { status: 500 }
      );
    }
  },

  editTask: async (req: NextRequest, taskId: number) => {
    try {
      const taskData = await req.json();
      const validatedData = TaskSchema.partial().parse(taskData);

      if (validatedData.priority == null) {
        validatedData.priority = null;
      }

      const task = await TaskService.editTask(
        taskId,
        validatedData.title,
        validatedData.description,
        validatedData.dueDate,
        validatedData.status,
        validatedData.priority,
        validatedData.workspaceId
      );
      return NextResponse.json(task);
    } catch (error) {
      console.error("Error editing task:", error);
      return NextResponse.json(
        { error: "Failed to edit task" },
        { status: 500 }
      );
    }
  },

  deleteTask: async (req: NextRequest) => {
    try {
      const id = Number(req.url.split("/").pop());
      if (isNaN(id)) {
        return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
      }
      await TaskService.deleteTask(id);
      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
      console.error("Error deleting task:", error);
      return NextResponse.json(
        { error: "Failed to delete task" },
        { status: 500 }
      );
    }
  },
};
