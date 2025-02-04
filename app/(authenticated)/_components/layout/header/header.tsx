"use client";

import { UserButton } from "@clerk/nextjs";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface HeaderProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export default function Header({ theme, toggleTheme }: HeaderProps) {
  return (
    <header className="p-2 lg:px-4 flex justify-between items-center dark:bg-gray-800 shadow-md shadow-workspace-lighter z-50">
      <SidebarTrigger className="text-workspace dark:hover:text-background" />
      <div className="flex items-center space-x-4 w-full justify-end">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-workspace hover:text-workspace-darker hover:bg-gray-100 dark:text-workspace-lighter dark:hover:text-workspace-lighter2 dark:hover:bg-gray-700"
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </Button>
        <UserButton />
      </div>
    </header>
  );
}
