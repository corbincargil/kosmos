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
import { useTheme } from "@/components/theme-manager";
import { api } from "@/trpc/react";
import { useRouter, useSearchParams } from "next/navigation";

interface WorkspaceContextType {
  workspaces: Workspace[];
  selectedWorkspace: string;
  selectedWorkspaceColor: string;
  setSelectedWorkspace: (uuid: string) => void;
  refreshWorkspaces: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined
);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedWorkspace = searchParams.get("workspace") || "all";
  const { theme } = useTheme();
  const [selectedWorkspaceColor, setSelectedWorkspaceColor] = useState<string>(
    theme === "dark" ? "#FFFFFF" : "#000000"
  );
  const { user, isLoaded } = useUser();

  const { data: workspaces, refetch: refreshWorkspaces } =
    api.workspaces.getUserWorkspaces.useQuery(undefined, {
      enabled: !!user,
    });

  useEffect(() => {
    refreshWorkspaces();
  }, [isLoaded, user]);

  useEffect(() => {
    const newColor =
      selectedWorkspace === "all"
        ? theme === "dark"
          ? "#FFFFFF"
          : "#000000"
        : workspaces?.find((w) => w.uuid.toString() === selectedWorkspace)
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

  const setSelectedWorkspace = (id: string) => {
    const params = new URLSearchParams(window.location.search);
    if (id === "all") {
      params.delete("workspace");
    } else {
      params.set("workspace", id);
    }
    router.push(`?${params.toString()}`);
  };

  if (!workspaces) return null;

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        selectedWorkspace,
        selectedWorkspaceColor,
        setSelectedWorkspace,
        refreshWorkspaces: () => refreshWorkspaces().then(),
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
