import { initTRPC, TRPCError } from "@trpc/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/server/db";
import superjson from "superjson";
import { ZodError } from "zod";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const user = await currentUser();
  console.log("user", user);

  return {
    db,
    userId: user?.publicMetadata.dbUserId,
    ...opts,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;

const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    const waitMs = Math.floor(Math.random() * 200) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  console.log(`[TRPC] ${path} - took ${end - start}ms to execute`);

  return result;
});

// const isAuthed = t.middleware(({ ctx, next }) => {
//   if (!ctx.user?.id) {
//     throw new TRPCError({ code: "UNAUTHORIZED" });
//   }
//   return next({ ctx: { user: ctx.user } });
// });

export const protectedProcedure = t.procedure.use(timingMiddleware);
// .use(isAuthed);
