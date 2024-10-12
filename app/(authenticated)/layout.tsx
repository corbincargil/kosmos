"use client";

import Header from "@/components/header";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { WorkspaceProvider } from "@/contexts/workspace-context";
import { ThemeManager } from "@/components/theme-manager";

export default function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const title = pathname === "/dashboard" ? "Dashboard" : "Admin";

  return (
    <WorkspaceProvider>
      <ThemeManager />
      <div className="min-h-screen bg-gray-100">
        <Header title={title} />
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">{children}</div>
          </div>
        </main>
      </div>
    </WorkspaceProvider>
  );
}
