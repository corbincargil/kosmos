import React, { useState, useCallback, useEffect, useMemo } from "react";
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
  onTaskCreated: (task: Task) => void;
}

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

  // Sorting function
  const sortTasks = useCallback((tasksToSort: Task[]) => {
    return tasksToSort.sort((a, b) => {
      // First, sort by status
      const statusOrder = { TODO: 0, IN_PROGRESS: 1, COMPLETED: 2 };
      const statusDiff = statusOrder[a.status] - statusOrder[b.status];
      if (statusDiff !== 0) return statusDiff;

      // If status is the same, sort by priority
      const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      const priorityDiff =
        (priorityOrder[a.priority || "LOW"] || 2) -
        (priorityOrder[b.priority || "LOW"] || 2);
      if (priorityDiff !== 0) return priorityDiff;

      // If priority is the same, sort by due date
      const dateA = a.dueDate
        ? new Date(a.dueDate)
        : new Date(8640000000000000);
      const dateB = b.dueDate
        ? new Date(b.dueDate)
        : new Date(8640000000000000);
      return dateA.getTime() - dateB.getTime();
    });
  }, []);

  // Memoized sorted tasks
  const sortedTasks = useMemo(() => sortTasks([...tasks]), [tasks, sortTasks]);

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
    async (taskId: number, newStatus: string) => {
      try {
        // Optimistic update
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  status: newStatus as "TODO" | "IN_PROGRESS" | "COMPLETED",
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
        // Revert the optimistic update
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
              onUpdateStatus={handleUpdateStatus}
            />
          );
        })}
      </div>
    </div>
  );
};

interface SwipeableTaskCardProps {
  task: Task;
  workspace: Workspace;
  onUpdateStatus: (taskId: number, newStatus: string) => void;
}

const SwipeableTaskCard: React.FC<SwipeableTaskCardProps> = ({
  task,
  workspace,
  onUpdateStatus,
}) => {
  const [offset, setOffset] = useState(0);

  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      if (task.status !== "COMPLETED" && eventData.deltaX > 0) {
        setOffset(Math.min(eventData.deltaX, 200));
      }
    },
    onSwiped: (eventData) => {
      if (task.status !== "COMPLETED" && eventData.deltaX > 150) {
        const newStatus = task.status === "TODO" ? "IN_PROGRESS" : "COMPLETED";
        onUpdateStatus(task.id!, newStatus);
      }
      setOffset(0);
    },
  });

  const isCompleted = task.status === "COMPLETED";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-500";
      case "IN_PROGRESS":
        return "bg-blue-500";
      default:
        return "bg-yellow-500";
    }
  };

  const getSwipeText = (status: string) => {
    switch (status) {
      case "TODO":
        return "In-Progress";
      case "IN_PROGRESS":
        return "Completed";
      default:
        return "";
    }
  };

  return (
    <div
      {...handlers}
      className="relative w-full pb-[45%] rounded-md overflow-hidden"
      style={{ touchAction: "pan-y" }}
    >
      <div
        className={`absolute inset-0 flex flex-col items-left justify-center px-4 text-white ${
          task.status === "TODO" ? "bg-blue-500" : "bg-green-500"
        }`}
      >
        <p>Mark</p>
        {getSwipeText(task.status)}
      </div>
      <div
        className="absolute inset-0 bg-white border rounded-md shadow-sm transition-all hover:shadow-md overflow-hidden"
        style={{
          transform: `translateX(${offset}px)`,
          transition: offset === 0 ? "transform 0.2s ease-out" : "none",
        }}
      >
        <div
          className={`absolute left-0 top-0 bottom-0 w-1 ${getStatusColor(
            task.status
          )}`}
        ></div>
        <div className="absolute inset-0 p-3 pl-4 flex flex-col">
          <div className="flex justify-between items-start mb-1">
            <div className="flex-grow min-w-0 mr-2">
              <div className="flex items-center space-x-2">
                <h3
                  className={`text-base font-semibold truncate ${
                    isCompleted ? "line-through text-gray-500" : ""
                  }`}
                >
                  {task.title}
                </h3>
              </div>
            </div>
            <span className={`text-xs font-medium text-gray-500`}>
              {task.priority}
            </span>
          </div>
          <p
            className={`text-sm text-gray-600 mb-2 line-clamp-4 ${
              isCompleted ? "line-through" : ""
            }`}
          >
            {task.description}
          </p>
          <div className="flex-grow"></div>
          <div className="flex justify-between items-center mt-2">
            <div className="flex-grow">
              {task.dueDate && (
                <p
                  className={`text-xs text-gray-500 ${
                    isCompleted ? "line-through" : ""
                  }`}
                >
                  Due: {dayjs(task.dueDate).format("MMM D")}
                </p>
              )}
            </div>
            <p
              className="text-xs font-medium ml-2 flex-shrink-0"
              style={{ color: workspace.color }}
            >
              {workspace.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
