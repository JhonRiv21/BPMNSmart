import { PrismaClient, User } from "@prisma/client";
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient();

export async function findOrCreateUserByGoogle(profile: {
  email: string;
  firstName: string;
  lastNames: string;
}): Promise<User> {
  const { email, firstName, lastNames } = profile;
  
  let user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name: firstName,
        lastNames,
      }
    });
  }

  return user;
}

export function generateJwtToken(user: User): string {
  const payload = { id: user.id, email: user.email };
  const secret = process.env.JWT_SECRET!;

  const options: jwt.SignOptions = { expiresIn: 2 * 60 * 60 };

  return jwt.sign(payload, secret, options);
}

export async function findUserById(id: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { id }
  });
  return user;
}