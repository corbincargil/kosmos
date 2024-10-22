import { Task, TaskStatus } from "@/types/task";

export const sortTasks = (tasksToSort: Task[]) => {
  return tasksToSort.sort((a, b) => {
    const statusOrder = { TODO: 0, IN_PROGRESS: 1, COMPLETED: 2 };
    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) return statusDiff;

    const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    const priorityDiff =
      (priorityOrder[a.priority || "LOW"] || 2) -
      (priorityOrder[b.priority || "LOW"] || 2);
    if (priorityDiff !== 0) return priorityDiff;

    const dateA = a.dueDate ? new Date(a.dueDate) : new Date(8640000000000000);
    const dateB = b.dueDate ? new Date(b.dueDate) : new Date(8640000000000000);
    return dateA.getTime() - dateB.getTime();
  });
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-500";
    case "IN_PROGRESS":
      return "bg-blue-500";
    default:
      return "bg-yellow-500";
  }
};

export const getPreviousStatus = (status: TaskStatus): TaskStatus | null => {
  switch (status) {
    case "IN_PROGRESS":
      return "TODO";
    case "COMPLETED":
      return "IN_PROGRESS";
    default:
      return null;
  }
};

export const getNextStatus = (status: TaskStatus): TaskStatus | null => {
  switch (status) {
    case "TODO":
      return "IN_PROGRESS";
    case "IN_PROGRESS":
      return "COMPLETED";
    default:
      return null;
  }
};

export const getSwipeText = (
  status: TaskStatus,
  direction: "left" | "right"
): string => {
  if (direction === "right") {
    const nextStatus = getNextStatus(status);
    return nextStatus ? nextStatus.replace("_", " ") : "";
  } else {
    const prevStatus = getPreviousStatus(status);
    return prevStatus ? prevStatus.replace("_", " ") : "";
  }
};
