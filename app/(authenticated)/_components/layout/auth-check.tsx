"use client";

import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ReactNode, useEffect } from "react";

export function AuthCheck({ children }: { children: ReactNode }) {
  const { isLoaded, user } = useUser();

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) redirect("/sign-in");
  }, [isLoaded, user]);

  return <>{children}</>;
}
