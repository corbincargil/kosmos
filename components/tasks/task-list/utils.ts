import { Task, TaskStatus } from "@/types/task";

export const sortStatuses = (a: string, b: string) => {
  const order = ["TODO", "IN_PROGRESS", "COMPLETED"];
  return order.indexOf(a) - order.indexOf(b);
};

export const sortTasks = (tasks: Task[]): Task[] => {
  return tasks.sort((a, b) => {
    // First, sort by status
    const statusComparison = sortStatuses(a.status, b.status);
    if (statusComparison !== 0) return statusComparison;

    // Then, sort by priority
    const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2, "": 3 };
    const priorityComparison =
      priorityOrder[a.priority || ""] - priorityOrder[b.priority || ""];
    if (priorityComparison !== 0) return priorityComparison;

    // Finally, sort by due date
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    return 0;
  });
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "green-500";
    case "IN_PROGRESS":
      return "blue-500";
    case "TODO":
      return "yellow-500";
    default:
      return "gray-500";
  }
};

export const getStatusAccordionColors = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-600/50 text-green-700";
    case "IN_PROGRESS":
      return "bg-blue-500/50 text-blue-700";
    case "TODO":
      return "bg-yellow-500/50 text-yellow-700";
    default:
      return "bg-gray-500/50 text-gray-700";
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
