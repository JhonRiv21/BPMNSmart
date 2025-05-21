import { Request, RequestHandler, Response } from 'express';
import * as userService from '../services/user.service.ts';
import jwt from 'jsonwebtoken';

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

// Create user
export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, name, lastName, password } = req.body;

    if (!email || !name || !lastName || !password) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const duplicated = await userService.findUserByEmail(email);
    if (duplicated) {
      return res.status(409).json({ error: 'El usuario ya existe' });
    }

    const newUser = await userService.createUser({
      email,
      name,
      lastName,
      password,
    });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

// Login and generate token
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y password requeridos' });
  }

  const user = await userService.authenticateUser(email, password);

  if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: '2h' }
  );

  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword, token });
};
