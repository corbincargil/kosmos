"use client";

import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import { TaskForm } from "../../_components/task-forms/task-form";

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
    return <div>Loading...</div>;
  }

  if (!task) {
    return null;
  }

  return <TaskForm taskId={task.id.toString()} onCancel={onClose} />;
}
