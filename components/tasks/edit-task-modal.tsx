import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  onSubmit: (data: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
};

export const EditTaskModal: React.FC<EditTaskModalProps> = ({
  isOpen,
  onClose,
  task,
  workspaces,
  onSubmit,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-w-[90vw] p-4">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <DialogDescription></DialogDescription>
        <div className="sm:max-h[80vh] overflow-y-auto pr-6">
          <TaskForm
            onSubmit={(data) => Promise.resolve(onSubmit(data))}
            userId={task.userId}
            workspaceId={task.workspaceId}
            workspaces={workspaces}
            task={task}
            isEditing={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
