"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/trpc/react";
import { useToast } from "@/hooks/use-toast";
// import { OAuthProvider } from "@prisma/client";

export default function SchwabCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  console.log("searchParams", searchParams.get("code"));  
  const { toast } = useToast();
  const hasProcessed = useRef(false);
  
  const { mutate: handleCallback } = api.oauth.handleCallback.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Successfully connected to Schwab",
      });
      router.push("/finance/schwab");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      router.push("/finance/schwab");
    },
  });

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    
    if (code && state && !hasProcessed.current) {
      // hasProcessed.current = true;
      // handleCallback({ code, provider: OAuthProvider.SCHWAB, state });
    }
  }, [searchParams, handleCallback]);

  return <div>Connecting to Schwab...</div>;
} 