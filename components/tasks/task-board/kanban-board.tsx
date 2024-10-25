"use client";

import React, { useState } from "react";
import { Task, TaskStatus } from "@/types/task";
import { Workspace } from "@/types/workspace";
import { SwipeableTaskCard } from "../task-list/swipeable-task-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { InlineTaskForm } from "../task-forms/inline-task-form";

interface KanbanBoardProps {
  tasks: Task[];
  workspaces: Workspace[];
  userId: number;
  onUpdateStatus: (taskId: number, newStatus: TaskStatus) => Promise<void>;
  onEditTask: (task: Task) => void;
  onAddTask: (
    task: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
}

const columns: TaskStatus[] = ["TODO", "IN_PROGRESS", "COMPLETED"];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
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
            <div className="space-y-2 p-1 overflow-y-auto max-h-[420px]">
              {tasks
                .filter((task) => task.status === status)
                .map((task) => (
                  <SwipeableTaskCard
                    key={task.id}
                    task={task}
                    workspace={
                      workspaces.find((w) => w.id === task.workspaceId)!
                    }
                    onUpdateStatus={(taskId, newStatus) =>
                      onUpdateStatus(taskId, newStatus as TaskStatus)
                    }
                    onEdit={() => onEditTask(task)}
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
