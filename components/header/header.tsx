"use client";

import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";
import { useWorkspace } from "@/contexts/workspace-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
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
    <header className="bg-white shadow-md shadow-[color:var(--accent-lighter)]">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Select value={selectedWorkspace} onValueChange={setSelectedWorkspace}>
          <SelectTrigger className="font-bold text-[color:var(--accent-darker)] border-none p-0 focus:ring-0 min-w-[100px] max-w-[250px] truncate">
            <SelectValue>
              <span className="text-lg md:text-2xl lg:text-3xl truncate">
                {selectedWorkspace === "all"
                  ? "All Workspaces"
                  : selectedWorkspaceName}
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              value="all"
              className="text-[color:var(--accent-darker)]"
              style={{ color: "#000000" }}
            >
              All
            </SelectItem>
            {workspaces.map((workspace) => (
              <SelectItem
                key={workspace.id}
                value={workspace.id.toString()}
                className="text-[color:var(--accent-darker)]"
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
                  "text-[color:var(--accent-color)] hover:text-[color:var(--accent-darker)]",
                  title.includes(link.label) &&
                    "text-[color:var(--accent-darker)]"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <UserButton />
          <button
            className="md:hidden text-gray-600 hover:text-gray-900"
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
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2"></div>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "block px-4 py-2 text-[color:var(--accent-color)] hover:text-[color:var(--accent-darker)] hover:bg-gray-100",
                title.includes(link.label) &&
                  "text-[color:var(--accent-darker)] bg-gray-100"
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
