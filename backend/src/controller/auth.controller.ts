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
      sameSite: 'none',
      secure: true,
      maxAge: 1000 * 60 * 60 * 2,
      path: '/',
    });

    // res.cookie('token', token, {
    //   httpOnly: true,
    //   sameSite: 'none',
    //   secure: true,
    //   maxAge: 1000 * 60 * 60 * 2,
    //   path: '/',
    //   domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost'
    // });

    // Debug logs
    console.log('=== CALLBACK SUCCESS ===');
    console.log('User:', user.id);
    console.log('Token generated:', !!token);
    console.log('Redirecting to:', process.env.FRONTEND_URL);
    console.log('Cookie config:', {
      sameSite: 'none',
      secure: true,
      httpOnly: true
    });

    return res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);  
  } catch (err) {
    console.error('Error en googleCallback:', err);
    return res.redirect(`${process.env.FRONTEND_URL}?error=callback_error`);
  }
}

export function logout(_req: Request, res: Response) {
  res.clearCookie('token', { path: '/' });
  res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
}