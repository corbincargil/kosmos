import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Workspace } from "@/types/workspace";
import { ICON_MAP } from "./constants";
import { Croissant } from "lucide-react";

export default function WorkspaceSelect({
  selectedWorkspace,
  setSelectedWorkspace,
  workspaces,
}: {
  selectedWorkspace: string;
  setSelectedWorkspace: (workspace: string) => void;
  workspaces: Workspace[];
}) {
  return (
    <Select value={selectedWorkspace} onValueChange={setSelectedWorkspace}>
      <SelectTrigger className="flex items-center w-full font-bold text-workspace-darker focus:ring-1 focus:border-none focus:ring-workspace-lighter px-0 pl-2">
        {selectedWorkspace === "all" ? (
          <Croissant
            size={28}
            className="text-workspace-darker shrink-0 mr-2"
            data-sidebar-component="icon"
          />
        ) : (
          (() => {
            const workspace = workspaces.find(
              (w) => w.uuid === selectedWorkspace
            );
            const IconComponent = workspace?.icon
              ? ICON_MAP[workspace.icon]
              : Croissant;
            return (
              <IconComponent
                size={28}
                className="text-workspace-darker shrink-0 mr-2"
                style={{ color: workspace?.color }}
              />
            );
          })()
        )}
        <SelectValue className="pl-4">
          <span
            className="text-lg md:text-2xl whitespace-nowrap"
            data-sidebar-component="content"
          >
            {selectedWorkspace === "all"
              ? "All"
              : workspaces.find(
                  (workspace) => workspace.uuid === selectedWorkspace
                )?.name}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">
          <div className="flex items-center">
            <Croissant size={20} className="text-black dark:text-white mr-2" />
            All
          </div>
        </SelectItem>
        {workspaces.map((workspace) => {
          const IconComponent = workspace.icon
            ? ICON_MAP[workspace.icon]
            : Croissant;
          return (
            <SelectItem
              key={workspace.uuid}
              value={workspace.uuid.toString()}
              className="text-workspace-darker"
              style={{ color: workspace.color }}
            >
              <div className="flex items-center">
                <IconComponent
                  size={20}
                  className="mr-2"
                  style={{ color: workspace.color }}
                />
                {workspace.name}
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
