"use client";

import { useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Task } from "@/types/task";
import { TaskView } from "@/components/tasks/task-view";
import { useWorkspace } from "@/contexts/workspace-context";
import { sortTasks } from "@/components/tasks/task-list/utils";
import { api } from "@/trpc/react";

export default function TasksPage() {
  const { selectedWorkspace } = useWorkspace();
  const {
    data: taskData,
    isLoading,
    refetch,
  } = api.tasks.getCurrentWorkspaceTasks.useQuery({
    workspaceId: selectedWorkspace,
  });

  if (!taskData) return null;

  return (
    <Card>
      <CardContent className="p-2">
        <TaskView tasks={taskData} onTasksChanged={() => void refetch()} />
      </CardContent>
    </Card>
  );
}
