import { Router, RequestHandler } from 'express';
import { refreshTokenIfNeeded, verifyToken } from '../middlewares/auth/auth.middleware.ts';
import * as processController from '../controller/process.controller.ts';
const router = Router();

router.get(
  '/',
  verifyToken as RequestHandler,
  refreshTokenIfNeeded as RequestHandler,
  processController.getMyProcess as RequestHandler
);
router.get(
  '/:id',
  verifyToken as RequestHandler,
  refreshTokenIfNeeded as RequestHandler,
  processController.getProcessById as RequestHandler
);
router.get(
  '/historical/:id',
  verifyToken as RequestHandler,
  refreshTokenIfNeeded as RequestHandler,
  processController.getProcessHistory as RequestHandler
);
router.post(
  '/create',
  verifyToken as RequestHandler,
  refreshTokenIfNeeded as RequestHandler,
  processController.createProcess as RequestHandler
);
router.put(
  '/:id',
  verifyToken as RequestHandler,
  refreshTokenIfNeeded as RequestHandler,
  processController.updateProcess as RequestHandler
);
router.put(
  '/historical/:id',
  verifyToken as RequestHandler,
  refreshTokenIfNeeded as RequestHandler,
  processController.updateProcessWithHistorical as RequestHandler
);
router.delete(
  '/:id',
  verifyToken as RequestHandler,
  refreshTokenIfNeeded as RequestHandler,
  processController.deleteProcess as RequestHandler
);

export default router;
