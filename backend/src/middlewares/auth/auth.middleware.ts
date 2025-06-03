import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { findUserById, generateJwtToken } from '../../services/auth.service.ts';

export interface UserPayload {
  id: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

export function verifyToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  let token: string | undefined = req.cookies.token;

  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ error: 'Acceso denegado: No se proporcionó token.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
    req.user = decoded;
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado.' });
    }
    return res.status(403).json({ error: 'Token inválido.' });
  }
}

export async function refreshTokenIfNeeded(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.token;
  if (!token) return next();

  try {
    const decoded = jwt.decode(token) as { id: string; exp: number };
    if (!decoded || !decoded.exp) return next();

    const now = Math.floor(Date.now() / 1000);
    const expiresIn = decoded.exp - now;

    if (expiresIn < 30 * 60 && req.user) {
      const user = await findUserById(decoded.id);
      if (user) {
        const newToken = generateJwtToken(user);
        res.cookie('token', newToken, {
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          maxAge: 1000 * 60 * 60 * 2,
          path: '/',
        });
      }
    }
    next();
  } catch (err) {
    console.error('refreshTokenIfNeeded error:', err);
    next();
  }
}
