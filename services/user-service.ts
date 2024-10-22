import { PrismaClient } from "@prisma/client";
import { clerkClient } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

import { User } from "@/types/user";

export async function getAllUsers(): Promise<User[]> {
  return await prisma.user.findMany();
}

export async function createUser(userData: Omit<User, "id">): Promise<User> {
  return await prisma.user.create({
    data: userData,
  });
}

export async function syncUser(userId: string, clerkUser: { email: string }) {
  const user = await prisma.user.upsert({
    where: { clerkUserId: userId },
    update: {
      email: clerkUser.email,
      updatedAt: new Date(),
    },
    create: {
      email: clerkUser.email,
      clerkUserId: userId,
    },
  });

  return user;
}
