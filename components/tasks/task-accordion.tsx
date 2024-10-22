import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Task } from "@/types/task";
import { Workspace } from "@/types/workspace";
import { SwipeableTaskCard } from "./task-list/swipeable-task-card";
import { getStatusAccordionColors, sortStatuses } from "./task-list/utils";

type TaskAccordionProps = {
  tasks: Task[];
  workspaces: Workspace[];
  onUpdateStatus: (taskId: number, newStatus: string) => void;
  onEdit: (task: Task) => void;
};

export const TaskAccordion: React.FC<TaskAccordionProps> = ({
  tasks,
  workspaces,
  onUpdateStatus,
  onEdit,
}) => {
  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = [];
    }
    acc[task.status].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const sortedStatuses = Object.keys(groupedTasks).sort(sortStatuses);

  return (
    <Accordion type="multiple" className="w-full" defaultValue={sortedStatuses}>
      {sortedStatuses.map((status) => {
        const statusTasks = groupedTasks[status];
        const statusColor = getStatusAccordionColors(status);
        return (
          <AccordionItem value={status} key={status} className="relative">
            <AccordionTrigger className="text-lg font-semibold pr-4">
              {status.replace("_", " ")} ({statusTasks.length})
            </AccordionTrigger>
            <div
              className={`absolute right-0 top-0 bottom-0 w-1 ${statusColor}`}
            />
            <AccordionContent className="pr-4">
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {statusTasks.map((task) => {
                  const taskWorkspace = workspaces.find(
                    (w) => w.id === task.workspaceId
                  );
                  return (
                    <SwipeableTaskCard
                      key={task.id}
                      task={task}
                      workspace={taskWorkspace!}
                      onUpdateStatus={onUpdateStatus}
                      onEdit={() => onEdit(task)}
                    />
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};
