"use client";

import { TaskPriority, TaskStatus } from "@prisma/client";
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
  TagIcon,
  Bug,
} from "lucide-react";
import { useWorkspace } from "@/contexts/workspace-context";
import { TaskConfirmDeleteModal } from "./task-confirm-delete-modal";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { toast } from "@/hooks/use-toast";
import RichTextEditor from "@/app/(authenticated)/_components/rich-text-editor";
import { TagSelect } from "@/app/(authenticated)/_components/forms/tag-input";
import { TaskTypeSelect } from "@/app/(authenticated)/_components/forms/task-type-select";

type TaskFormProps = {
  taskId?: string;
  onCancel?: () => void;
};

export const TaskForm: React.FC<TaskFormProps> = ({ taskId, onCancel }) => {
  const { workspaces, selectedWorkspace } = useWorkspace();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "TODO" as TaskStatus,
    priority: "" as TaskPriority | "",
    workspaceUuid: selectedWorkspace,
    tags: [] as number[],
    taskTypeId: null as number | null,
  });
  const [task, setTask] = useState<{
    id: number;
    uuid: string;
    status: TaskStatus;
    userId: number;
    title: string;
    description: string | null;
    dueDate: Date | null;
    priority: TaskPriority | null;
    workspaceUuid: string;
    tags: { autoId: number }[];
    taskTypeId: number | null;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);
  const router = useRouter();

  const utils = api.useUtils();

  const { data: taskData } = api.tasks.getTaskByUuid.useQuery(
    { uuid: taskId || "" },
    { enabled: !!taskId }
  );

  const updateTaskMutation = api.tasks.updateTask.useMutation({
    onSuccess: async () => {
      toast({
        title: "Success",
        description: "Task updated successfully",
        variant: "success",
      });
      utils.tasks.invalidate();
      router.back();
    },
    onError: (error) => {
      console.log("Error updating task:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const createTaskMutation = api.tasks.createTask.useMutation({
    onSuccess: async () => {
      toast({
        title: "Success",
        description: "Task created successfully",
        variant: "success",
      });
      utils.tasks.invalidate();
      router.back();
    },
    onError: (error) => {
      console.log("Error creating task:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (taskData) {
      setTask(taskData);
    }
  }, [taskData]);

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
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().split("T")[0]
          : "",
        status: task.status,
        priority: task.priority || "",
        workspaceUuid: task.workspaceUuid,
        tags: task.tags.map((tag) => tag.autoId),
        taskTypeId: task.taskTypeId,
      });
    }
  }, [task]);

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

  const handleTagChange = (tagIds: number[]) => {
    setFormData((prev) => ({
      ...prev,
      tags: tagIds,
    }));
  };

  const handleTaskTypeChange = (taskTypeId: number | null) => {
    setFormData((prev) => ({
      ...prev,
      taskTypeId,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (task) {
      updateTaskMutation.mutate({
        ...formData,
        id: task?.id,
        uuid: task?.uuid,
        priority: formData.priority || null,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
        workspaceUuid: formData.workspaceUuid,
        tags: formData.tags,
        taskTypeId: formData.taskTypeId,
      });
    } else {
      createTaskMutation.mutate({
        ...formData,
        priority: formData.priority || null,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
        workspaceUuid: formData.workspaceUuid,
        tags: formData.tags,
        taskTypeId: formData.taskTypeId,
      });
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="sm:max-w-7xl sm:p-4 max-w-[96vw] max-h-[90vh] p-2 space-y-4 bg-white dark:bg-gray-800 rounded-md shadow-sm overflow-y-auto"
      tabIndex={-1}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
        <div className="w-full lg:w-2/3 space-y-4">
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
            <div className="h-[30vh] sm:h-[40vh] overflow-y-auto ring-1 ring-gray-300 dark:ring-gray-600 rounded-md">
              <RichTextEditor
                content={formData.description}
                onChange={(value) =>
                  setFormData({ ...formData, description: value })
                }
                className="h-full"
              />
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/3 space-y-4 bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Warehouse
                size={16}
                className="text-gray-600 dark:text-gray-400"
              />
              <label
                htmlFor="workspaceUuid"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Workspace
              </label>
            </div>
            <select
              id="workspaceUuid"
              name="workspaceUuid"
              value={formData.workspaceUuid}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">Select a workspace</option>
              {workspaces.map((workspace) => (
                <option key={workspace.uuid} value={workspace.uuid}>
                  {workspace.name}
                </option>
              ))}
            </select>
          </div>
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
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TagIcon size={16} className="text-gray-600 dark:text-gray-400" />
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Tags
              </label>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <TagSelect
                value={formData.tags}
                onChange={handleTagChange}
                workspaceUuid={selectedWorkspace}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Bug size={16} className="text-gray-600 dark:text-gray-400" />
              <label
                htmlFor="taskTypeId"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Task Type
              </label>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <TaskTypeSelect
                value={formData.taskTypeId}
                onChange={handleTaskTypeChange}
                workspaceUuid={selectedWorkspace}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          {task && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => setShowDeleteModal(true)}
              className="w-full sm:w-auto"
            >
              <Trash2 size={20} />
            </Button>
          )}
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
          {onCancel && (
            <Button
              type="button"
              variant="glow"
              onClick={onCancel}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting}
            className={`w-full sm:w-auto px-6 py-2 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting
              ? "Submitting..."
              : task
              ? "Update Task"
              : "Create Task"}
          </Button>
        </div>
      </div>
      <TaskConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          router.back();
        }}
        recordId={task?.id || 0}
      />
    </form>
  );
};
