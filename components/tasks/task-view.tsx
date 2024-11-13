"use client";

import React, { useState } from "react";
import { Task, TaskStatus } from "@/types/task";
import { Workspace } from "@/types/workspace";
import { KanbanBoard } from "./task-board/kanban-board";
import { TaskViewToggle } from "./task-view-toggle";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TaskForm } from "./task-forms/create-task-form";
import { EditTaskModal } from "./task-forms/edit-task-modal";
import { TaskAccordion } from "./task-list/task-accordion";
import { useSearchParams, useRouter } from "next/navigation";

interface TaskViewProps {
  tasks: Task[];
  workspaces: Workspace[];
  userId: number;
  onTasksChanged: () => Promise<void>;
}

export const TaskView: React.FC<TaskViewProps> = ({
  tasks,
  workspaces,
  userId,
  onTasksChanged,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultView = (searchParams.get("view") as "list" | "board") || "list";
  const [viewMode, setViewMode] = useState<"list" | "board">(defaultView);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { toast } = useToast();

  const handleAddTask = async (
    data: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await onTasksChanged();
        setIsDialogOpen(false);
        toast({
          title: "Success",
          description: "Task created successfully",
          variant: "success",
        });
      } else {
        throw new Error("Failed to create task");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    }
  };

  const handleEditTask = async (taskData: Partial<Task>) => {
    if (!editingTask) {
      console.error("No task is currently being edited");
      return;
    }

    try {
      const response = await fetch(`/api/tasks/${editingTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editingTask, ...taskData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(
          `Failed to update task: ${errorData.message || response.statusText}`
        );
      }

      await onTasksChanged();
      setEditingTask(null);
      toast({
        title: "Success",
        description: "Task updated successfully",
        variant: "success",
      });
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStatus = async (taskId: number, newStatus: TaskStatus) => {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (response.ok) {
      await onTasksChanged();
      toast({
        title: "Success",
        description: `Task status updated to ${newStatus}`,
        variant: "success",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await onTasksChanged();
        setEditingTask(null);
        toast({
          title: "Success",
          description: "Task deleted successfully",
          variant: "success",
        });
      } else {
        throw new Error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  const handleViewChange = (newView: "list" | "board") => {
    const params = new URLSearchParams(searchParams);
    params.set("view", newView);
    router.push(`?${params.toString()}`);
    setViewMode(newView);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <TaskViewToggle viewMode={viewMode} onToggle={handleViewChange} />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="glow">Create New Task</Button>
          </DialogTrigger>
          <DialogContent
            className="sm:max-w-4xl sm:p-4 max-w-[96vw] p-2"
            aria-describedby="task-dialog"
          >
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <DialogDescription></DialogDescription>
            <div className="max-h-[80vh] overflow-y-auto">
              <TaskForm
                onSubmit={handleAddTask}
                userId={userId}
                workspaces={workspaces}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {tasks.length === 0 && <p>You have no tasks yet.</p>}
      {tasks.length > 0 && viewMode === "list" && (
        <TaskAccordion
          tasks={tasks}
          workspaces={workspaces}
          userId={userId}
          onUpdateStatus={handleUpdateStatus}
          onEdit={setEditingTask}
          onAddTask={handleAddTask}
          onDeleteTask={handleDeleteTask}
        />
      )}
      {tasks.length > 0 && viewMode === "board" && (
        <KanbanBoard
          tasks={tasks}
          workspaces={workspaces}
          userId={userId}
          onUpdateStatus={handleUpdateStatus}
          onEditTask={setEditingTask}
          onAddTask={handleAddTask}
        />
      )}
      {editingTask && (
        <EditTaskModal
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          task={editingTask}
          workspaces={workspaces}
          onSubmit={handleEditTask}
          onDelete={handleDeleteTask}
        />
      )}
    </div>
  );
};
