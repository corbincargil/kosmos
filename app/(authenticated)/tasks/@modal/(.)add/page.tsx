"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TaskForm } from "@/app/(authenticated)/tasks/_components/task-forms/task-form";
import { useRouter } from "next/navigation";

export default function AddTaskModal() {
  const router = useRouter();
  return (
    <Dialog open={true} onOpenChange={() => router.back()}>
      <DialogTrigger asChild>
        <Button variant="glow">Create New Task</Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-7xl w-[96vw]"
      >
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription hidden>Create new task form</DialogDescription>
        </DialogHeader>
          <TaskForm />
      </DialogContent>
    </Dialog>
  );
}
