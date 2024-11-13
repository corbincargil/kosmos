"use client";

import React, { useState, useEffect } from "react";
import { Task, TaskStatus } from "@/types/task";
import { Workspace } from "@/types/workspace";
import { SwipeableTaskCard } from "../task-list/swipeable-task-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { InlineTaskForm } from "../task-forms/inline-task-form";
import { toast } from "@/hooks/use-toast";

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
  const [tasks, setTasks] = useState(initialTasks);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

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
    const taskToUpdate = tasks.find((t) => t.id === taskId);
    if (!taskToUpdate) return;

    const previousTasks = [...tasks];

    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );

    try {
      await onUpdateStatus(taskId, newStatus);
    } catch (error) {
      console.error("Error updating task status:", error);
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
      setTasks(previousTasks);
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
              {tasks
                .filter((task) => task.status === status)
                .map((task) => (
                  <SwipeableTaskCard
                    key={task.id}
                    task={task}
                    workspace={
                      workspaces.find((w) => w.id === task.workspaceId)!
                    }
                    onUpdateStatus={handleStatusUpdate}
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
