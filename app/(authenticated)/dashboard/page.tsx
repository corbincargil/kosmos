"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
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
  const [tasks, setTasks] = useState<Task[]>([]);
  const { selectedWorkspace } = useWorkspace();

  const storedDbUserId = user?.publicMetadata.dbUserId as number;

  const fetchTasks = async () => {
    if (user) {
      const response = await fetch(`/api/tasks?userId=${storedDbUserId}`);
      if (response.ok) {
        const tasksData = await response.json();
        setTasks(tasksData);
      }
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user?.id]);

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
            userId={storedDbUserId}
            workspaceId={Number(selectedWorkspace)}
            onTaskCreated={fetchTasks}
          />
        </CardContent>
      </Card>
    </>
  );
}
