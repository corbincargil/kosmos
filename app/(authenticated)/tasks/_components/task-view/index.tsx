"use client";

import React, { useState } from "react";
import { Task } from "@/types/task";
import { KanbanBoard } from "../task-board/kanban-board";
import { TaskViewToggle } from "./view-toggle";
import { useToast } from "@/hooks/use-toast";
import { TaskAccordion } from "../task-list/task-accordion";
import { useSearchParams, useRouter } from "next/navigation";
import { useWorkspace } from "@/contexts/workspace-context";
import { useTheme } from "@/components/theme-manager";
import { useUser } from "@clerk/nextjs";
import { api } from "@/trpc/react";
import QuickFilters from "./quick-filters";
import { Button } from "@/components/ui/button";

export const TaskView: React.FC = () => {
  const [showAll, setShowAll] = useState(true);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());

  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultView = (searchParams.get("view") as "list" | "board") || "board";
  const [viewMode, setViewMode] = useState<"list" | "board">(defaultView);

  const { user } = useUser();
  const { toast } = useToast();
  const { theme } = useTheme();
  const { workspaces, selectedWorkspace } = useWorkspace();

  const {
    data: tasks,
    isLoading: tasksLoading,
    refetch: refetchTasks,
  } = api.tasks.getTasks.useQuery({
    workspaceId: selectedWorkspace,
  });

  const filteredTasks = tasks?.filter((task) => {
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
    onSuccess: async () => {
      await refetchTasks();
      toast({
        title: "Success",
        description: "Task status updated successfully",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleViewChange = (newView: "list" | "board") => {
    const params = new URLSearchParams(searchParams);
    params.set("view", newView);
    router.push(`?${params.toString()}`);
    setViewMode(newView);
  };

  const handleEditTask = (task: Task) => {
    const params = new URLSearchParams(searchParams);
    router.push(`/tasks/edit/${task.uuid}?${params.toString()}`);
  };

  if (tasksLoading) return <p>Loading tasks...</p>;

  if (!tasks) return <p>No tasks found</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div className="flex gap-2 items-center w-full sm:w-auto">
          <TaskViewToggle viewMode={viewMode} onToggle={handleViewChange} />
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
      {tasks.length > 0 && viewMode === "list" && (
        <TaskAccordion
          tasks={filteredTasks || []}
          workspaces={workspaces}
          userId={user?.publicMetadata.dbUserId as number}
          onUpdateStatus={async (taskId, newStatus) =>
            updateStatusMutation.mutate({ id: taskId, status: newStatus })
          }
          onEdit={handleEditTask}
        />
      )}
      {tasks.length > 0 && viewMode === "board" && (
        <KanbanBoard
          tasks={filteredTasks || []}
          workspaces={workspaces}
          userId={user?.publicMetadata.dbUserId as number}
          onUpdateStatus={async (taskId, newStatus) =>
            updateStatusMutation.mutate({ id: taskId, status: newStatus })
          }
          onEditTask={handleEditTask}
        />
      )}
    </div>
  );
};
