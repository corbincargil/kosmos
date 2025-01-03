import { UserSchema } from "@/types/user";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  syncUser: protectedProcedure
    .input(UserSchema.omit({ id: true, createdAt: true, updatedAt: true }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.upsert({
        where: { email: input.email },
        update: input,
        create: input,
      });
    }),
});
