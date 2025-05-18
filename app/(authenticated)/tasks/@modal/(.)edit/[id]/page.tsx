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
        <DialogHeader>
          <DialogTitle hidden>Loading task edit form...</DialogTitle>
        </DialogHeader>
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
          className="max-w-7xl w-[96vw]"
        >
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription hidden>Edit task form</DialogDescription>
        </DialogHeader>
        <TaskForm taskId={id as string} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
}
