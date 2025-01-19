"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TaskView } from "@/app/(authenticated)/tasks/_components/task-view/";

export default function TasksPage() {
  return (
    <Card>
      <CardContent className="p-2">
        <TaskView />
      </CardContent>
    </Card>
  );
}
