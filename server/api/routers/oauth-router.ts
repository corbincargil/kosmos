import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { OAuthProvider } from "@prisma/client";
import { refreshOAuthConnection } from "../../utils/oauth";

const SCHWAB_AUTH_URL = "https://api.schwabapi.com/v1/oauth/authorize";
const SCHWAB_TOKEN_URL = "https://api.schwabapi.com/v1/oauth/token";

export const oauthRouter = createTRPCRouter({
  getAuthUrl: protectedProcedure
    .input(z.object({
      provider: z.nativeEnum(OAuthProvider),
    }))
    .query(async ({ ctx, input }) => {
      const state = crypto.randomUUID();

      await ctx.db.oAuthState.create({
        data: {
          state,
          userId: Number(ctx.userId),
          provider: input.provider,
          expiresAt: new Date(Date.now() + 1000 * 60 * 10), // 10 minutes
        },
      });

      switch (input.provider) {
        case OAuthProvider.SCHWAB: {
          const params = new URLSearchParams({
            response_type: "code",
            client_id: process.env.SCHWAB_APP_KEY!,
            redirect_uri: process.env.SCHWAB_REDIRECT_URI!,
            state,
            scope: "api",
          });
          return `${SCHWAB_AUTH_URL}?${params.toString()}`;
        }
        default:
          throw new Error(`Unsupported provider: ${input.provider}`);
      }
    }),

  handleCallback: protectedProcedure
    .input(z.object({
      code: z.string(),
      state: z.string(),
      provider: z.nativeEnum(OAuthProvider),
    }))
    .mutation(async ({ ctx, input }) => {
      const savedState = await ctx.db.oAuthState.findFirst({
        where: {
          state: input.state,
          userId: Number(ctx.userId),
          provider: input.provider,
          used: false,
          expiresAt: { gt: new Date() },
        },
      });

      if (!savedState) {
        throw new Error("Invalid OAuth state");
      }

      let tokens;
      switch (input.provider) {
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
              grant_type: "authorization_code",
              code: input.code,
              redirect_uri: process.env.SCHWAB_REDIRECT_URI!,
            }).toString(),
          });

          const responseBody = await response.json();
          if (!response.ok) {
            throw new Error(`Schwab API error: ${JSON.stringify(responseBody)}`);
          }
          tokens = responseBody;
          break;
        }
        default:
          throw new Error(`Unsupported provider: ${input.provider}`);
      }

      await ctx.db.oAuthConnection.upsert({
        where: {
          userId_provider: {
            userId: Number(ctx.userId),
            provider: input.provider,
          },
        },
        create: {
          userId: Number(ctx.userId),
          provider: input.provider,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
        },
        update: {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
        },
      });

      await ctx.db.oAuthState.update({
        where: { id: savedState.id },
        data: { used: true },
      });

      return { success: true };
    }),

  refreshConnection: protectedProcedure
    .input(z.object({
      provider: z.nativeEnum(OAuthProvider),
    }))
    .mutation(async ({ ctx, input }) => {
      await refreshOAuthConnection(ctx.db, Number(ctx.userId), input.provider);
      return { success: true };
    }),

  hasConnection: protectedProcedure
    .input(z.object({
      provider: z.nativeEnum(OAuthProvider),
    }))
    .query(async ({ ctx, input }) => {
      const connection = await ctx.db.oAuthConnection.findFirst({
        where: {
          userId: Number(ctx.userId),
          provider: input.provider,
        },
      });

      return !!connection;
    }),
});
