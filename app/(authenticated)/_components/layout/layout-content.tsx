"use client";

import { ReactNode } from "react";
import Header from "@/app/(authenticated)/_components/layout/header/header";
import { AppSidebar } from "@/app/(authenticated)/_components/layout/sidebar/app-sidebar";

interface LayoutContentProps {
  children: ReactNode;
  modal?: ReactNode;
}

export function LayoutContent({ children, modal }: LayoutContentProps) {

  return (
    <div className="flex h-screen flex-col bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-1 w-full overflow-hidden">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto">
            <div className="h-full px-4 py-6">
              <div className="rounded-lg max-w-[120rem] mx-auto h-full">
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
