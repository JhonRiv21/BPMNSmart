import { PrismaClient } from '@prisma/client';
import { DuplicateProcessNameError } from '../errors/DuplicateProcessNameError.ts';
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

// Create process of the authenticated user by id
export const createProcessForUser = async (
  userId: string,
  data: {
    name: string;
    bpmnXml?: string;
    screenShot?: string;
  }
) => {
  const existing = await prisma.process.findFirst({
    where: {
      createdFor: userId,
      name: data.name,
    },
  });

  if (existing) {
    throw new DuplicateProcessNameError();
  }

  return prisma.process.create({
    data: {
      name: data.name,
      createdFor: userId,
      bpmnXml: data.bpmnXml ?? '',
      screenShot: data.screenShot ?? '',
    },
  });
};

// Update process of the authenticated user by id without historical (for autosave)
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

// Update process of the authenticated user by id WITH HISTORICAL
export const updateProcessForUserWithHistorical = async (
  id: string,
  userId: string,
  data: {
    name: string;
    bpmnXml?: string;
    screenShot?: string | null;
  }
) => {
  const existing = await prisma.process.findFirst({
    where: { id, createdFor: userId },
  });

  if (!existing) return null;

  const updateData: Record<string, any> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.bpmnXml !== undefined) updateData.bpmnXml = data.bpmnXml;
  if (data.screenShot !== undefined) updateData.screenShot = data.screenShot;

  const [_historical, updated] = await Promise.all([
    prisma.historical.create({
      data: {
        parentId: existing.id,
        name: existing.name,
        bpmnXml: existing.bpmnXml,
        screenShot: existing.screenShot,
        createdFor: userId,
      },
    }),
    prisma.process.update({
      where: { id },
      data: updateData,
    }),
  ]);

  return updated;
};

// Obtain process history by user and diagram
export const getProcessHistory = async (parentId: string, userId: string) => {
  return prisma.historical.findMany({
    where: {
      parentId,
      createdFor: userId,
    },
    orderBy: { createdAt: 'asc' },
  });
};

// Delete process of the authenticated user by id
export const deleteProcessForUser = async (id: string, userId: string) => {
  const existing = await prisma.process.findFirst({
    where: { id, createdFor: userId },
  });

  if (!existing) return null;

  await prisma.historical.deleteMany({
    where: { parentId: id },
  });

  return prisma.process.delete({
    where: { id },
  });
};
