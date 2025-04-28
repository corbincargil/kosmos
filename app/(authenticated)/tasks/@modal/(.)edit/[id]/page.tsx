"use client";

import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { TaskForm } from "../../../_components/task-forms/task-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useParams } from "next/navigation";

export default function EditTaskModalPage() {
  const router = useRouter();
  const { id } = useParams();

  const { data: task, isLoading } = api.tasks.getTaskByUuid.useQuery(
    {
      uuid: id as string,
    },
    {
      enabled: !!id,
    }
  );

  const onClose = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <Dialog open={true}>
        <DialogContent>
          <div>Loading...</div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!task) {
    return null;
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-7xl sm:p-4 max-w-[96vw] p-2"
      >
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription sr-only="true">Edit task form</DialogDescription>
        </DialogHeader>
        <TaskForm taskId={id as string} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
}
