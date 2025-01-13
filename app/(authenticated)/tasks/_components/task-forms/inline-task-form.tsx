import React, { useState, useEffect, useCallback } from "react";
import { Task, TaskPriority, TaskStatus } from "@/types/task";
import { X, Check } from "lucide-react";
import { useWorkspace } from "@/contexts/workspace-context";
import { Button } from "@/components/ui/button";

type InlineTaskFormProps = {
  onSubmit: (
    data: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  onCancel: () => void;
  userId: number;
  initialStatus: TaskStatus;
};

export const InlineTaskForm: React.FC<InlineTaskFormProps> = ({
  onSubmit,
  onCancel,
  userId,
  initialStatus,
}) => {
  const { workspaces, selectedWorkspace } = useWorkspace();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: initialStatus,
    priority: "" as TaskPriority | "",
    workspaceUuid: selectedWorkspace === "all" ? "" : selectedWorkspace,
  });

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      status: initialStatus,
      workspaceUuid: selectedWorkspace === "all" ? "" : selectedWorkspace,
    }));
  }, [initialStatus, selectedWorkspace]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const taskData: Omit<Task, "id" | "createdAt" | "updatedAt"> = {
        ...formData,
        userId,
        priority: formData.priority || null,
        workspaceUuid: selectedWorkspace,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
      };
      await onSubmit(taskData);
    },
    [onSubmit, formData, userId, selectedWorkspace]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      } else if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
      }
    },
    [onCancel, handleSubmit]
  );

  const getPriorityColor = (priority: string | undefined) => {
    switch (priority?.toLowerCase()) {
      case "low":
        return "text-blue-500 dark:text-blue-400";
      case "medium":
        return "text-orange-500 dark:text-orange-400";
      case "high":
        return "text-red-500 dark:text-red-400";
      default:
        return "";
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-sm overflow-hidden"
    >
      <div className="p-3 pl-4 flex flex-col h-full">
        <div className="flex justify-between items-start mb-1">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Task title"
            required
            autoFocus
            className="w-full text-base font-semibold focus:outline-none bg-transparent dark:text-gray-100"
          />
        </div>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Task description"
          className="text-sm text-gray-600 dark:text-gray-300 w-full resize-none focus:outline-none bg-transparent"
          rows={2}
        />
        <div className="flex justify-between items-center mt-2">
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="text-xs text-gray-500 dark:text-gray-400 focus:outline-none bg-transparent"
          />
          {selectedWorkspace === "all" && (
            <select
              name="workspaceUuid"
              value={formData.workspaceUuid}
              onChange={handleChange}
              required
              className="text-xs font-medium focus:outline-none bg-transparent dark:text-gray-300"
            >
              <option value="">Select workspace</option>
              {workspaces.map((workspace) => (
                <option key={workspace.id} value={workspace.id}>
                  {workspace.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="flex justify-between items-center mt-2">
          <select
            name="priority"
            value={formData.priority || ""}
            onChange={handleChange}
            className={`text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded bg-transparent dark:text-gray-300 ${
              formData.priority ? getPriorityColor(formData.priority) : ""
            }`}
          >
            <option value="">No Priority</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="ghost"
              className="hover:bg-secondary hover:text-secondary-foreground dark:hover:bg-gray-700 dark:hover:text-gray-100"
              onClick={onCancel}
            >
              <X size={16} />
            </Button>
            <Button
              type="submit"
              variant="ghost"
              className="hover:bg-secondary hover:text-secondary-foreground dark:hover:bg-gray-700 dark:hover:text-gray-100"
            >
              <Check size={16} />
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};
