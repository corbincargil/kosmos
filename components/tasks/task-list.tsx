import React, { useState } from "react";
import { CreateTaskForm } from "./create-task-form";
import { Task } from "@/types/task";
import { Workspace } from "@/types/workspace";
import dayjs from "dayjs";

interface TaskListProps {
  tasks: Task[];
  userId: number;
  workspaceId?: number;
  workspaces: Workspace[];
  onTaskCreated: () => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  userId,
  workspaceId,
  workspaces,
  onTaskCreated,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateTask = async (newTaskData: Task) => {
    try {
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

      setShowCreateForm(false);
      onTaskCreated(); // Refresh the task list
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

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
          <div
            key={task.id}
            className="border p-3 rounded-md shadow-sm transition-all hover:shadow-md relative flex flex-col"
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
        ))}
      </div>
    </div>
  );
};

export default TaskList;
