"use client";

import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";
import { useWorkspace } from "@/contexts/workspace-context";
import { Moon, Sun } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title: string;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export default function Header({ title, theme, toggleTheme }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { workspaces, selectedWorkspace, setSelectedWorkspace } =
    useWorkspace();

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/admin", label: "Admin" },
  ];

  const selectedWorkspaceName = workspaces.find(
    (workspace) => workspace.id.toString() === selectedWorkspace
  )?.name;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md shadow-workspace-lighter sticky top-0 z-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Select value={selectedWorkspace} onValueChange={setSelectedWorkspace}>
          <SelectTrigger className="font-bold text-workspace-darker border-none p-0 focus:ring-0 min-w-[100px] max-w-[250px] truncate">
            <SelectValue>
              <span className="text-lg md:text-2xl lg:text-3xl truncate">
                {selectedWorkspace === "all"
                  ? "All Workspaces"
                  : selectedWorkspaceName}
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {workspaces.map((workspace) => (
              <SelectItem
                key={workspace.id}
                value={workspace.id.toString()}
                className="text-workspace-darker"
                style={{ color: workspace.color }}
              >
                {workspace.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-2 py-1 text-workspace rounded-md hover:text-workspace-darker hover:bg-gray-100 dark:text-workspace-lighter dark:hover:text-workspace-lighter2 dark:hover:bg-gray-700",
                  title.includes(link.label) &&
                    "text-workspace-darker dark:text-workspace-lighter2"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-workspace hover:text-workspace-darker hover:bg-gray-100 dark:text-workspace-lighter dark:hover:text-workspace-lighter2 dark:hover:bg-gray-700"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </Button>
          <UserButton />
          <button
            className="md:hidden text-workspace hover:text-workspace-darker dark:text-workspace-lighter dark:hover:text-workspace-lighter2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="px-4 py-2"></div>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "block px-4 py-2 text-workspace hover:text-workspace-darker dark:text-workspace-lighter dark:hover:text-workspace-lighter2 hover:bg-gray-100 dark:hover:bg-gray-700",
                title.includes(link.label) &&
                  "text-workspace-darker dark:text-workspace-lighter2 bg-gray-100 dark:bg-gray-700"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
