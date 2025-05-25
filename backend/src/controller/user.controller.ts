import { Request, RequestHandler, Response } from 'express';
import * as userService from '../services/user.service.ts';

// Get all users - Require auth -
export const getAllUsers: RequestHandler = async (
  _req: Request,
  res: Response
) => {
  try {
    const user = await userService.getAllUsers();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};