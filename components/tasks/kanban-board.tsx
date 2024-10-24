import React, { useState } from "react";
import { Task, TaskStatus } from "@/types/task";
import { SwipeableTaskCard } from "./task-list/swipeable-task-card";
import { useWorkspace } from "@/contexts/workspace-context";
import { InlineTaskForm } from "./inline-task-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type KanbanBoardProps = {
  tasks: Task[];
  onUpdateStatus: (taskId: number, newStatus: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onAddTask: (
    task: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  userId: number;
};

const columns: TaskStatus[] = ["TODO", "IN_PROGRESS", "COMPLETED"];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onUpdateStatus,
  onEdit,
  onAddTask,
  userId,
}) => {
  const { workspaces } = useWorkspace();
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus | null>(null);

  const handleAddTask = (status: TaskStatus) => {
    setNewTaskStatus(status);
  };

  const handleCancelNewTask = () => {
    setNewTaskStatus(null);
  };

  const handleSubmitNewTask = async (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    await onAddTask(taskData);
    setNewTaskStatus(null);
  };

  return (
    <div className="flex flex-row gap-4 overflow-x-auto snap-x snap-mandatory">
      {columns.map((status) => (
        <div
          key={status}
          className="flex-1 min-w-[85vw] sm:min-w-[300px] max-w-[500px] snap-center"
        >
          <h3 className="text-lg font-semibold mb-2">
            {status.replace("_", " ")}
          </h3>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg min-h-[200px]">
            <div className="space-y-2">
              {tasks
                .filter((task) => task.status === status)
                .map((task) => (
                  <SwipeableTaskCard
                    key={task.id}
                    task={task}
                    workspace={
                      workspaces.find((w) => w.id === task.workspaceId)!
                    }
                    onUpdateStatus={(taskId, newStatus) =>
                      onUpdateStatus(taskId, newStatus as TaskStatus)
                    }
                    onEdit={() => onEdit(task)}
                  />
                ))}
            </div>
            {newTaskStatus === status ? (
              <div className="mt-4">
                <InlineTaskForm
                  onSubmit={handleSubmitNewTask}
                  onCancel={handleCancelNewTask}
                  userId={userId}
                  initialStatus={status}
                />
              </div>
            ) : (
              <Button
                onClick={() => handleAddTask(status)}
                className="w-full mt-4"
                variant="glow"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Task
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
