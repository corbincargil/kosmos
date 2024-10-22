"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SignedInPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      setIsSyncing(true);
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
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to sync user");
          }
          return response.json();
        })
        .then(async () => {
          await user.reload();
          router.push("/dashboard");
        })
        .catch((error) => {
          console.error("Error syncing user:", error);
          setSyncError("Failed to sync user. Please try again.");
        })
        .finally(() => {
          setIsSyncing(false);
        });
    } else if (isLoaded && !isSignedIn) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, user, router]);

  if (isSyncing) {
    return <div>Syncing user data...</div>;
  }

  if (syncError) {
    return <div>Error: {syncError}</div>;
  }

  return <div>Redirecting to dashboard...</div>;
}
