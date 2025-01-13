"use client";

import React, { useState } from "react";
import { Task, TaskStatus } from "@/types/task";
import { Workspace } from "@/types/workspace";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { InlineTaskForm } from "../task-forms/inline-task-form";
import { toast } from "@/hooks/use-toast";
import { SwipeableTaskCard } from "./swipeable-task-card";

interface KanbanBoardProps {
  tasks: Task[];
  workspaces: Workspace[];
  userId: number;
  onUpdateStatus: (taskId: number, newStatus: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onAddTask: (
    task: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
}

const columns: TaskStatus[] = ["TODO", "IN_PROGRESS", "COMPLETED"];

const getNextStatus = (currentStatus: TaskStatus): TaskStatus | null => {
  const currentIndex = columns.indexOf(currentStatus);
  return currentIndex < columns.length - 1 ? columns[currentIndex + 1] : null;
};

const getPreviousStatus = (currentStatus: TaskStatus): TaskStatus | null => {
  const currentIndex = columns.indexOf(currentStatus);
  return currentIndex > 0 ? columns[currentIndex - 1] : null;
};

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks: initialTasks,
  workspaces,
  userId,
  onUpdateStatus,
  onEditTask,
  onAddTask,
}) => {
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus | null>(null);

  const handleAddTask = (status: TaskStatus) => {
    setNewTaskStatus(status);
  };

  const handleCancelNewTask = () => {
    setNewTaskStatus(null);
  };

  const handleSubmitNewTask = async (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    await onAddTask(taskData);
    setNewTaskStatus(null);
  };

  const handleStatusUpdate = async (taskId: number, newStatus: TaskStatus) => {
    try {
      await onUpdateStatus(taskId, newStatus);
    } catch (error) {
      console.error("Error updating task status:", error);
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
    }
  };

  const handleQuickMoveToNext = async (task: Task) => {
    const nextStatus = getNextStatus(task.status);
    if (nextStatus) {
      await handleStatusUpdate(task.id!, nextStatus);
    }
  };

  const handleQuickMoveToPrevious = async (task: Task) => {
    const previousStatus = getPreviousStatus(task.status);
    if (previousStatus) {
      await handleStatusUpdate(task.id!, previousStatus);
    }
  };

  return (
    <div className="flex flex-row gap-4 overflow-x-auto snap-x snap-mandatory">
      {columns.map((status) => (
        <div
          key={status}
          className="flex-1 min-w-[85vw] sm:min-w-[300px] max-w-[500px] snap-center"
        >
          <h3 className="text-lg font-semibold mb-2">
            {status.replace("_", " ")}
          </h3>
          <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg min-h-[200px]">
            <div className="space-y-2 p-1 overflow-y-auto max-h-[420px] md:max-h-[600px] lg:max-h-[800px]">
              {initialTasks
                .filter((task) => task.status === status)
                .map((task) => (
                  <SwipeableTaskCard
                    key={task.id}
                    task={task}
                    workspace={
                      workspaces.find((w) => w.uuid === task.workspaceUuid)!
                    }
                    onUpdateStatus={(taskId, newStatus) =>
                      onUpdateStatus(taskId, newStatus)
                    }
                    onEdit={() => onEditTask(task)}
                    onQuickMove={() => handleQuickMoveToNext(task)}
                    onQuickMoveBack={() => handleQuickMoveToPrevious(task)}
                    showQuickMove={getNextStatus(task.status) !== null}
                    showQuickMoveBack={getPreviousStatus(task.status) !== null}
                  />
                ))}
            </div>
            {newTaskStatus === status ? (
              <div className="mt-4">
                <InlineTaskForm
                  onSubmit={handleSubmitNewTask}
                  onCancel={handleCancelNewTask}
                  userId={userId}
                  initialStatus={status}
                />
              </div>
            ) : (
              <Button
                onClick={() => handleAddTask(status)}
                className="w-full mt-4"
                variant="glow"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Task
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
