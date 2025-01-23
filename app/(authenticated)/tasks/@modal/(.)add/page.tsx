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
        className="sm:max-w-4xl sm:p-4 max-w-[96vw] p-2"
        aria-describedby="task-dialog"
      >
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <DialogDescription></DialogDescription>
        <div className="max-h-[80vh] overflow-y-auto">
          <TaskForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
