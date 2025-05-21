import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getUserProcesses = async (userId: string) => {

  return prisma.process.findMany({
    where: { createdFor: userId },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      name: true,
      bpmnXml: true,
      createdAt: true,
      updatedAt: true,
      screenShot: true,
      createdFor: true,
    }
  });
};

export const getProcessByIdForUser = async (id: string, userId: string) => {
  return prisma.process.findFirst({
    where: {
      id,
      createdFor: userId
    }
  });
};