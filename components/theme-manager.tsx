"use client";

import { useWorkspace } from "@/contexts/workspace-context";
import { useEffect } from "react";

export function ThemeManager() {
  const { selectedWorkspaceColor } = useWorkspace();

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--workspace-color",
      selectedWorkspaceColor
    );

    // Derive other colors from the workspace color
    const darkerWorkspace = adjustColor(selectedWorkspaceColor, -20);
    const lighterWorkspace = adjustColor(selectedWorkspaceColor, 20);
    const lighterWorkspace2 = adjustColor(selectedWorkspaceColor, 40);

    document.documentElement.style.setProperty(
      "--workspace-darker",
      darkerWorkspace
    );
    document.documentElement.style.setProperty(
      "--workspace-lighter",
      lighterWorkspace
    );
    document.documentElement.style.setProperty(
      "--workspace-lighter2",
      lighterWorkspace2
    );
  }, [selectedWorkspaceColor]);

  return null;
}

// Helper function to darken/lighten a color
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
