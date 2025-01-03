"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";

export default function SignedInPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  const { mutate: syncUserMutation } = api.users.syncUser.useMutation({
    onSuccess: () => {
      router.push("/dashboard");
    },
    onError: (error) => {
      console.error(error);
    },
  });

  useEffect(() => {
    if (isLoaded && isSignedIn && user?.primaryEmailAddress?.emailAddress) {
      syncUserMutation({
        clerkUserId: user.id,
        email: user.primaryEmailAddress.emailAddress,
      });
    }
  }, [isLoaded, isSignedIn, user, syncUserMutation]);

  if (isLoaded && !isSignedIn) {
    router.push("/");
    return <div>Redirecting to home...</div>;
  }

  if (!user?.primaryEmailAddress?.emailAddress) {
    return <div>Error: Could not fetch user email address from Clerk</div>;
  }

  return <div>Syncing user data...</div>;
}
