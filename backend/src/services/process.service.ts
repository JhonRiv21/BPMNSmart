import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Get all processes of the authenticated user
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
    },
  });
};
// Get processes of the authenticated user by id
export const getProcessByIdForUser = async (id: string, userId: string) => {
  return prisma.process.findFirst({
    where: {
      id,
      createdFor: userId,
    },
  });
};

// Uodate process of the authenticated user by id
export const updateProcessForUser = async (
  id: string,
  userId: string,
  data: {
    name: string;
    bpmnXml?: string;
    screenShot?: string | null;
  }
) => {
  const existing = prisma.process.findFirst({
    where: { id, createdFor: userId },
  });

  if (!existing) return null;

  const updateData: Record<string, any> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.bpmnXml !== undefined) updateData.bpmnXml = data.bpmnXml;
  if (data.screenShot !== undefined) updateData.screenShot = data.screenShot;

  return prisma.process.update({
    where: { id },
    data: updateData,
  });
};
