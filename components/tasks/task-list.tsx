import React, { useState, useCallback, useEffect, useMemo } from "react";
import { CreateTaskForm } from "./create-task-form";
import { Task, TaskStatus } from "@/types/task";
import { useToast } from "@/hooks/use-toast";
import { TaskListProps } from "./types";
import { sortTasks } from "./utils";
import { SwipeableTaskCard } from "./swipeable-task-card";

const TaskList: React.FC<TaskListProps> = ({
  tasks: initialTasks,
  userId,
  workspaceId,
  workspaces,
  onTaskCreated,
}) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const sortedTasks = useMemo(() => sortTasks([...tasks]), [tasks]);

  const handleCreateTask = async (newTaskData: Task) => {
    const tempId = Date.now();
    try {
      const optimisticTask = { ...newTaskData, id: tempId };
      setTasks((prevTasks) => sortTasks([...prevTasks, optimisticTask]));

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTaskData),
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      const createdTask = await response.json();

      setTasks((prevTasks) =>
        sortTasks(
          prevTasks.map((task) => (task.id === tempId ? createdTask : task))
        )
      );

      setShowCreateForm(false);
      toast({
        title: "Success",
        description: "Task created successfully",
      });
      onTaskCreated(createdTask);
    } catch (error) {
      console.error("Error creating task:", error);
      setTasks((prevTasks) =>
        sortTasks(prevTasks.filter((task) => task.id !== tempId))
      );
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    }
  };

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
      <button onClick={() => setShowCreateForm(!showCreateForm)}>
        {showCreateForm ? "Cancel" : "Create New Task"}
      </button>
      {showCreateForm && (
        <CreateTaskForm
          onSubmit={handleCreateTask}
          userId={userId}
          workspaceId={workspaceId}
          workspaces={workspaces}
        />
      )}
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
