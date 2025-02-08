import { Workspace } from "@/types/workspace";
import { Trash } from "lucide-react";

interface WorkspaceListProps {
  workspaces: Workspace[];
  onEditWorkspace: (workspace: Workspace) => void;
  onDeleteWorkspace: (workspace: Workspace) => void;
}

export default function WorkspaceList({
  workspaces,
  onEditWorkspace,
  onDeleteWorkspace,
}: WorkspaceListProps) {
  return (
    <ul className="space-y-2">
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
          <div className="flex items-center">
            <button
              onClick={() => onEditWorkspace(workspace)}
              className="bg-blue-500 text-white px-2 py-1 rounded text-sm mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => onDeleteWorkspace(workspace)}
              className="p-1 rounded hover:text-red-500"
            >
              <Trash size={20} />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
