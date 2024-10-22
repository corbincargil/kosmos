import React, { useState, useCallback, useEffect, useMemo } from "react";
import { TaskStatus, Task } from "@/types/task";
import { useToast } from "@/hooks/use-toast";
import { TaskListProps } from "./types";
import { sortTasks } from "./utils";
import { SwipeableTaskCard } from "./swipeable-task-card";
import { EditTaskModal } from "../edit-task-modal";

const TaskList: React.FC<TaskListProps> = ({
  tasks: initialTasks,
  workspaces,
}) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const sortedTasks = useMemo(() => sortTasks([...tasks]), [tasks]);

  const handleUpdateStatus = useCallback(
    async (taskId: number, newStatus: TaskStatus) => {
      try {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  status: newStatus,
                }
              : task
          )
        );

        const response = await fetch(`/api/tasks/${taskId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        });

        if (!response.ok) {
          throw new Error("Failed to update task status");
        }

        toast({
          title: "Success",
          description: `Task marked as ${newStatus
            .toLowerCase()
            .replace("_", " ")}`,
        });
      } catch (error) {
        console.error("Error updating task status:", error);
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId ? { ...task, status: task.status } : task
          )
        );
        toast({
          title: "Error",
          description: "Failed to update task status. Please try again.",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  const handleEditTask = useCallback(
    async (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
      if (!editingTask) return;

      try {
        const response = await fetch(`/api/tasks/${editingTask.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(taskData),
        });

        if (!response.ok) {
          throw new Error("Failed to update task");
        }

        const updatedTask = await response.json();

        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === editingTask.id ? updatedTask : task
          )
        );

        setEditingTask(null);

        toast({
          title: "Success",
          description: "Task updated successfully",
        });
      } catch (error) {
        console.error("Error updating task:", error);
        toast({
          title: "Error",
          description: "Failed to update task. Please try again.",
          variant: "destructive",
        });
        throw error; // Re-throw the error so the form knows the submission failed
      }
    },
    [editingTask, toast]
  );

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mt-4">
        {sortedTasks.map((task) => {
          const taskWorkspace = workspaces.find(
            (w) => w.id === task.workspaceId
          );
          return (
            <SwipeableTaskCard
              key={task.id}
              task={task}
              workspace={taskWorkspace!}
              onUpdateStatus={(taskId: number, newStatus: string) =>
                handleUpdateStatus(taskId, newStatus as TaskStatus)
              }
              onEdit={() => setEditingTask(task)}
            />
          );
        })}
      </div>
      {editingTask && (
        <EditTaskModal
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          task={editingTask}
          workspaces={workspaces}
          onSubmit={handleEditTask}
        />
      )}
    </div>
  );
};

export default TaskList;
