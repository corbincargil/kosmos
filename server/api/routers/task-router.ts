import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TaskSchema } from "@/types/task";
import { TaskStatus } from "@prisma/client";
import { buildWhereClause, parseFilterString } from "../filters/middleware";

export const taskRouter = createTRPCRouter({
  getTasks: protectedProcedure
    .input(
      z.object({
        filters: z.string().optional(),
        workspaceId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const filterParams = parseFilterString(input.filters ?? null);
      const whereClause = buildWhereClause(filterParams);
      
      if (input.workspaceId === "all") {
        return ctx.db.task.findMany({
          where: {
            userId: Number(ctx.userId),
            ...whereClause
          },
          include: {
            tags: {
              select: {
                tag: {
                  select: {
                    autoId: true,
                    name: true,
                    color: true,
                  }
                }
              }
            },
            taskType: {
              select: {
                autoId: true,
                name: true,
                color: true,
                icon: true,
              }
            }
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
          ...whereClause
        },
        include: {
          tags: {
            select: {
              tag: {
                select: {
                  autoId: true,
                  name: true,
                  color: true,
                }
              }
            }
          },
          taskType: {
            select: {
              autoId: true,
              name: true,
              color: true,
              icon: true,
            }
          }
        },
        orderBy: [
          { priority: { sort: "desc", nulls: "last" } },
          { createdAt: "desc" },
        ],
      });
    }),
  getTaskByUuid: protectedProcedure
    .input(z.object({ uuid: z.string() }))
    .query(async ({ ctx, input }) => {
      const task = await ctx.db.task.findUnique({ 
        where: { uuid: input.uuid },
        include: { 
          tags: { 
            select: { 
              tag: {
                select: {
                  autoId: true,
                  name: true,
                  color: true,
                }
              }
            } 
          },
          taskType: {
            select: {
              autoId: true,
              name: true,
              color: true,
              icon: true,
            }
          }
        }
      });
      return task ? {
        ...task,
        tags: task.tags.map(t => t.tag)
      } : null;
    }),
  createTask: protectedProcedure
    .input(
      TaskSchema.omit({
        id: true,
        uuid: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { tags, ...data } = input;
      return ctx.db.task.create({
        data: {
          ...data,
          userId: Number(ctx.userId),
          tags: tags ? {
            create: tags.map(tagId => ({
              tag: {
                connect: {
                  autoId: tagId
                }
              }
            }))
          } : undefined
        },
        include: {
          tags: {
            include: {
              tag: true
            }
          },
          taskType: true
        }
      });
    }),
  updateTask: protectedProcedure
    .input(TaskSchema.omit({ createdAt: true, updatedAt: true, userId: true }))
    .mutation(async ({ ctx, input }) => {
      const { tags, ...data } = input;
      return ctx.db.task.update({
        where: { id: input.id },
        data: {
          ...data,
          tags: tags ? {
            deleteMany: {},
            create: tags.map(tagId => ({
              tag: {
                connect: {
                  autoId: tagId
                }
              }
            }))
          } : undefined
        },
        include: {
          tags: {
            include: {
              tag: true
            }
          },
          taskType: true
        }
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
  deleteTask: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.delete({ where: { id: input } });
    }),
});
