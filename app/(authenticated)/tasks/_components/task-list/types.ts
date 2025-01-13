import { Task } from "@/types/task";
import { Workspace } from "@/types/workspace";

export interface TaskListProps {
  tasks: Task[];
  userId: number;
  workspaceId?: number;
  workspaces: Workspace[];
  onTaskCreated: (task: Task) => void;
}

export interface SwipeableTaskCardProps {
  task: Task;
  workspace: Workspace;
  onUpdateStatus: (taskId: number, newStatus: string) => void;
}
