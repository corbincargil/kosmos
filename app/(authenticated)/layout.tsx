"use client";

import Header from "@/components/header/header";
import FallbackHeader from "@/components/header/fallback-header";
import { redirect, usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { WorkspaceProvider } from "@/contexts/workspace-context";
import { ThemeManager } from "@/components/theme-manager";
import { useUser } from "@clerk/nextjs";

function FallbackLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <FallbackHeader />
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
              <div className="h-32 bg-gray-300 rounded mb-4"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { isLoaded, user } = useUser();
  const pathname = usePathname();
  const title = pathname === "/dashboard" ? "Dashboard" : "Admin";

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!user) {
      redirect("/sign-in");
    }
  }, [isLoaded, user]);

  if (!isLoaded) {
    return <FallbackLayout />;
  }

  if (!user) {
    return <FallbackLayout />;
  }

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
