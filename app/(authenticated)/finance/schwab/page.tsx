"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useRouter } from "next/navigation";
// import { api } from "@/trpc/react";
// import { OAuthProvider } from "@prisma/client";
// import { Button } from "@/components/ui/button";
// import SchwabAccounts from "./_components/accounts";

export default function SchwabPage() {
  // const router = useRouter();
  
  // const { data: authUrl } = api.oauth.getAuthUrl.useQuery({ provider: OAuthProvider.SCHWAB });
  // const { data: connection } = api.schwab.getAccounts.useQuery();

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Schwab Integration</CardTitle>
        </CardHeader>
        <CardContent>
          Under construction...
          {/* <div className="flex flex-col gap-4">
            {connection ? (
              <SchwabAccounts />
            ) : (
              <Button 
                onClick={() => {
                  if (authUrl) {
                    router.push(authUrl);
                  }
                }}
                className="w-fit"
                disabled={!authUrl}
              >
                Connect Schwab Account
              </Button>
            )}
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
 