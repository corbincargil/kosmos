import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TaskType } from "@/types/task-type";
import { Icon } from "lucide-react";
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
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter task type name"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Color</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full h-10 rounded-md border"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Icon</label>
        <IconSelect
          value={icon}
          onValueChange={(value) => setIcon(value)}
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