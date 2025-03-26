import { OAuthProvider } from "@prisma/client";
import { type PrismaClient } from "@prisma/client";

const SCHWAB_TOKEN_URL = "https://api.schwabapi.com/v1/oauth/token";

export async function refreshOAuthConnection(
  db: PrismaClient,
  userId: number,
  provider: OAuthProvider
) {
  const connection = await db.oAuthConnection.findFirst({
    where: {
      userId,
      provider,
    },
  });

  if (!connection) {
    throw new Error(`No ${provider} connection found`);
  }

  let tokens;
  switch (provider) {
    case OAuthProvider.SCHWAB: {
      const response = await fetch(SCHWAB_TOKEN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${process.env.SCHWAB_APP_KEY}:${process.env.SCHWAB_SECRET}`
          ).toString("base64")}`,
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: connection.refreshToken,
        }).toString(),
      });

      const responseBody = await response.json();
      if (!response.ok) {
        throw new Error(`Failed to refresh token: ${JSON.stringify(responseBody)}`);
      }
      tokens = responseBody;
      break;
    }
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }

  return await db.oAuthConnection.update({
    where: {
      userId_provider: {
        userId,
        provider,
      },
    },
    data: {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
    },
  });
} 