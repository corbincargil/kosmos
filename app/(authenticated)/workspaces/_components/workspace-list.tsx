import { Workspace } from "@/types/workspace";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import WorkspaceDialog from "./workspace-dialog";

interface WorkspaceListProps {
  workspaces: Workspace[];
  onDeleteWorkspace: (workspace: Workspace) => void;
}

export default function WorkspaceList({
  workspaces,
  onDeleteWorkspace,
}: WorkspaceListProps) {
  return (
    <ul className="space-y-2 max-h-[600px] overflow-y-auto">
      {workspaces.map((workspace) => (
        <li
          key={workspace.id}
          className="p-2 rounded flex justify-between items-center"
          style={{
            borderLeft: `4px solid ${workspace.color}`,
            borderRadius: "4px",
            backgroundColor: `${workspace.color}10`,
          }}
        >
          <div className="flex flex-col">
            <h3 className="font-semibold">{workspace.name}</h3>
            <p className="text-sm text-gray-500">Type: {workspace.type}</p>
            <p className="text-sm text-gray-500">
              Created: {new Date(workspace.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <WorkspaceDialog workspace={workspace} />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDeleteWorkspace(workspace)}
              className="text-destructive hover:text-destructive"
            >
              <Trash size={20} />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
