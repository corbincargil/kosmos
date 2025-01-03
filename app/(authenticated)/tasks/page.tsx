"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TaskView } from "@/components/tasks/task-view";
import { useTasks } from "@/hooks/use-tasks";

export default function TasksPage() {
  const { data: taskData, isLoading, refetch } = useTasks();

  if (isLoading || !taskData) return null;

  return (
    <Card>
      <CardContent className="p-2">
        <TaskView tasks={taskData} onTasksChanged={() => void refetch()} />
      </CardContent>
    </Card>
  );
}
