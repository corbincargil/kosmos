"use client";

import { useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Task } from "@/types/task";
import TaskList from "@/components/tasks/task-list/task-list";
import { useWorkspace } from "@/contexts/workspace-context";
import { TaskForm } from "@/components/tasks/task-forms/create-task-form";

export default function Dashboard() {
  const { user } = useUser();
  const { selectedWorkspace, workspaces } = useWorkspace();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const Greeting =
    '“I am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit; apart from me you can do nothing." - John 15:5';

  const fetchTasks = useCallback(async () => {
    if (user) {
      const userId = user.publicMetadata.dbUserId as number;
      const queryParam =
        selectedWorkspace === "all"
          ? `userId=${userId}`
          : `workspaceId=${selectedWorkspace}`;

      const response = await fetch(`/api/tasks?${queryParam}`);
      if (response.ok) {
        const tasksData = await response.json();
        setTasks(tasksData);
      }
    }
  }, [user, selectedWorkspace]);

  useEffect(() => {
    fetchTasks();
  }, [user, selectedWorkspace, fetchTasks]);

  const handleTaskCreated = async (
    data: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      fetchTasks();
      setIsDialogOpen(false);
    }
  };

  return (
    <>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Welcome, {user?.firstName || user?.username}!</CardTitle>
          <CardDescription>{Greeting}</CardDescription>
        </CardHeader>
      </Card>
      <CardHeader className="flex flex-row items-center justify-between p-4 py-2">
        <CardTitle>Tasks</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
              <TaskForm
                onSubmit={handleTaskCreated}
                userId={user?.publicMetadata.dbUserId as number}
                workspaceId={
                  selectedWorkspace === "all"
                    ? undefined
                    : Number(selectedWorkspace)
                }
                workspaces={workspaces}
              />
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <Card>
        <CardContent className="p-2">
          {tasks.length ? (
            <TaskList
              tasks={tasks}
              userId={user?.publicMetadata.dbUserId as number}
              workspaceId={
                selectedWorkspace === "all"
                  ? undefined
                  : Number(selectedWorkspace)
              }
              workspaces={workspaces}
              onTaskCreated={fetchTasks}
            />
          ) : (
            <p>You have no tasks yet.</p>
          )}
        </CardContent>
      </Card>
    </>
  );
}
