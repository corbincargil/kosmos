"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TaskView } from "@/app/(authenticated)/tasks/_components/task-view/";

export default function TasksPage() {
  return (
    <Card className="h-[calc(100vh-6rem)]">
      <CardContent className="p-4 h-full">
        <TaskView />
      </CardContent>
    </Card>
  );
}
