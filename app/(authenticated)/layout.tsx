"use client";

import Header from "@/components/layout/header/header";
import { redirect } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { WorkspaceProvider } from "@/contexts/workspace-context";
import { ThemeProvider, useTheme } from "@/components/theme-manager";
import { useUser } from "@clerk/nextjs";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/sidebar/app-sidebar";

export default function AuthenticatedLayout({
  children,
  modal,
}: {
  children: ReactNode;
  modal?: ReactNode;
}) {
  const { isLoaded, user } = useUser();

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) redirect("/sign-in");
  }, [isLoaded, user]);

  return (
    <ThemeProvider>
      <WorkspaceProvider>
        <SidebarProvider>
          <AuthenticatedLayoutContent modal={modal}>
            {children}
          </AuthenticatedLayoutContent>
        </SidebarProvider>
      </WorkspaceProvider>
    </ThemeProvider>
  );
}

function AuthenticatedLayoutContent({
  children,
  modal,
}: {
  children: ReactNode;
  modal?: ReactNode;
}) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex h-screen flex-col bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-1 w-full overflow-hidden">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header theme={theme} toggleTheme={toggleTheme} />
          <main className="flex-1 overflow-auto ">
            <div className="h-full px-4 py-6">
              <div className="rounded-lg max-w-7xl mx-auto">
                {children}
                {modal}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
