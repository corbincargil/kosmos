import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TaskForm } from "./create-task-form";
import { Task } from "@/types/task";
import { Workspace } from "@/types/workspace";

type EditTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  workspaces: Workspace[];
  onSubmit: (data: Task) => Promise<void>;
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
  const handleSubmit = async (data: Omit<Task, "createdAt">) => {
    console.log("task", task.id);
    console.log("data", data);
    await onSubmit(data);
    onClose();
  };

  const handleDelete = async () => {
    await onDelete(task.id!);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-4xl sm:p-4 max-w-[96vw] p-2"
        aria-describedby="task-dialog-description"
      >
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription id="task-dialog-description"></DialogDescription>
        </DialogHeader>
        <TaskForm
          onSubmit={handleSubmit}
          userId={task.userId}
          workspaces={workspaces}
          task={task}
          workspaceId={task.workspaceId}
          isEditing={true}
          onDelete={handleDelete}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
