import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { api } from "@/trpc/react";
import { useToast } from "@/hooks/use-toast";
import { TaskType } from "@/types/task-type";
import { TaskTypeCard } from "./task-types/task-type-card";
import { TaskTypeForm } from "./task-types/task-type-form";
import { DeleteTaskTypeModal } from "./task-types/delete-task-type-modal";

interface TaskTypesContentProps {
  workspaceId: number;
}

export function TaskTypesContent({ workspaceId }: TaskTypesContentProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingTaskType, setEditingTaskType] = useState<TaskType | null>(null);
  const [deletingTaskType, setDeletingTaskType] = useState<TaskType | null>(null);
  const [deleteError, setDeleteError] = useState<string>();

  const { toast } = useToast();
  const utils = api.useUtils();

  const { data: taskTypes } = api.taskTypes.getTaskTypesByWorkspaceId.useQuery({
    workspaceId,
  });

  const { mutate: createTaskType } = api.taskTypes.createTaskType.useMutation({
    onSuccess: () => {
      utils.taskTypes.getTaskTypesByWorkspaceId.invalidate();
      setIsCreating(false);
      toast({
        title: "Success",
        description: "Task type created successfully",
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

  const { mutate: updateTaskType } = api.taskTypes.updateTaskType.useMutation({
    onSuccess: () => {
      utils.taskTypes.getTaskTypesByWorkspaceId.invalidate();
      setEditingTaskType(null);
      toast({
        title: "Success",
        description: "Task type updated successfully",
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

  const { mutate: deleteTaskType } = api.taskTypes.deleteTaskType.useMutation({
    onSuccess: () => {
      utils.taskTypes.getTaskTypesByWorkspaceId.invalidate();
      setDeletingTaskType(null);
      setDeleteError(undefined);
      toast({
        title: "Success",
        description: "Task type deleted successfully",
        variant: "success",
      });
    },
    onError: (error) => {
      setDeleteError(error.message);
    },
  });

  const handleCreateTaskType = (data: { name: string; color: string; icon: string }) => {
    createTaskType({
      ...data,
      workspaceId,
    });
  };

  const handleUpdateTaskType = (data: { name: string; color: string; icon: string }) => {
    if (!editingTaskType) return;
    updateTaskType({
      autoId: editingTaskType.autoId,
      data,
    });
  };

  const handleDeleteTaskType = () => {
    if (!deletingTaskType) return;
    deleteTaskType({ autoId: deletingTaskType.autoId });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Task Types</CardTitle>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Task Type
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isCreating && (
          <div className="p-4 border rounded-lg">
            <TaskTypeForm
              onSubmit={handleCreateTaskType}
              onCancel={() => setIsCreating(false)}
            />
          </div>
        )}
        {editingTaskType && (
          <div className="p-4 border rounded-lg">
            <TaskTypeForm
              taskType={editingTaskType}
              onSubmit={handleUpdateTaskType}
              onCancel={() => setEditingTaskType(null)}
            />
          </div>
        )}
        <div className="grid gap-2">
          {taskTypes?.map((taskType) => (
            <TaskTypeCard
              key={taskType.autoId}
              taskType={taskType}
              onEdit={setEditingTaskType}
              onDelete={setDeletingTaskType}
            />
          ))}
        </div>
      </CardContent>
      {deletingTaskType && (
        <DeleteTaskTypeModal
          taskType={deletingTaskType}
          onConfirm={handleDeleteTaskType}
          onCancel={() => {
            setDeletingTaskType(null);
            setDeleteError(undefined);
          }}
          error={deleteError}
        />
      )}
    </Card>
  );
} 