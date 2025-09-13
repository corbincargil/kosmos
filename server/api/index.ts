import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { taskRouter } from "@/server/api/routers/task-router";
import { workspaceRouter } from "./routers/workspace-router";
import { noteRouter } from "./routers/notes-router";
import { userRouter } from "./routers/user-router";
import { schwabRouter } from "./routers/schwab-router";
import { oauthRouter } from "./routers/oauth-router";
import { tagRouter } from "./routers/tag-router";
import { taskTypeRouter } from "./routers/task-type-router";
import { authorRouter } from "./routers/author-router";
import { postRouter } from "./routers/post-router";
import { sermonRouter } from "./routers/sermon-router";

export const appRouter = createTRPCRouter({
  users: userRouter,
  tasks: taskRouter,
  workspaces: workspaceRouter,
  notes: noteRouter,
  tags: tagRouter,
  taskTypes: taskTypeRouter,
  oauth: oauthRouter,
  schwab: schwabRouter,
  authors: authorRouter,
  posts: postRouter,
  sermons: sermonRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
