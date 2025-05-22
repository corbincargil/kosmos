import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { CreateTaskTypeSchema, TaskTypeSchema, UpdateTaskTypeSchema } from "@/types/task-type";


export const taskTypeRouter = createTRPCRouter({
  getTaskTypesByWorkspaceId: protectedProcedure
    .input(z.object({ workspaceId: z.number() }))
    .query(async ({ ctx, input }) => {
      const taskTypes = await ctx.db.taskType.findMany({
        where: {
          workspaceId: input.workspaceId,
        },
        orderBy: {
          name: 'asc',
        },
      });

      // Get task counts for each task type
      const taskTypesWithCounts = await Promise.all(
        taskTypes.map(async (taskType) => {
          const taskCount = await ctx.db.task.count({
            where: {
              taskTypeId: taskType.autoId,
            },
          });
          return {
            ...taskType,
            taskCount,
          };
        })
      );

      return taskTypesWithCounts;
    }),

  createTaskType: protectedProcedure
    .input(CreateTaskTypeSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.taskType.create({
        data: input,
      });
    }),

  updateTaskType: protectedProcedure
    .input(z.object({
      autoId: z.number(),
      data: UpdateTaskTypeSchema,
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.taskType.update({
        where: { autoId: input.autoId },
        data: input.data,
      });
    }),

  deleteTaskType: protectedProcedure
    .input(z.object({ autoId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Check if task type is used by any tasks
      const taskCount = await ctx.db.task.count({
        where: { taskTypeId: input.autoId },
      });

      if (taskCount > 0) {
        throw new Error("Cannot delete task type that is in use by tasks");
      }

      return ctx.db.taskType.delete({
        where: { autoId: input.autoId },
      });
    }),
}); 