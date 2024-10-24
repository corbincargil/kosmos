import { Task, TaskPriority, TaskStatus } from "@/types/task";
import { Workspace } from "@/types/workspace";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
  onCancel?: () => void;
  userId: number;
  workspaceId?: number;
  workspaces: Workspace[];
  task?: Task;
  onDelete?: () => void;
  isEditing?: boolean;
  initialStatus?: TaskStatus;
};

export const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  onCancel,
  userId,
  workspaceId,
  workspaces,
  task,
  onDelete,
  isEditing = false,
  initialStatus,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: initialStatus || ("TODO" as TaskStatus),
    priority: "" as TaskPriority | "",
    workspaceId: workspaceId || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      const form = document.querySelector("form");
      if (form) {
        e.preventDefault();
        form.requestSubmit();
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.focus();
    }
  }, []);

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
      ref={formRef}
      onSubmit={handleSubmit}
      className="sm:max-w-4xl sm:p-4 max-w-[96vw] p-2 space-y-2 bg-white dark:bg-gray-800 rounded-md shadow-sm"
      tabIndex={-1}
    >
      <div className="md:flex md:space-x-4">
        <div className="md:w-2/3 space-y-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Pencil size={16} className="text-gray-600 dark:text-gray-400" />
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
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
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <Text size={16} className="text-gray-600 dark:text-gray-400" />
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
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
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        <div className="md:w-1/3 space-y-4 bg-gray-100 dark:bg-gray-700 p-1 rounded-md">
          {!workspaceId || isEditing ? (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Warehouse
                  size={16}
                  className="text-gray-600 dark:text-gray-400"
                />
                <label
                  htmlFor="workspaceId"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
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
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
            <div className="flex items-center gap-2 mb-1">
              <Calendar
                size={16}
                className="text-gray-600 dark:text-gray-400"
              />
              <label
                htmlFor="dueDate"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
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
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flag size={16} className="text-gray-600 dark:text-gray-400" />
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Priority
              </label>
            </div>
            <select
              id="priority"
              name="priority"
              value={formData.priority || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
              <option value="">No Priority</option>
            </select>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <Loader size={16} className="text-gray-600 dark:text-gray-400" />
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Status
              </label>
            </div>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <div>
          {isEditing && onDelete && (
            <Button type="button" variant="destructive" onClick={onDelete}>
              <Trash2 size={20} />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-4">
          {onCancel && (
            <Button type="button" variant="glow" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting
              ? "Submitting..."
              : isEditing
              ? "Update Task"
              : "Create Task"}
          </Button>
        </div>
      </div>
    </form>
  );
};
