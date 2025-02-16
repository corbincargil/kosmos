import { getTaskLabel } from "@/types/task";
import { TaskStatus } from "@prisma/client";
import { InlineTaskForm } from "../task-forms/inline-task-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface KanbanColumnProps {
  status: TaskStatus;
  children: React.ReactNode;
  newTaskStatus: TaskStatus | null;
  setNewTaskStatus: (status: TaskStatus | null) => void;
  handleAddTask: (status: TaskStatus) => void;
  userId: number;
}

export default function KanbanColumn({
  status,
  newTaskStatus,
  setNewTaskStatus,
  handleAddTask,
  userId,
  children,
}: KanbanColumnProps) {
  return (
    <div
      key={status}
      className="flex-1 min-w-[80vw] md:min-w-[300px] max-w-[500px] flex flex-col h-full snap-center"
    >
      <h3 className="text-lg font-semibold p-1">{getTaskLabel(status)}</h3>
      <div className="flex-1 bg-secondary px-2 pt-2 rounded-lg overflow-y-auto">
        <div className="space-y-2">{children}</div>
        <div className="sticky bottom-0 my-4 w-full">
          {newTaskStatus === status ? (
            <div className="w-full h-full bg-secondary pb-2">
              <InlineTaskForm
                onCancel={() => setNewTaskStatus(null)}
                userId={userId}
                initialStatus={status}
              />
            </div>
          ) : (
            <div className="w-full h-full bg-secondary py-2">
              <Button
                onClick={() => handleAddTask(status)}
                className="w-full"
                variant="glow"
              >
                <Plus className="mr-2 h-4 w-4" />
                <span>Add Task</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
