import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth/auth.middleware";
import * as processService from '../services/process.service.ts';

export const getMyProcess = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Usuario no autenticado' });

    const processes = await processService.getUserProcesses(userId);
    res.json(processes);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener procesos' });
  }
}

export const getProcessById  = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) return res.status(401).json({ error: 'Usuario no autenticado' });

    const processes = await processService.getProcessByIdForUser(id, userId);
    if (!process) return res.status(404).json({ error: 'Proceso no encontrado' });
    res.json(processes);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el proceso' });
  }
}