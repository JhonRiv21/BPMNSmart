import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Get all users - Require auth -
export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      lastName: true,
    },
  });
};