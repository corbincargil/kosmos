import { Button } from "@/components/ui/button";
import { Workspace } from "@/types/workspace";

interface QuickFiltersProps {
  selectedWorkspace: string;
  showAll: boolean;
  theme: string;
  workspaces: Workspace[];
  activeFilters: Set<string>;
  handleShowAll: () => void;
  toggleFilter: (workspaceUuid: string) => void;
}

export default function QuickFilters({
  selectedWorkspace,
  showAll,
  theme,
  workspaces,
  activeFilters,
  handleShowAll,
  toggleFilter,
}: QuickFiltersProps) {
  return (
    <>
      {selectedWorkspace === "all" && (
        <div className="flex gap-2 overflow-x-auto max-w-[calc(100vw-2rem)] sm:max-w-none">
          <Button
            variant="outline"
            size="sm"
            style={{
              borderColor: "currentColor",
              backgroundColor: showAll ? "hsl(var(--primary))" : "transparent",
              color: showAll
                ? theme === "dark"
                  ? "black"
                  : "white"
                : "hsl(var(--primary))",
            }}
            onClick={handleShowAll}
          >
            All
          </Button>
          {workspaces.map((workspace) => (
            <Button
              key={workspace.uuid}
              variant="outline"
              size="sm"
              className="whitespace-nowrap"
              style={{
                borderColor: workspace.color,
                backgroundColor: activeFilters.has(workspace.uuid)
                  ? workspace.color
                  : "transparent",
                color: activeFilters.has(workspace.uuid)
                  ? "white"
                  : workspace.color,
              }}
              onClick={() => toggleFilter(workspace.uuid)}
            >
              {workspace.name}
            </Button>
          ))}
        </div>
      )}
    </>
  );
}
