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
import { useTheme } from "@/components/theme-manager";

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
  const [isClient, setIsClient] = useState(false);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useLocalStorage<string>(
    "selectedWorkspace",
    "all"
  );
  const { theme } = useTheme();
  const [selectedWorkspaceColor, setSelectedWorkspaceColor] = useState<string>(
    theme === "dark" ? "#FFFFFF" : "#000000"
  );
  const { user, isLoaded } = useUser();

  useEffect(() => {
    setIsClient(true);
  }, []);

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

    // Set CSS variables for workspace colors
    document.documentElement.style.setProperty("--workspace-color", newColor);
    document.documentElement.style.setProperty(
      "--workspace-darker",
      adjustColor(newColor, -20)
    );
    document.documentElement.style.setProperty(
      "--workspace-lighter",
      adjustColor(newColor, 20)
    );
    document.documentElement.style.setProperty(
      "--workspace-lighter2",
      adjustColor(newColor, 40)
    );
  }, [selectedWorkspace, workspaces, theme]);

  if (!isClient) {
    return null; // or return a loading state
  }

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

// Move adjustColor helper function here since it's only used for workspace colors
function adjustColor(color: string, amount: number) {
  return (
    "#" +
    color
      .replace(/^#/, "")
      .replace(/../g, (color) =>
        (
          "0" +
          Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)
        ).substr(-2)
      )
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
