import React, { useState } from "react";
import { CreateTaskForm } from "./create-task-form";
import { Task } from "@/types/task";
import dayjs from "dayjs";

interface TaskListProps {
  tasks: Task[];
  userId: number;
  workspaceId: number;
  onTaskCreated: () => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  userId,
  workspaceId,
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
        />
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
        {tasks.map((task) => (
          <div key={task.id} className="border p-4 rounded">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            <p>Priority: {task.priority}</p>
            {task.dueDate && (
              <p>Due: {dayjs(task.dueDate).format("MM/DD/YYYY")}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
