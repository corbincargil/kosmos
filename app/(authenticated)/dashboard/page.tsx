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
  const { selectedWorkspace } = useWorkspace();
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = useCallback(async () => {
    if (user) {
      const response = await fetch(
        `/api/tasks?userId=${user?.publicMetadata.dbUserId as number}`
      );
      if (response.ok) {
        const tasksData = await response.json();
        setTasks(tasksData);
      }
    }
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [user, fetchTasks]);

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Welcome, {user?.firstName}!</CardTitle>
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
            workspaceId={Number(selectedWorkspace)}
            onTaskCreated={fetchTasks}
          />
        </CardContent>
      </Card>
    </>
  );
}
