"use client";

import { useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Task } from "@/types/task";
import { TaskView } from "@/components/tasks/task-view";
import { useWorkspace } from "@/contexts/workspace-context";
import { sortTasks } from "@/components/tasks/task-list/utils";

export default function TasksPage() {
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
        setTasks(sortTasks(tasksData));
      }
    }
  }, [user, selectedWorkspace]);

  useEffect(() => {
    fetchTasks();
  }, [user, selectedWorkspace, fetchTasks]);

  return (
    <Card>
      <CardContent className="p-2">
        <TaskView
          tasks={tasks}
          workspaces={workspaces}
          userId={user?.publicMetadata.dbUserId as number}
          onTasksChanged={fetchTasks}
        />
      </CardContent>
    </Card>
  );
}
