"use client";

import React, { useState, useEffect } from "react";
import { Task, PrimaryTaskStatuses } from "@/types/task";
import { KanbanBoard } from "../kanban-board";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams, useRouter } from "next/navigation";
import { useWorkspace } from "@/contexts/workspace-context";
import { useUser } from "@clerk/nextjs";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { TaskStatus } from "@prisma/client";
import { FilterBar } from "@/components/task-filters/filter-bar";
import { FilterMenu } from "@/components/task-filters/filter-menu";
import KanbanLoading from "../loading/kanban-loading";
import { orderStatuses } from "@/lib/task-utils";

export const TaskView: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status")?.split(",") as TaskStatus[] || [];

  const [localTasks, setLocalTasks] = useState<Task[]>([]);

  const { user } = useUser();
  const { toast } = useToast();
  const { workspaces, selectedWorkspace } = useWorkspace();
  
  const columns = statusFilter.length > 0 
    ? orderStatuses(statusFilter)
    : PrimaryTaskStatuses;

  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
  } = api.tasks.getTasks.useQuery({
    filters: searchParams.toString(),
    workspaceId: selectedWorkspace,
  }, {
    staleTime: 0,
    refetchOnWindowFocus: false
  });

  const updateStatusMutation = api.tasks.updateTaskStatus.useMutation({
    onError: (error) => {
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
    setLocalTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));

    try {
      updateStatusMutation.mutate({ id: taskId, status: newStatus });
    } catch (error) {
      console.error(error);
      setLocalTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, status: task.status } : task
      ));
    }
  };

  const handleEditTask = (task: Task) => {
    const params = new URLSearchParams(searchParams);
    router.push(`/tasks/edit/${task.uuid}?${params.toString()}`);
  };

  useEffect(() => {
    if (tasks) {
      setLocalTasks(tasks as unknown as Task[]);
    }
  }, [tasks]);

  if (tasksError) return <p>Error loading tasks</p>;

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <div className="flex-1">
            <div className="hidden sm:block">
              <FilterBar workspaceUuid={selectedWorkspace} />
            </div>
            <div className="sm:hidden">
              <FilterMenu workspaceUuid={selectedWorkspace} />
            </div>
          </div>
        </div>
        <Button
          variant="glow"
          onClick={() => router.push(`/tasks/add?${searchParams.toString()}`)}
          className="w-full sm:w-auto"
        >
          Create Task
        </Button>
      </div>
      {tasksLoading && <KanbanLoading />}
      {localTasks.length > 0 && (
        <div className="flex-1 overflow-hidden">
          <KanbanBoard
            columns={columns}
            tasks={localTasks}
            workspaces={workspaces}
            userId={user?.publicMetadata.dbUserId as number}
            onUpdateStatus={handleUpdateStatus}
            onEditTask={handleEditTask}
          />
        </div>
      )}
      {localTasks.length === 0 && !tasksLoading && (
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-500">No tasks found 🥺</p>
        </div>
      )}
    </div>
  );
};
