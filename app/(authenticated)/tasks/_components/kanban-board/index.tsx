"use client";

import React from "react";
import { Task } from "@/types/task";
import { Workspace } from "@/types/workspace";
import { SwipeableTaskCard } from "./swipeable-task-card";
import { TaskStatus } from "@prisma/client";
import KanbanColumn from "./kanban-column";

interface KanbanBoardProps {
  columns: TaskStatus[];
  tasks: Task[];
  workspaces: Workspace[];
  userId: number;
  onUpdateStatus: (taskId: number, newStatus: TaskStatus) => Promise<void>;
  onEditTask: (task: Task) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  columns,
  tasks,
  workspaces,
  userId,
  onUpdateStatus,
  onEditTask,
}) => {
  const getNextStatus = (currentStatus: TaskStatus): TaskStatus | null => {
    const currentIndex = columns.indexOf(currentStatus);
    return currentIndex < columns.length - 1 ? columns[currentIndex + 1] : null;
  };

  const getPreviousStatus = (currentStatus: TaskStatus): TaskStatus | null => {
    const currentIndex = columns.indexOf(currentStatus);
    return currentIndex > 0 ? columns[currentIndex - 1] : null;
  };

  const handleQuickMoveToNext = async (task: Task) => {
    const nextStatus = getNextStatus(task.status);
    if (nextStatus) {
      await onUpdateStatus(task.id, nextStatus);
    }
  };

  const handleQuickMoveToPrevious = async (task: Task) => {
    const previousStatus = getPreviousStatus(task.status);
    if (previousStatus) {
      await onUpdateStatus(task.id, previousStatus);
    }
  };

  return (
    <div className="bg-background p-2 rounded-lg h-full flex flex-row gap-4 overflow-x-auto snap-x snap-mandatory sm:snap-none">
      {columns.map((status) => (
        <KanbanColumn key={status} status={status} userId={userId}>
          {tasks
            .filter((task) => task.status === status)
            .map((task) => (
              <SwipeableTaskCard
                key={task.id}
                task={task as Task & { taskType?: { autoId: number; name: string; color: string; icon: string } | null; tags?: { tag: { autoId: number; name: string; color: string; }; }[] }}
                workspace={
                  workspaces.find((w) => w.uuid === task.workspaceUuid)!
                }
                onUpdateStatus={(status) => onUpdateStatus(task.id!, status)}
                onEdit={() => onEditTask(task)}
                onQuickMove={() => handleQuickMoveToNext(task)}
                onQuickMoveBack={() => handleQuickMoveToPrevious(task)}
                showQuickMove={getNextStatus(task.status) !== null}
                showQuickMoveBack={getPreviousStatus(task.status) !== null}
              />
            ))}
        </KanbanColumn>
      ))}
    </div>
  );
};
