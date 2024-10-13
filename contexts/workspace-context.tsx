"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useUser } from "@clerk/nextjs";
import { Workspace } from "@/types/workspaces";

interface WorkspaceContextType {
  workspaces: Workspace[];
  selectedWorkspace: string;
  selectedWorkspaceColor: string;
  setSelectedWorkspace: (id: string) => void;
  refreshWorkspaces: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined
);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("");
  const [selectedWorkspaceColor, setSelectedWorkspaceColor] =
    useState<string>("#3B82F6");
  const { user, isLoaded } = useUser();

  const fetchWorkspaces = async (userId: number) => {
    const response = await fetch(`/api/workspaces?userId=${userId}`);
    if (response.ok) {
      const data = await response.json();
      setWorkspaces(
        data.sort((a: Workspace, b: Workspace) =>
          a.createdAt < b.createdAt ? -1 : 1
        )
      );
      if (data.length > 0 && !selectedWorkspace) {
        setSelectedWorkspace(data[0].id.toString());
        setSelectedWorkspaceColor(data[0].color);
      }
    } else {
      console.error("Failed to fetch workspaces");
    }
  };

  const refreshWorkspaces = async () => {
    if (isLoaded && user) {
      const storedDbUserId = user.publicMetadata.dbUserId as number;
      if (storedDbUserId) {
        await fetchWorkspaces(storedDbUserId);
      }
    }
  };

  useEffect(() => {
    refreshWorkspaces();
  }, [isLoaded, user]);

  useEffect(() => {
    const workspace = workspaces.find(
      (w) => w.id.toString() === selectedWorkspace
    );
    if (workspace) {
      setSelectedWorkspaceColor(workspace.color);
    }
  }, [selectedWorkspace, workspaces]);

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        selectedWorkspace,
        selectedWorkspaceColor,
        setSelectedWorkspace,
        refreshWorkspaces,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
