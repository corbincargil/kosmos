import React from "react";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";

interface TaskViewToggleProps {
  viewMode: "list" | "board";
  onToggle: (mode: "list" | "board") => void;
}

export const TaskViewToggle: React.FC<TaskViewToggleProps> = ({
  viewMode,
  onToggle,
}) => {
  return (
    <div className="flex justify-end">
      <div className="flex gap-2">
        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          size="sm"
          onClick={() => onToggle("list")}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "board" ? "default" : "outline"}
          size="sm"
          onClick={() => onToggle("board")}
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
