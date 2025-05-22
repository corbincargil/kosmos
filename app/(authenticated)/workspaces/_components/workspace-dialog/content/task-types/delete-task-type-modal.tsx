import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TaskType } from "@/types/task-type";

interface DeleteTaskTypeModalProps {
  taskType: TaskType;
  onConfirm: () => void;
  onCancel: () => void;
  error?: string;
}

export function DeleteTaskTypeModal({
  taskType,
  onConfirm,
  onCancel,
  error,
}: DeleteTaskTypeModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Delete Task Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">
            Are you sure you want to delete the task type{" "}
            <span className="font-bold">{taskType.name}</span>?
          </p>
          {error && (
            <p className="text-sm text-destructive">
              {error}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 