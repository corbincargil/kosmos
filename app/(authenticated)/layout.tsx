"use client";

import Header from "@/components/header/header";
import FallbackHeader from "@/components/header/fallback-header";
import { redirect } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { WorkspaceProvider } from "@/contexts/workspace-context";
import { useUser } from "@clerk/nextjs";
import { useThemeManager } from "@/components/theme-manager";

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
  modal,
}: {
  children: ReactNode;
  modal?: ReactNode;
}) {
  const { isLoaded, user } = useUser();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme) {
      setTheme(savedTheme as "light" | "dark");
    } else if (systemPrefersDark) {
      setTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

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
    <WorkspaceProvider theme={theme}>
      <ThemeManagerWrapper theme={theme}>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
          <Header theme={theme} toggleTheme={toggleTheme} />
          <main>
            <div className="max-w-7xl mx-auto py-4 sm:px-6 lg:px-8">
              <div className="p-2 sm:p-4 sm:px-0">
                {children}
                {modal}
              </div>
            </div>
          </main>
        </div>
      </ThemeManagerWrapper>
    </WorkspaceProvider>
  );
}

function ThemeManagerWrapper({
  children,
  theme,
}: {
  children: ReactNode;
  theme: "light" | "dark";
}) {
  useThemeManager(theme);
  return <>{children}</>;
}
