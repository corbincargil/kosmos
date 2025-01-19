import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/trpc/react";
import { useToast } from "@/hooks/use-toast";

interface TaskConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordId: number;
}

export function TaskConfirmDeleteModal({
  isOpen,
  onClose,
  recordId,
}: TaskConfirmDeleteModalProps) {
  const { toast } = useToast();
  const utils = api.useUtils();

  const deleteTask = api.tasks.deleteTask.useMutation({
    onSuccess: () => {
      toast({
        variant: "success",
        description: "Task deleted successfully.",
      });
      utils.tasks.getTasks.invalidate();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    deleteTask.mutate(recordId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Task</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this task? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteTask.isPending}
          >
            {deleteTask.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
