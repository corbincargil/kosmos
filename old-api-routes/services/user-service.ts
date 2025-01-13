import { PrismaClient } from "@prisma/client";

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

export async function syncUser(
  userId: string,
  clerkUser: { email: string }
): Promise<User> {
  let user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (user) {
    if (user.email !== clerkUser.email) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          email: clerkUser.email,
          updatedAt: new Date(),
        },
      });
    }
  } else {
    user = await prisma.user.create({
      data: {
        email: clerkUser.email,
        clerkUserId: userId,
      },
    });
  }

  return user;
}
