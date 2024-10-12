import { Workspace } from "@/types/workspaces";

interface WorkspaceListProps {
  workspaces: Workspace[];
}

export default function WorkspaceList({ workspaces }: WorkspaceListProps) {
  return (
    <ul className="space-y-2">
      {workspaces.map((workspace) => (
        <li key={workspace.id} className="border p-2 rounded">
          <h3 className="font-semibold">{workspace.name}</h3>
          <p className="text-sm text-gray-500">
            Created: {new Date(workspace.createdAt).toLocaleDateString()}
          </p>
        </li>
      ))}
    </ul>
  );
}
