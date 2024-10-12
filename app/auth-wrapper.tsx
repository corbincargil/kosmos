"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
    } else if (isLoaded && isSignedIn && user) {
      // Sync user with database
      fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.primaryEmailAddress?.emailAddress,
        }),
      }).catch((error) => console.error("Error syncing user:", error));
    }
  }, [isLoaded, isSignedIn, user, router]);

  if (!isLoaded) {
    return null;
  }

  // Remove the SignIn component and conditional rendering
  return <>{children}</>;
}
