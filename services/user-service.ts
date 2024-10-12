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
