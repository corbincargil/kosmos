import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { taskRouter } from "@/server/api/routers/task-router";
import { workspaceRouter } from "./routers/workspace-router";
import { noteRouter } from "./routers/notes-router";
import { userRouter } from "./routers/user-router";
import { schwabRouter } from "./routers/schwab-router";
import { oauthRouter } from "./routers/oauth-router";

export const appRouter = createTRPCRouter({
  users: userRouter,
  tasks: taskRouter,
  workspaces: workspaceRouter,
  notes: noteRouter,
  
  oauth: oauthRouter,
  schwab: schwabRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
