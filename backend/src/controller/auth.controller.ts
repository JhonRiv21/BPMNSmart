import { Request, Response, NextFunction } from 'express';
import { generateJwtToken } from '../services/auth.service.ts';
import { User } from '@prisma/client';

export async function googleCallback(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user as User;
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?error=no_user`);
    }

    const token = generateJwtToken(user);
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 1000 * 60 * 60 * 2,
    });

    // res.cookie('token', token, {
    //   httpOnly: true,
    //   sameSite: 'none',
    //   secure: true,
    //   maxAge: 1000 * 60 * 60 * 2,
    //   path: '/',
    //   domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost'
    // });

    return res.redirect(`${process.env.FRONTEND_URL}`);  
  } catch (err) {
    console.error('Error en googleCallback:', err);
    return res.redirect(`${process.env.FRONTEND_URL}?error=callback_error`);
  }
}

export function logout(_req: Request, res: Response) {
  res.clearCookie('token', { path: '/' });
  res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
}