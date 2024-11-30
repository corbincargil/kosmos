import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { taskRouter } from "@/server/api/routers/task-router";
import { workspaceRouter } from "./routers/workspace-router";

export const appRouter = createTRPCRouter({
  tasks: taskRouter,
  workspaces: workspaceRouter,
  // Add other routers here
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
