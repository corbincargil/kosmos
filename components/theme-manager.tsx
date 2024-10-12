"use client";

import { useWorkspace } from "@/contexts/workspace-context";
import { useEffect } from "react";

export function ThemeManager() {
  const { selectedWorkspaceColor } = useWorkspace();

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--accent-color",
      selectedWorkspaceColor
    );

    // Derive other colors from the accent color
    const darkerAccent = adjustColor(selectedWorkspaceColor, -20);
    const lighterAccent = adjustColor(selectedWorkspaceColor, 20);

    document.documentElement.style.setProperty("--accent-darker", darkerAccent);
    document.documentElement.style.setProperty(
      "--accent-lighter",
      lighterAccent
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
