import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TaskSchema, TaskStatus } from "@/types/task";

export const taskRouter = createTRPCRouter({
  getCurrentWorkspaceTasks: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.task.findMany({
        where: {
          userId: Number(ctx.userId),
          workspaceId: Number(input.workspaceId),
        },
      });
    }),
  createTask: protectedProcedure
    .input(TaskSchema.omit({ id: true, createdAt: true, updatedAt: true }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.create({ data: input });
    }),
  updateTask: protectedProcedure
    .input(TaskSchema.omit({ createdAt: true, updatedAt: true }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.update({
        where: { id: input.id },
        data: input,
      });
    }),
  updateTaskStatus: protectedProcedure
    .input(z.object({ id: z.number(), status: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.update({
        where: { id: input.id },
        data: { status: input.status as TaskStatus },
      });
    }),
});
