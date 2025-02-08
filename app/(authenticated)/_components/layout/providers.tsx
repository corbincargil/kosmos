"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "@/app/(authenticated)/_components/theme/theme-manager";
import { WorkspaceProvider } from "@/contexts/workspace-context";
import { SidebarProvider } from "@/components/ui/sidebar";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <WorkspaceProvider>
        <SidebarProvider>{children}</SidebarProvider>
      </WorkspaceProvider>
    </ThemeProvider>
  );
}
