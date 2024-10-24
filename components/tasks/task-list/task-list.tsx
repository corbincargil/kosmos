import React, { useState, useCallback, useEffect, useMemo } from "react";
import { TaskStatus, Task } from "@/types/task";
import { useToast } from "@/hooks/use-toast";
import { TaskListProps } from "./types";
import { sortTasks } from "./utils";
import { EditTaskModal } from "../edit-task-modal";
import { KanbanBoard } from "../kanban-board";
import { useWorkspace } from "@/contexts/workspace-context";
import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskAccordion } from "../task-accordion";

const TaskList: React.FC<TaskListProps> = ({ tasks: initialTasks, userId }) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { toast } = useToast();
  const { workspaces } = useWorkspace();
  const [viewMode, setViewMode] = useState<"kanban" | "list">("list");

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const sortedTasks = useMemo(() => sortTasks([...tasks]), [tasks]);

  const handleUpdateStatus = useCallback(
    async (taskId: number, newStatus: TaskStatus) => {
      try {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  status: newStatus,
                }
              : task
          )
        );

        const response = await fetch(`/api/tasks/${taskId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        });

        if (!response.ok) {
          throw new Error("Failed to update task status");
        }

        toast({
          title: "Success",
          description: `Task marked as ${newStatus
            .toLowerCase()
            .replace("_", " ")}`,
        });
      } catch (error) {
        console.error("Error updating task status:", error);
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId ? { ...task, status: task.status } : task
          )
        );
        toast({
          title: "Error",
          description: "Failed to update task status. Please try again.",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  const handleEditTask = useCallback(
    async (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
      if (!editingTask) return;

      try {
        const response = await fetch(`/api/tasks/${editingTask.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(taskData),
        });

        if (!response.ok) {
          throw new Error("Failed to update task");
        }

        const updatedTask = await response.json();

        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === editingTask.id ? updatedTask : task
          )
        );

        setEditingTask(null);

        toast({
          title: "Success",
          description: "Task updated successfully",
          variant: "success",
        });
      } catch (error) {
        console.error("Error updating task:", error);
        toast({
          title: "Error",
          description: "Failed to update task. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
    },
    [editingTask, toast]
  );

  const handleDeleteTask = useCallback(
    async (taskId: number) => {
      try {
        const response = await fetch(`/api/tasks/${taskId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete task");
        }

        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

        toast({
          title: "Success",
          description: "Task deleted successfully",
          variant: "success",
        });
      } catch (error) {
        console.error("Error deleting task:", error);
        toast({
          title: "Error",
          description: "Failed to delete task. Please try again.",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  const handleAddTask = useCallback(
    async (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
      try {
        const response = await fetch("/api/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(taskData),
        });

        if (!response.ok) {
          throw new Error("Failed to create task");
        }

        const newTask = await response.json();
        setTasks((prevTasks) => [...prevTasks, newTask]);

        toast({
          title: "Success",
          description: "Task created successfully",
          variant: "success",
        });
      } catch (error) {
        console.error("Error creating task:", error);
        toast({
          title: "Error",
          description: "Failed to create task. Please try again.",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  return (
    <div>
      <div className="flex justify-end mb-4">
        <div className="flex gap-2">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "kanban" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("kanban")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {viewMode === "kanban" ? (
        <KanbanBoard
          tasks={sortedTasks}
          onUpdateStatus={handleUpdateStatus}
          onEdit={setEditingTask}
          onAddTask={handleAddTask}
          userId={userId}
        />
      ) : (
        <TaskAccordion
          tasks={sortedTasks}
          onUpdateStatus={(taskId, newStatus) =>
            handleUpdateStatus(taskId, newStatus as TaskStatus)
          }
          onEdit={setEditingTask}
          onAddTask={handleAddTask}
          userId={userId}
        />
      )}

      {editingTask && (
        <EditTaskModal
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          task={editingTask}
          workspaces={workspaces}
          onSubmit={handleEditTask}
          onDelete={handleDeleteTask}
        />
      )}
    </div>
  );
};

export default TaskList;
