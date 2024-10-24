import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TaskForm } from "./task-forms/create-task-form";
import { Task } from "@/types/task";
import { Workspace } from "@/types/workspace";

type EditTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  workspaces: Workspace[];
  onSubmit: (
    data: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  onDelete: (taskId: number) => Promise<void>;
};

export const EditTaskModal: React.FC<EditTaskModalProps> = ({
  isOpen,
  onClose,
  task,
  workspaces,
  onSubmit,
  onDelete,
}) => {
  const handleDelete = async () => {
    await onDelete(task.id!);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-4xl sm:p-4 max-w-[96vw] p-2"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <TaskForm
          onSubmit={onSubmit}
          userId={task.userId}
          workspaces={workspaces}
          task={task}
          isEditing={true}
          onDelete={handleDelete}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
