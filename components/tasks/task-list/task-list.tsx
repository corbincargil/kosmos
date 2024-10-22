import React, { useState, useCallback, useEffect, useMemo } from "react";
import { TaskStatus } from "@/types/task";
import { useToast } from "@/hooks/use-toast";
import { TaskListProps } from "./types";
import { sortTasks } from "./utils";
import { SwipeableTaskCard } from "./swipeable-task-card";

const TaskList: React.FC<TaskListProps> = ({
  tasks: initialTasks,
  workspaces,
}) => {
  const [tasks, setTasks] = useState(initialTasks);
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
            />
          );
        })}
      </div>
    </div>
  );
};

export default TaskList;
