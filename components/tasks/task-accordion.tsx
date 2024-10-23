import React, { useState, useRef, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Task, TaskStatus } from "@/types/task";
import { SwipeableTaskCard } from "./task-list/swipeable-task-card";
import { getStatusAccordionColors, sortStatuses } from "./task-list/utils";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { InlineTaskForm } from "./inline-task-form";
import { useWorkspace } from "@/contexts/workspace-context";

type TaskAccordionProps = {
  tasks: Task[];
  onUpdateStatus: (taskId: number, newStatus: string) => void;
  onEdit: (task: Task) => void;
  onAddTask: (
    task: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  userId: number;
};

export const TaskAccordion: React.FC<TaskAccordionProps> = ({
  tasks,
  onUpdateStatus,
  onEdit,
  onAddTask,
  userId,
}) => {
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus | null>(null);
  const [openItems, setOpenItems] = useState<string[]>([]);
  const newTaskFormRef = useRef<HTMLDivElement>(null);
  const { workspaces } = useWorkspace();

  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = [];
    }
    acc[task.status].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const sortedStatuses = Object.keys(groupedTasks).sort(sortStatuses);

  const handleAddTask = (status: TaskStatus) => {
    setNewTaskStatus(status);
    if (!openItems.includes(status)) {
      setOpenItems([...openItems, status]);
    }
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
        const statusTasks = groupedTasks[status];
        const statusColor = getStatusAccordionColors(status);
        return (
          <AccordionItem value={status} key={status} className="relative">
            <AccordionTrigger className="text-lg font-semibold pr-4 py-2">
              {status.replace("_", " ")} ({statusTasks.length})
            </AccordionTrigger>
            <div
              className={`absolute right-0 top-0 bottom-0 w-1 ${statusColor}`}
            />
            <AccordionContent>
              <div className="flex flex-col">
                <div className="max-h-[380px] overflow-y-auto overflow-x-hidden px-2 mb-2">
                  <div className="grid gap-2">
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
                </div>
                {newTaskStatus === status && (
                  <div ref={newTaskFormRef} className="px-2">
                    <InlineTaskForm
                      onSubmit={handleSubmitNewTask}
                      onCancel={handleCancelNewTask}
                      userId={userId}
                      initialStatus={status as TaskStatus}
                    />
                  </div>
                )}
                {newTaskStatus !== status && (
                  <Button
                    onClick={() => handleAddTask(status as TaskStatus)}
                    className="w-full mt-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300 shadow-sm transition-colors duration-200"
                    variant="ghost"
                    autoFocus
                  >
                    <Plus className="mr-2 h-4 w-4 text-gray-500" /> Add Task
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
