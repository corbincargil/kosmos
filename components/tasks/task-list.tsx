import React, { useState, useCallback, useEffect } from "react";
import { CreateTaskForm } from "./create-task-form";
import { Task } from "@/types/task";
import { Workspace } from "@/types/workspace";
import dayjs from "dayjs";
import { useSwipeable } from "react-swipeable";
import { useToast } from "@/hooks/use-toast";

interface TaskListProps {
  tasks: Task[];
  userId: number;
  workspaceId?: number;
  workspaces: Workspace[];
}

const TaskList: React.FC<TaskListProps> = ({
  tasks: initialTasks,
  userId,
  workspaceId,
  workspaces,
}) => {
  const [tasks, setTasks] = useState(initialTasks);
  console.log(tasks);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const handleCreateTask = async (newTaskData: Task) => {
    const tempId = Date.now(); // Temporary ID for the new task
    try {
      const optimisticTask = { ...newTaskData, id: tempId };
      setTasks((prevTasks) => [...prevTasks, optimisticTask]);

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

      // Update the task with the real ID from the server
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === tempId ? createdTask : task))
      );

      setShowCreateForm(false);
      toast({
        title: "Success",
        description: "Task created successfully",
      });
    } catch (error) {
      console.error("Error creating task:", error);
      // Revert the optimistic update
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== tempId));
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCompleteTask = useCallback(
    async (taskId: number) => {
      try {
        // Optimistic update
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId ? { ...task, status: "COMPLETED" } : task
          )
        );

        const response = await fetch(`/api/tasks/${taskId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "COMPLETED" }),
        });

        if (!response.ok) {
          throw new Error("Failed to update task");
        }

        toast({
          title: "Success",
          description: "Task marked as completed",
        });
      } catch (error) {
        console.error("Error completing task:", error);
        // Revert the optimistic update
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId ? { ...task, status: "TODO" } : task
          )
        );
        toast({
          title: "Error",
          description: "Failed to complete task. Please try again.",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  const getPriorityEmoji = (priority: string | undefined) => {
    switch (priority) {
      case "HIGH":
        return "🔴";
      case "MEDIUM":
        return "🟡";
      case "LOW":
        return "🟢";
      default:
        return "⚪️";
    }
  };

  const getWorkspaceColor = (workspaceId: number) => {
    const workspace = workspaces.find((w) => w.id === workspaceId);
    return workspace ? workspace.color : "#3B82F6"; // default color if not found
  };

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
        {tasks.map((task) => (
          <SwipeableTaskCard
            key={task.id}
            task={task}
            getWorkspaceColor={getWorkspaceColor}
            getPriorityEmoji={getPriorityEmoji}
            onComplete={handleCompleteTask}
          />
        ))}
      </div>
    </div>
  );
};

interface SwipeableTaskCardProps {
  task: Task;
  getWorkspaceColor: (workspaceId: number) => string;
  getPriorityEmoji: (priority: string | undefined) => string;
  onComplete: (taskId: number) => void;
}

const SwipeableTaskCard: React.FC<SwipeableTaskCardProps> = ({
  task,
  getWorkspaceColor,
  getPriorityEmoji,
  onComplete,
}) => {
  const [offset, setOffset] = useState(0);

  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      if (eventData.deltaX > 0) {
        setOffset(Math.min(eventData.deltaX, 200));
      }
    },
    onSwiped: (eventData) => {
      if (eventData.deltaX > 150) {
        onComplete(task.id!);
      }
      setOffset(0);
    },
  });

  return (
    <div
      {...handlers}
      className="relative overflow-hidden rounded-md"
      style={{ touchAction: "pan-y" }}
    >
      <div className="absolute inset-0 bg-green-500 flex items-center justify-end pr-4 text-white">
        Completed
      </div>
      <div
        className="relative bg-white border rounded-md shadow-sm transition-all hover:shadow-md"
        style={{
          transform: `translateX(${offset}px)`,
          transition: offset === 0 ? "transform 0.2s ease-out" : "none",
        }}
      >
        <div
          className="p-3"
          style={{
            backgroundColor: `${getWorkspaceColor(task.workspaceId)}25`,
          }}
        >
          <div className="flex justify-between items-start mb-1">
            <div className="flex-grow min-w-0 mr-2">
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-semibold truncate">
                  {task.title}
                </h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                    task.status === "COMPLETED"
                      ? "bg-green-100 text-green-800"
                      : task.status === "IN_PROGRESS"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {task.status.replace("_", " ")}
                </span>
              </div>
            </div>
            <span className="text-lg leading-none flex-shrink-0">
              {getPriorityEmoji(task.priority)}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {task.description}
          </p>
          {task.dueDate && (
            <p className="text-xs text-gray-500 mt-auto">
              Due: {dayjs(task.dueDate).format("MMM D")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskList;
