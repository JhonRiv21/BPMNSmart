// src/middlewares/auth/auth.middleware.ts
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface UserPayload {
  id: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

export function verifyToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  let token: string | undefined = req.cookies.token;

  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado: No se proporcionó token.' });
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