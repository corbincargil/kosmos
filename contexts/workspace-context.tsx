"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useUser } from "@clerk/nextjs";
import { Workspace } from "@/types/workspace";
import { useLocalStorage } from "@/hooks/use-local-storage";

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

interface WorkspaceProviderProps {
  children: ReactNode;
  theme: "light" | "dark";
}

export function WorkspaceProvider({ children, theme }: WorkspaceProviderProps) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useLocalStorage<string>(
    "selectedWorkspace",
    "all"
  );
  const [selectedWorkspaceColor, setSelectedWorkspaceColor] = useState<string>(
    theme === "dark" ? "#FFFFFF" : "#000000"
  );
  const { user, isLoaded } = useUser();

  const fetchWorkspaces = async (userId: number) => {
    try {
      const response = await fetch(`/api/workspaces?userId=${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch workspaces");
      }
      const data = await response.json();
      const sortedWorkspaces = data.sort((a: Workspace, b: Workspace) =>
        a.createdAt < b.createdAt ? -1 : 1
      );
      setWorkspaces(sortedWorkspaces);
    } catch (error) {
      console.error("Error fetching workspaces:", error);
    }
  };

  const refreshWorkspaces = async () => {
    const dbUserId = user?.publicMetadata.dbUserId as number;
    if (isLoaded && dbUserId) {
      await fetchWorkspaces(dbUserId);
    }
  };

  useEffect(() => {
    refreshWorkspaces();
  }, [isLoaded, user]);

  useEffect(() => {
    const newColor =
      selectedWorkspace === "all"
        ? theme === "dark"
          ? "#FFFFFF"
          : "#000000"
        : workspaces.find((w) => w.id.toString() === selectedWorkspace)
            ?.color ?? (theme === "dark" ? "#FFFFFF" : "#000000");

    setSelectedWorkspaceColor(newColor);
  }, [selectedWorkspace, workspaces, theme]);

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
