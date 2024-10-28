import { Task } from "@/types/task";
import { Workspace } from "@/types/workspace";
import { SwipeableTaskCard } from "../../../../components/tasks/task-list/swipeable-task-card";

interface TaskPreviewProps {
  tasks: Task[];
  workspaces: Workspace[];
  userId: number;
  onTasksChanged: () => Promise<void>;
}

export function TaskPreview({
  tasks,
  workspaces,
  userId,
  onTasksChanged,
}: TaskPreviewProps) {
  const handleUpdateStatus = async (taskId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await onTasksChanged();
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <SwipeableTaskCard
          key={task.id}
          task={task}
          workspace={workspaces.find((w) => w.id === task.workspaceId)!}
          onUpdateStatus={handleUpdateStatus}
          onEdit={() => {}}
          showStatus={true}
        />
      ))}
    </div>
  );
}
