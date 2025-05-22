import { Button } from "@/components/ui/button";
import { Settings, Trash2 } from "lucide-react";
import { TaskType } from "@/types/task-type";
import { ICON_MAP } from "@/app/(authenticated)/_components/layout/sidebar/constants";

interface TaskTypeCardProps {
  taskType: TaskType;
  onEdit: (taskType: TaskType) => void;
  onDelete: (taskType: TaskType) => void;
}

export function TaskTypeCard({ taskType, onEdit, onDelete }: TaskTypeCardProps) {
  const IconComponent = ICON_MAP[taskType.icon];

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white"
          style={{ backgroundColor: taskType.color }}
        >
          {IconComponent && <IconComponent className="h-4 w-4" />}
        </div>
        <div>
          <div className="font-medium">{taskType.name}</div>
          <div className="text-sm text-muted-foreground">
            {taskType.taskCount ?? 0} tasks
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(taskType)}
        >
          <Settings className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(taskType)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
} 