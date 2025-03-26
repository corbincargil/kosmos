import { createTRPCRouter, protectedProcedure } from "../trpc";
import { OAuthProvider } from "@prisma/client";
import { SchwabAccountsResponseSchema } from "@/types/schwab";
import { refreshOAuthConnection } from "@/server/utils/oauth";

export const schwabRouter = createTRPCRouter({
  getAccounts: protectedProcedure.query(async ({ ctx }) => {
    let connection = await ctx.db.oAuthConnection.findFirst({
      where: {
        userId: Number(ctx.userId),
        provider: OAuthProvider.SCHWAB,
      },
    });

    if (!connection) {
      throw new Error("No Schwab connection found");
    }

    if (connection.expiresAt < new Date()) {
      connection = await refreshOAuthConnection(ctx.db, Number(ctx.userId), OAuthProvider.SCHWAB);
    }

    if (!connection) {
      console.error("Failed to refresh Schwab connection");
      throw new Error("Failed to refresh Schwab connection");
    }

    const response = await fetch("https://api.schwabapi.com/trader/v1/accounts", {
      headers: {
        Authorization: `Bearer ${connection.accessToken}`,
      },
    });

    const rawData = await response.json();
    
    const parsedData = SchwabAccountsResponseSchema.parse(rawData);
    
    return parsedData;
  }),
}); 

