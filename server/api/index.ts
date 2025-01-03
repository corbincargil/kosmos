import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { taskRouter } from "@/server/api/routers/task-router";
import { workspaceRouter } from "./routers/workspace-router";
import { noteRouter } from "./routers/notes-router";

export const appRouter = createTRPCRouter({
  tasks: taskRouter,
  workspaces: workspaceRouter,
  notes: noteRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
