import { TaskStatus } from "@prisma/client";

export const orderStatuses = (statuses: TaskStatus[]) => {
  const statusOrder = [
    TaskStatus.BACKLOG,
    TaskStatus.TODO,
    TaskStatus.IN_PROGRESS,
    TaskStatus.BLOCKED,
    TaskStatus.COMPLETED,
    TaskStatus.CLOSED,
    TaskStatus.CANCELLED
  ];
  
  return statuses.sort((a, b) => 
    statusOrder.indexOf(a) - statusOrder.indexOf(b)
  );
}; 