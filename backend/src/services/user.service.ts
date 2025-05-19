import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bycript from 'bcrypt'

export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      lastName: true,
    }
  });
};

export const createUser = async ({ email, name, lastName, password }: {
  email: string;
  name: string;
  lastName: string;
  password: string;
}) => {
  const hashedPassword = await bycript.hash(password, 8);

  return prisma.user.create({
    data: {
      email,
      name,
      lastName,
      password: hashedPassword,
    }
  });
};

export const findUserByEmail = (email: string) => {
  return prisma.user.findUnique({
    where: { email }
  });
};

export const authenticateUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const isPasswordValid = await bycript.compare(password, user.password);
  if (!isPasswordValid) return null;

  return user;
};