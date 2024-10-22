import { Task, TaskPriority, TaskStatus } from "@/types/task";
import { Workspace } from "@/types/workspace";
import React, { useState, useEffect } from "react";
import {
  Pencil,
  Text,
  Calendar,
  Loader,
  Flag,
  Trash2,
  Warehouse,
} from "lucide-react";

type TaskFormProps = {
  onSubmit: (
    data: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  userId: number;
  workspaceId?: number;
  workspaces: Workspace[];
  task?: Task;
  onDelete?: () => void;
  isEditing?: boolean;
};

export const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  userId,
  workspaceId,
  workspaces,
  task,
  onDelete,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "TODO" as TaskStatus,
    priority: "" as TaskPriority | "",
    workspaceId: workspaceId || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task && isEditing) {
      setFormData({
        title: task.title,
        description: task.description || "",
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().split("T")[0]
          : "",
        status: task.status,
        priority: task.priority || "",
        workspaceId: task.workspaceId.toString(),
      });
    }
  }, [task, isEditing]);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const taskData: Omit<Task, "id" | "createdAt" | "updatedAt"> = {
      ...formData,
      userId,
      priority: formData.priority || null,
      workspaceId: Number(formData.workspaceId),
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
    };

    try {
      await onSubmit(taskData);
    } catch (error) {
      console.error("Error submitting task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="sm:max-w-4xl sm:p-4 max-w-[96vw] p-2 space-y-2"
    >
      <div className="md:flex md:space-x-4">
        <div className="md:w-2/3 space-y-2">
          <div>
            <div className="flex items-center gap-2">
              <Pencil size={16} />
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
            </div>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={100}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Text size={16} />
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
            </div>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              maxLength={400}
              rows={window.innerWidth <= 640 ? 6 : 10}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="md:w-1/3 space-y-2">
          {!workspaceId || isEditing ? (
            <div>
              <div className="flex items-center gap-2">
                <Warehouse size={16} />
                <label
                  htmlFor="workspaceId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Workspace
                </label>
              </div>
              <select
                id="workspaceId"
                name="workspaceId"
                value={formData.workspaceId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a workspace</option>
                {workspaces.map((workspace) => (
                  <option key={workspace.id} value={workspace.id}>
                    {workspace.name}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          <div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <label
                htmlFor="dueDate"
                className="block text-sm font-medium text-gray-700"
              >
                Due Date
              </label>
            </div>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              placeholder="Due Date"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Loader size={16} />
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700"
              >
                Status
              </label>
            </div>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Flag size={16} />
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-700"
              >
                Priority
              </label>
            </div>
            <select
              id="priority"
              name="priority"
              value={formData.priority || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
              <option value="">No Priority</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting
            ? "Submitting..."
            : isEditing
            ? "Update Task"
            : "Create Task"}
        </button>

        {isEditing && onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="px-4 py-2 text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-300"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>
    </form>
  );
};
