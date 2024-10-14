"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignedInPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      fetch("/api/sync-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
        }),
      })
        .then((response) => response.json())
        .then(() => {
          // Redirect to dashboard after successful sync
          router.push("/dashboard");
        })
        .catch((error) => console.error("Error syncing user:", error));
    } else if (isLoaded && !isSignedIn) {
      // If not signed in, redirect to home page
      router.push("/");
    }
  }, [isLoaded, isSignedIn, user, router]);

  return <div>Redirecting to dashboard...</div>;
}
