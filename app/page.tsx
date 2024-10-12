"use client";

import { SignIn, useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function Home() {
  const { userId } = useAuth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignIn routing="hash" />
    </div>
  );
}
