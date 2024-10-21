import { Task, TaskPriority, TaskStatus } from "@/types/task";
import React, { useState } from "react";

type CreateTaskFormProps = {
  onSubmit: (data: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  userId: number;
  workspaceId: number;
};

export const CreateTaskForm: React.FC<CreateTaskFormProps> = ({
  onSubmit,
  userId,
  workspaceId,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "TODO" as TaskStatus,
    priority: "MEDIUM" as TaskPriority,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const taskData: Omit<Task, "id" | "createdAt" | "updatedAt"> = {
      ...formData,
      userId,
      workspaceId,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
    };
    onSubmit(taskData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          maxLength={100}
        />
      </div>

      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          maxLength={255}
        />
      </div>

      <div>
        <label htmlFor="dueDate">Due Date:</label>
        <input
          type="date"
          id="dueDate"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="status">Status:</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      <div>
        <label htmlFor="priority">Priority:</label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>

      <button type="submit">Create Task</button>
    </form>
  );
};
