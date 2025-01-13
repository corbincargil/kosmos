"use client";

import React, { useState } from "react";
import { Task } from "@/types/task";
import { KanbanBoard } from "./task-board/kanban-board";
import { TaskViewToggle } from "./task-view-toggle";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TaskForm } from "./task-forms/create-task-form";
import { EditTaskModal } from "./task-forms/edit-task-modal";
import { TaskAccordion } from "./task-list/task-accordion";
import { useSearchParams, useRouter } from "next/navigation";
import { useWorkspace } from "@/contexts/workspace-context";
import { useTheme } from "@/components/theme-manager";
import { useUser } from "@clerk/nextjs";
import { api } from "@/trpc/react";

export const TaskView: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultView = (searchParams.get("view") as "list" | "board") || "board";
  const [viewMode, setViewMode] = useState<"list" | "board">(defaultView);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { toast } = useToast();
  const { selectedWorkspace } = useWorkspace();
  const [activeFilters, setActiveFilters] = useState<Set<number>>(new Set());
  const [showAll, setShowAll] = useState(true);
  const { theme } = useTheme();
  const { workspaces } = useWorkspace();
  const { user } = useUser();

  const {
    data: tasks,
    isLoading: tasksLoading,
    refetch: refetchTasks,
  } = api.tasks.getTasks.useQuery({
    workspaceId: selectedWorkspace,
  });

  const toggleFilter = (workspaceId: number) => {
    setShowAll(false);
    setActiveFilters((prev) => {
      const newFilters = new Set(prev);
      if (newFilters.has(workspaceId)) {
        newFilters.delete(workspaceId);
      } else {
        newFilters.add(workspaceId);
      }
      return newFilters;
    });
  };

  const handleShowAll = () => {
    setShowAll(true);
    setActiveFilters(new Set());
  };

  const addTaskMutation = api.tasks.createTask.useMutation({
    onSuccess: async () => {
      await refetchTasks();
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Task created successfully",
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

  const updateTaskMutation = api.tasks.updateTask.useMutation({
    onSuccess: async () => {
      await refetchTasks();
      setEditingTask(null);
      toast({
        title: "Success",
        description: "Task updated successfully",
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

  const deleteTaskMutation = api.tasks.deleteTask.useMutation({
    onSuccess: async () => {
      await refetchTasks();
      setEditingTask(null);
      toast({
        title: "Success",
        description: "Task deleted successfully",
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

  if (tasksLoading) return <p>Loading tasks...</p>;

  if (!tasks) return <p>No tasks found</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div className="flex gap-2 items-center w-full sm:w-auto">
          <TaskViewToggle viewMode={viewMode} onToggle={handleViewChange} />
          {selectedWorkspace === "all" && (
            <div className="flex gap-2 overflow-x-auto max-w-[calc(100vw-2rem)] sm:max-w-none">
              <Button
                variant="outline"
                size="sm"
                style={{
                  borderColor: "currentColor",
                  backgroundColor: showAll
                    ? "hsl(var(--primary))"
                    : "transparent",
                  color: showAll
                    ? theme === "dark"
                      ? "black"
                      : "white"
                    : "hsl(var(--primary))",
                }}
                onClick={handleShowAll}
              >
                All
              </Button>
              {workspaces.map((workspace) => (
                <Button
                  key={workspace.id}
                  variant="outline"
                  size="sm"
                  className="whitespace-nowrap"
                  style={{
                    borderColor: workspace.color,
                    backgroundColor: activeFilters.has(workspace.id)
                      ? workspace.color
                      : "transparent",
                    color: activeFilters.has(workspace.id)
                      ? "white"
                      : workspace.color,
                  }}
                  onClick={() => toggleFilter(workspace.id)}
                >
                  {workspace.name}
                </Button>
              ))}
            </div>
          )}
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="glow">Create New Task</Button>
          </DialogTrigger>
          <DialogContent
            className="sm:max-w-4xl sm:p-4 max-w-[96vw] p-2"
            aria-describedby="task-dialog"
          >
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <DialogDescription></DialogDescription>
            <div className="max-h-[80vh] overflow-y-auto">
              <TaskForm
                onSubmit={async (data) =>
                  addTaskMutation.mutate({
                    ...data,
                    workspaceUuid: selectedWorkspace,
                  })
                }
                userId={user?.publicMetadata.dbUserId as number}
                workspaces={workspaces}
                workspaceUuid={selectedWorkspace}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {tasks.length > 0 && viewMode === "list" && (
        <TaskAccordion
          tasks={tasks}
          workspaces={workspaces}
          userId={user?.publicMetadata.dbUserId as number}
          onUpdateStatus={async (taskId, newStatus) =>
            updateStatusMutation.mutate({ id: taskId, status: newStatus })
          }
          onEdit={setEditingTask}
          onAddTask={async (data) => {
            await addTaskMutation.mutateAsync({
              ...data,
              workspaceUuid: selectedWorkspace,
            });
          }}
        />
      )}
      {tasks.length > 0 && viewMode === "board" && (
        <KanbanBoard
          tasks={tasks}
          workspaces={workspaces}
          userId={user?.publicMetadata.dbUserId as number}
          onUpdateStatus={async (taskId, newStatus) =>
            updateStatusMutation.mutate({ id: taskId, status: newStatus })
          }
          onEditTask={setEditingTask}
          onAddTask={async (data) => {
            await addTaskMutation.mutateAsync({
              ...data,
              workspaceUuid: selectedWorkspace,
            });
          }}
        />
      )}
      {editingTask && (
        <EditTaskModal
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          task={editingTask}
          workspaces={workspaces}
          onSubmit={(data) => updateTaskMutation.mutate(data)}
          onDelete={(id) => deleteTaskMutation.mutate(id)}
        />
      )}
    </div>
  );
};
