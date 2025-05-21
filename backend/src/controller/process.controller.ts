import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth/auth.middleware';
import * as processService from '../services/process.service.ts';

// Get user process
export const getMyProcess = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ error: 'Usuario no autenticado' });

    const processes = await processService.getUserProcesses(userId);
    res.json(processes);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener procesos' });
  }
};

// Get user process by id
export const getProcessById = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId)
      return res.status(401).json({ error: 'Usuario no autenticado' });

    const processes = await processService.getProcessByIdForUser(id, userId);
    if (!process)
      return res.status(404).json({ error: 'Proceso no encontrado' });
    res.json(processes);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el proceso' });
  }
};

// Update user process by id
export const updateProcess = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { id } = req.params;
  const { name, bpmnXml, screenShot } = req.body;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ error: 'Usuario no autenticado' });

  if (name === undefined && bpmnXml === undefined && screenShot === undefined) {
    return res.status(400).json({ error: 'No hay campos para actualizar' });
  }

  try {
    const updated = await processService.updateProcessForUser(id, userId, {
      name,
      bpmnXml,
      screenShot,
    });

    if (!updated)
      return res
        .status(404)
        .json({ error: 'Proceso no encontrado o no autorizado' });

    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: 'Error al actualizar el proceso' });
  }
};
