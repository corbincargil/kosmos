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
import { TaskView } from "@/components/tasks/task-view";
import { useWorkspace } from "@/contexts/workspace-context";
import Link from "next/link";
import { sortTasks } from "@/components/tasks/task-list/utils";

export default function Dashboard() {
  const { user } = useUser();
  const { selectedWorkspace, workspaces } = useWorkspace();
  const [tasks, setTasks] = useState<Task[]>([]);

  const Greeting =
    '"I am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit; apart from me you can do nothing." - John 15:5';

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
        setTasks(sortTasks(tasksData));
      }
    }
  }, [user, selectedWorkspace]);

  useEffect(() => {
    fetchTasks();
  }, [user, selectedWorkspace, fetchTasks]);

  return (
    <>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Welcome, {user?.firstName || user?.username}!</CardTitle>
          <CardDescription>{Greeting}</CardDescription>
        </CardHeader>
      </Card>
      <Link href="/notes/0">Notes</Link>
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
      </CardHeader>
      <Card>
        <CardContent className="p-2">
          {tasks.length ? (
            <TaskView
              tasks={tasks}
              workspaces={workspaces}
              userId={user?.publicMetadata.dbUserId as number}
              onTasksChanged={fetchTasks}
            />
          ) : (
            <p>You have no tasks yet.</p>
          )}
        </CardContent>
      </Card>
    </>
  );
}
