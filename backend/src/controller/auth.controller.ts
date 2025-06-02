import { Request, Response, NextFunction } from 'express';
import { generateJwtToken } from '../services/auth.service.ts';
import { User } from '@prisma/client';

export async function googleCallback(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user as User;
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    }

    const token = generateJwtToken(user);
    
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 2,
      path: '/',
    });

    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  } catch (err) {
    console.error('Error en googleCallback:', err);
    return next(err);
  }
}

export function logout(_req: Request, res: Response) {
  res.clearCookie('token', { path: '/' });
  res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
}