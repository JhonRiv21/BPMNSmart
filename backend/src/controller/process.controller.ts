import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth/auth.middleware.ts';
import * as processService from '../services/process.service.ts';
import { DuplicateProcessNameError } from '../errors/DuplicateProcessNameError.ts';

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

// Create user process
export const createProcess = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { name, bpmnXml, screenShot } = req.body;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ error: 'Usuario no autenticado' });

  if (!name) {
    return res
      .status(400)
      .json({ error: 'Se requiere un nombre para el diagrama' });
  }

  try {
    const created = await processService.createProcessForUser(userId, {
      name,
      bpmnXml, 
      screenShot
    });
    res.status(201).json({
      message: 'Proceso creado correctamente',
      data: created,
    });
  } catch (e) {
    if (e instanceof DuplicateProcessNameError) {
      return res.status(400).json({ error: 'Ya tienes un proceso con ese nombre.' });
    }
    res.status(500).json({ error: 'Error al crear el proceso' });
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

    res.status(201).json({
      message: 'Proceso actualizado correctamente',
      data: updated,
    });
  } catch (e) {
    res.status(500).json({ error: 'Error al actualizar el proceso' });
  }
};

// Update user process by id
export const updateProcessWithHistorical = async (
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
    const updated = await processService.updateProcessForUserWithHistorical(id, userId, {
      name,
      bpmnXml,
      screenShot,
    });

    if (!updated)
      return res
        .status(404)
        .json({ error: 'Proceso no encontrado o no autorizado' });

    res.status(201).json({
      message: 'Proceso actualizado correctamente',
      data: updated,
    });
  } catch (e) {
    res.status(500).json({ error: 'Error al actualizar el proceso' });
  }
};

// Get process version history for a user
export const getProcessHistory = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { id: parentId } = req.params;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ error: 'Usuario no autenticado' });

  try {
    const history = await processService.getProcessHistory(parentId, userId);
    res.status(200).json({ data: history });
  } catch (e) {
    res.status(500).json({ error: 'Error al obtener historial del proceso' });
  }
};


// Delete user process by id
export const deleteProcess = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ error: 'Usuario no autenticado' });

  if (!id) {
    return res
      .status(400)
      .json({ error: 'No hay identificador para eliminar' });
  }

  try {
    const deleted = await processService.deleteProcessForUser(id, userId);

    if (!deleted)
      return res
        .status(404)
        .json({ error: 'Proceso no encontrado o no autorizado' });

    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: 'Error al eliminar el proceso' });
  }
};
