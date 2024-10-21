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
import { Task } from "@/types/task";
import TaskList from "@/components/tasks/task-list";
import { useWorkspace } from "@/contexts/workspace-context";

export default function Dashboard() {
  const { user } = useUser();
  const { selectedWorkspace, workspaces } = useWorkspace();
  const [tasks, setTasks] = useState<Task[]>([]);

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

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Welcome, {user?.firstName || user?.username}!</CardTitle>
          <CardDescription>
            This is your dashboard. You can see all your tasks below.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Tasks</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </>
  );
}
