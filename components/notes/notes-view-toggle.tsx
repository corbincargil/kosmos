import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotesViewToggleProps {
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
}

export function NotesViewToggle({ view, onViewChange }: NotesViewToggleProps) {
  return (
    <div className="flex justify-end mb-4">
      <div className="flex gap-2">
        <Button
          variant={view === "list" ? "default" : "outline"}
          size="sm"
          onClick={() => onViewChange("list")}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant={view === "grid" ? "default" : "outline"}
          size="sm"
          onClick={() => onViewChange("grid")}
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
