import { api } from "@/trpc/react";
import { useWorkspace } from "@/contexts/workspace-context";

export function useTasks() {
  const { selectedWorkspace } = useWorkspace();
  const isAllWorkspaces = selectedWorkspace === "all";

  const workspaceQuery = api.tasks.getCurrentWorkspaceTasks.useQuery(
    { workspaceId: selectedWorkspace },
    { enabled: !isAllWorkspaces }
  );

  const allTasksQuery = api.tasks.getCurrentUserTasks.useQuery(undefined, {
    enabled: isAllWorkspaces,
  });

  return {
    data: isAllWorkspaces ? allTasksQuery.data : workspaceQuery.data,
    isLoading: isAllWorkspaces
      ? allTasksQuery.isLoading
      : workspaceQuery.isLoading,
    refetch: isAllWorkspaces ? allTasksQuery.refetch : workspaceQuery.refetch,
  };
}
