import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TaskSchema, TaskStatus } from "@/types/task";

export const taskRouter = createTRPCRouter({
  getTasks: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (input.workspaceId === "all") {
        return ctx.db.task.findMany({
          where: {
            userId: Number(ctx.userId),
          },
          orderBy: [
            { priority: { sort: "desc", nulls: "last" } },
            { createdAt: "desc" },
          ],
        });
      }
      return ctx.db.task.findMany({
        where: {
          userId: Number(ctx.userId),
          workspaceUuid: input.workspaceId,
        },
        orderBy: [
          { priority: { sort: "desc", nulls: "last" } },
          { createdAt: "desc" },
        ],
      });
    }),
  createTask: protectedProcedure
    .input(
      TaskSchema.omit({
        id: true,
        createdAt: true,
        updatedAt: true,
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.create({
        data: { ...input },
      });
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
    .input(z.object({ id: z.number(), status: z.string() })) //? update to include workspaceId and userId ?
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.update({
        where: { id: input.id },
        data: { status: input.status as TaskStatus },
      });
    }),
  deleteTask: protectedProcedure
    .input(z.number()) //? update to include workspaceId and userId ?
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.delete({ where: { id: input } });
    }),
});
