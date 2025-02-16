"use client";

import React, { useState, useEffect } from "react";
import { PrimaryTaskStatuses, Task } from "@/types/task";
import { KanbanBoard } from "../kanban-board";
import { TaskViewToggle } from "./view-toggle";
import { useToast } from "@/hooks/use-toast";
import { TaskAccordion } from "../task-list/task-accordion";
import { useSearchParams, useRouter } from "next/navigation";
import { useWorkspace } from "@/contexts/workspace-context";
import { useTheme } from "@/app/(authenticated)/_components/theme/theme-manager";
import { useUser } from "@clerk/nextjs";
import { api } from "@/trpc/react";
import QuickFilters from "./quick-filters";
import { Button } from "@/components/ui/button";
import { TaskStatus } from "@prisma/client";
import AllTasksSwitch from "./all-tasks-switch";

export const TaskView: React.FC = () => {
  const [showAll, setShowAll] = useState(true);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [tasks, setTasks] = useState<Task[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view") || "board";

  const { user } = useUser();
  const { toast } = useToast();
  const { theme } = useTheme();
  const { workspaces, selectedWorkspace } = useWorkspace();

  const showAllStatuses = searchParams.get("show-all") === "true";

  const {
    data: fetchedTasks,
    isLoading: tasksLoading,
    isError: tasksError,
  } = api.tasks.getTasks.useQuery({
    workspaceId: selectedWorkspace,
    statuses: showAllStatuses ? undefined : PrimaryTaskStatuses,
  });

  useEffect(() => {
    if (fetchedTasks) {
      setTasks(fetchedTasks);
    }
  }, [fetchedTasks]);

  const filteredTasks = tasks.filter((task) => {
    if (activeFilters.size === 0) {
      return true;
    }
    return activeFilters.has(task.workspaceUuid);
  });

  const toggleFilter = (workspaceUuid: string) => {
    setShowAll(false);
    setActiveFilters((prev) => {
      const newFilters = new Set(prev);
      if (newFilters.has(workspaceUuid)) {
        newFilters.delete(workspaceUuid);
      } else {
        newFilters.add(workspaceUuid);
      }
      return newFilters;
    });
  };

  const handleShowAll = () => {
    setShowAll(true);
    setActiveFilters(new Set());
  };

  const updateStatusMutation = api.tasks.updateTaskStatus.useMutation({
    onMutate: ({ id, status }) => {
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === id ? { ...task, status: status as TaskStatus } : task
        )
      );
    },
    onError: (error) => {
      if (fetchedTasks) {
        setTasks(fetchedTasks);
      }
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Task status updated successfully",
        variant: "success",
      });
    },
  });

  const handleUpdateStatus = async (taskId: number, newStatus: TaskStatus) => {
    await updateStatusMutation.mutate({ id: taskId, status: newStatus });
  };

  const handleEditTask = (task: Task) => {
    const params = new URLSearchParams(searchParams);
    router.push(`/tasks/edit/${task.uuid}?${params.toString()}`);
  };

  if (tasksLoading) return <p>Loading tasks...</p>;

  if (tasksError) return <p>Error loading tasks</p>;

  if (!tasks) return <p>No tasks found</p>;

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div className="flex gap-2 items-center w-full sm:w-auto">
          <TaskViewToggle />
          <AllTasksSwitch />
          <QuickFilters
            selectedWorkspace={selectedWorkspace}
            showAll={showAll}
            theme={theme}
            workspaces={workspaces}
            activeFilters={activeFilters}
            handleShowAll={handleShowAll}
            toggleFilter={toggleFilter}
          />
        </div>
        <Button
          variant="glow"
          onClick={() => router.push(`/tasks/add?${searchParams.toString()}`)}
        >
          Create Task
        </Button>
      </div>
      {tasks.length > 0 && currentView === "list" && (
        <div className="flex-1 overflow-hidden">
          <TaskAccordion
            tasks={filteredTasks || []}
            workspaces={workspaces}
            userId={user?.publicMetadata.dbUserId as number}
            onUpdateStatus={handleUpdateStatus}
            onEdit={handleEditTask}
          />
        </div>
      )}
      {tasks.length > 0 && currentView === "board" && (
        <div className="flex-1 overflow-hidden">
          <KanbanBoard
            columns={
              showAllStatuses ? Object.values(TaskStatus) : PrimaryTaskStatuses
            }
            tasks={filteredTasks}
            workspaces={workspaces}
            userId={user?.publicMetadata.dbUserId as number}
            onUpdateStatus={handleUpdateStatus}
            onEditTask={handleEditTask}
          />
        </div>
      )}
      {tasks.length === 0 && (
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-500">No tasks found</p>
        </div>
      )}
    </div>
  );
};
