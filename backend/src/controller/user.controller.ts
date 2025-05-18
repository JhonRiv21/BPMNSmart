import { Request, Response } from "express";
import * as userService from '../services/user.service.ts'

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const user = await userService.getAllUsers();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuarios' })
  }
}