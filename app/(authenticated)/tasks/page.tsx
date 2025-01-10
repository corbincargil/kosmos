"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TaskView } from "@/components/tasks/task-view";

export default function TasksPage() {
  return (
    <Card>
      <CardContent className="p-2">
        <TaskView />
      </CardContent>
    </Card>
  );
}
