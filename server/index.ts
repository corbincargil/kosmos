import { createCallerFactory, createTRPCRouter } from "./trpc";
import { taskRouter } from "./routers/task-router";

export const appRouter = createTRPCRouter({
  task: taskRouter,
  // Add other routers here
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
