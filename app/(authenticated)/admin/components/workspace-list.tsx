import { Workspace } from "@/types/workspaces";

interface WorkspaceListProps {
  workspaces: Workspace[];
  onEditWorkspace: (workspace: Workspace) => void;
}

export default function WorkspaceList({
  workspaces,
  onEditWorkspace,
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
            <p className="text-sm text-gray-500">
              Created: {new Date(workspace.createdAt).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={() => onEditWorkspace(workspace)}
            className="mt-2 bg-blue-500 text-white px-2 py-1 rounded text-sm"
          >
            Edit
          </button>
        </li>
      ))}
    </ul>
  );
}
