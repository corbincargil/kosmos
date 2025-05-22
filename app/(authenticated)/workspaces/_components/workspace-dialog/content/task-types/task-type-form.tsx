import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TaskType } from "@/types/task-type";
import IconSelect from "../../../icon-select";

interface TaskTypeFormProps {
  taskType?: TaskType;
  onSubmit: (data: { name: string; color: string; icon: string }) => void;
  onCancel: () => void;
}

export function TaskTypeForm({
  taskType,
  onSubmit,
  onCancel,
}: TaskTypeFormProps) {
  const [name, setName] = useState(taskType?.name ?? "");
  const [color, setColor] = useState(taskType?.color ?? "#000000");
  const [icon, setIcon] = useState(taskType?.icon ?? "Croissant");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({ name, color, icon });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2 items-center">
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter task type name"
          required
        />
          <IconSelect
            value={icon}
            onValueChange={(value) => setIcon(value)}
          />
        <Input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-40 h-10 p-0"
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : taskType ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
} 