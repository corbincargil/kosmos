"use client";

import { UserButton } from "@clerk/nextjs";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ThemeSelect from "../../theme/theme-select";

export default function Header() {
  return (
    <header className="p-2 lg:px-4 flex justify-between items-center dark:bg-gray-800 shadow-md shadow-workspace-lighter z-50">
      <SidebarTrigger className="text-workspace dark:hover:text-background" />
      <div className="flex items-center space-x-4 w-full justify-end">
        <ThemeSelect />
        <UserButton />
      </div>
    </header>
  );
}
