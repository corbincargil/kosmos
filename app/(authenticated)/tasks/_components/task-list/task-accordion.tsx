import React, { useState, useRef, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Task } from "@/types/task";
import { sortStatuses } from "@/app/(authenticated)/tasks/_components/task-list/utils";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import styles from "./task-accordion.module.css";
import { Workspace } from "@/types/workspace";
import { InlineTaskForm } from "../../../tasks/_components/task-forms/inline-task-form";
import { SwipeableTaskCard } from "../kanban-board/swipeable-task-card";
import { TaskStatus } from "@prisma/client";

type TaskAccordionProps = {
  tasks: Task[];
  workspaces: Workspace[];
  onUpdateStatus: (taskId: number, newStatus: TaskStatus) => void;
  onEdit: (task: Task) => void;
  userId: number;
};

export const TaskAccordion: React.FC<TaskAccordionProps> = ({
  tasks,
  workspaces,
  onUpdateStatus,
  onEdit,
  userId,
}) => {
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus | null>(null);
  const [openItems, setOpenItems] = useState<string[]>([]);
  const newTaskFormRef = useRef<HTMLDivElement>(null);

  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = [];
    }
    acc[task.status].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const sortedStatuses = Object.values(TaskStatus).sort(sortStatuses);

  const handleAddTask = (status: TaskStatus) => {
    setNewTaskStatus(status);
    if (!openItems.includes(status)) {
      setOpenItems([...openItems, status]);
    }
  };

  const handleCancelNewTask = () => {
    setNewTaskStatus(null);
  };

  useEffect(() => {
    if (newTaskStatus && newTaskFormRef.current) {
      newTaskFormRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [newTaskStatus]);

  const handleAccordionChange = (value: string[]) => {
    setOpenItems(value);
  };

  return (
    <Accordion
      type="multiple"
      className="w-full"
      value={openItems}
      onValueChange={handleAccordionChange}
    >
      {sortedStatuses.map((status) => {
        const statusTasks = groupedTasks[status] || [];
        return (
          <AccordionItem value={status} key={status} className="relative">
            <AccordionTrigger className="text-md font-thin pl-1 pr-4 py-2 mb-1">
              <div className="flex items-center">
                <span>{status.replace(/_/g, " ")}</span>
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                  ({statusTasks.length})
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col relative">
                <div
                  className={`${styles.scrollContainer} max-h-[380px] overflow-y-auto overflow-x-hidden mb-2`}
                >
                  <div className="grid gap-2 p-2">
                    {statusTasks.map((task) => (
                      <SwipeableTaskCard
                        key={task.id}
                        task={task as Task & { taskType?: { autoId: number; name: string; color: string; icon: string } | null; tags?: { tag: { autoId: number; name: string; color: string; }; }[] }}
                        workspace={
                          workspaces.find((w) => w.uuid === task.workspaceUuid)!
                        }
                        onUpdateStatus={(newStatus) =>
                          onUpdateStatus(task.id!, newStatus)
                        }
                        onEdit={() => onEdit(task)}
                      />
                    ))}
                  </div>
                </div>
                {newTaskStatus === status && (
                  <div ref={newTaskFormRef} className="px-2">
                    <InlineTaskForm
                      onCancel={handleCancelNewTask}
                      userId={userId}
                      initialStatus={status as TaskStatus}
                    />
                  </div>
                )}
                {newTaskStatus !== status && (
                  <Button
                    onClick={() => handleAddTask(status as TaskStatus)}
                    className="w-[97%] self-center mt-2 shadow-sm transition-colors duration-200"
                    variant="glow"
                    autoFocus
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Task
                  </Button>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};
