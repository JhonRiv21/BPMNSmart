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

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, name, lastName, password } = req.body;

    if (!email || !name || !lastName || !password) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    };

    const duplicated = await userService.findUserByEmail(email);
    if (duplicated) {
      return res.status(409).json({ error: 'El usuario ya existe' });
    }
    
    const newUser = await userService.createUser({ email, name, lastName, password });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear usuario' });
  }
}